import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import OutfitMonthGrid from "../components/OutfitMonthGrid";
import OutfitLookPickerModal from "../components/OutfitLookPickerModal";
import OutfitDetailModal from "../components/OutfitDetailModal";
import { FONTS } from "../constants/fonts";
import { getStyles } from "../stylesheets/outfitPlannerScreen";
import { fetchMonth, createFromLook, movePlan, OutfitPlan } from "../utils/outfitPlans";
import { addMonths, monthKey, shortDateLabel } from "../utils/date";

type Mode =
  | { type: "normal" }
  | { type: "move"; fromDate: string };

const IS_IOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

export default function OutfitPlannerScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // Cache: Map keyed by "YYYY-MM" → Record<dateStr, OutfitPlan>
  const [cache, setCache] = useState<Map<string, Record<string, OutfitPlan>>>(new Map());
  const [monthLoading, setMonthLoading] = useState(false);

  const [mode, setMode] = useState<Mode>({ type: "normal" });

  // Look picker — the single entry point for adding/replacing an outfit
  const [lookPickerDate, setLookPickerDate] = useState<string | null>(null);
  const [lookPickerExisting, setLookPickerExisting] = useState<OutfitPlan | null>(null);
  const [lookPickerSaving, setLookPickerSaving] = useState(false);

  // Detail view for an occupied date
  const [detailPlan, setDetailPlan] = useState<OutfitPlan | null>(null);
  const [detailDate, setDetailDate] = useState<string | null>(null);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);
  const isSmall = width === 375 && height === 667;
  const headerHeight = IS_IOS26 ? (isSmall ? 79 : 107) : 0;

  const entriesByDate = cache.get(monthKey(year, month)) ?? {};

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigation.navigate("First");
          return;
        }
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (error) {
          Alert.alert("Error", "Please try again later.", [{ text: "OK" }]);
          return;
        }
        setProfile(profileData);
        setLoading(false);
      } catch {
        navigation.navigate("SignIn");
      }
    };
    checkSession();
  }, []);

  const loadMonth = useCallback(async (y: number, m: number, profileId: string) => {
    setMonthLoading(true);
    try {
      const data = await fetchMonth(profileId, y, m);
      setCache((prev) => new Map(prev).set(monthKey(y, m), data));
    } catch {
      Alert.alert("Error", "Failed to load your outfit planner.");
    } finally {
      setMonthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    loadMonth(year, month, profile.id);
  }, [year, month, profile]);

  // Refetch on focus in case a try-on was deleted elsewhere (ON DELETE CASCADE)
  useFocusEffect(
    useCallback(() => {
      if (!profile) return;
      loadMonth(year, month, profile.id);
    }, [year, month, profile])
  );

  const handleChangeMonth = (delta: number) => {
    const next = addMonths(year, month, delta);
    setYear(next.year);
    setMonth(next.month);
    setMode({ type: "normal" });
  };

  const handleDayPress = (dateStr: string) => {
    if (mode.type === "move") {
      const from = mode.fromDate;
      setMode({ type: "normal" });
      if (from === dateStr) return;

      const targetPlan = entriesByDate[dateStr] ?? null;
      const msg = targetPlan
        ? `Swap ${shortDateLabel(from)} outfit with ${shortDateLabel(dateStr)}?`
        : `Move outfit to ${shortDateLabel(dateStr)}?`;

      Alert.alert("Move outfit", msg, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await movePlan(from, dateStr);
              setCache((prev) => {
                const [fy, fm] = from.split("-").map(Number);
                const next = new Map(prev);
                next.delete(monthKey(year, month));
                next.delete(monthKey(fy, fm));
                return next;
              });
              await loadMonth(year, month, profile.id);
            } catch {
              Alert.alert("Error", "Failed to move outfit. Please try again.");
            }
          },
        },
      ]);
      return;
    }

    const plan = entriesByDate[dateStr] ?? null;
    if (plan) {
      setDetailPlan(plan);
      setDetailDate(dateStr);
    } else {
      setLookPickerDate(dateStr);
      setLookPickerExisting(null);
    }
  };

  const closeLookPicker = () => {
    setLookPickerDate(null);
    setLookPickerExisting(null);
  };

  const handleLookSelected = async (sourceId: number) => {
    if (!lookPickerDate) return;
    setLookPickerSaving(true);
    try {
      await createFromLook(profile.id, lookPickerDate, "avatar_tryon", String(sourceId), lookPickerExisting);
      closeLookPicker();
      await loadMonth(year, month, profile.id);
    } catch {
      Alert.alert("Error", "Failed to save outfit. Please try again.");
    } finally {
      setLookPickerSaving(false);
    }
  };

  const handleDetailClose = async (needsRefresh: boolean) => {
    setDetailPlan(null);
    setDetailDate(null);
    if (needsRefresh) {
      await loadMonth(year, month, profile.id);
    }
  };

  const handleMoveStart = (fromDate: string) => {
    setDetailPlan(null);
    setDetailDate(null);
    setMode({ type: "move", fromDate });
  };

  const handleReplace = (dateStr: string, plan: OutfitPlan) => {
    setDetailPlan(null);
    setDetailDate(null);
    setLookPickerDate(dateStr);
    setLookPickerExisting(plan);
  };

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text className={styles.loadingText} style={{ fontFamily: FONTS.SATOSHI }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View className={styles.container} style={{ paddingTop: IS_IOS26 ? 0 : insets.top, paddingBottom: insets.bottom }}>
      <HeaderNav navigation={navigation} />

      {mode.type === "move" && (
        <View style={{
          backgroundColor: "#4052FF",
          paddingVertical: 8,
          paddingHorizontal: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Text style={{ color: "#fff", fontFamily: FONTS.SATOSHI, fontSize: 13 }}>
            Moving {shortDateLabel(mode.fromDate)} — tap a new date
          </Text>
          <Text
            style={{ color: "#fff", fontFamily: FONTS.SATOSHI, fontSize: 13, opacity: 0.8 }}
            onPress={() => setMode({ type: "normal" })}
          >
            Cancel
          </Text>
        </View>
      )}

      <ScrollView className={styles.content} contentContainerStyle={{ paddingTop: headerHeight }}>
        {monthLoading && (
          <ActivityIndicator size="small" color="#4052FF" style={{ marginBottom: 8 }} />
        )}
        <OutfitMonthGrid
          year={year}
          month={month}
          entriesByDate={entriesByDate}
          moveSourceDate={mode.type === "move" ? mode.fromDate : null}
          onDayPress={handleDayPress}
          onChangeMonth={handleChangeMonth}
        />
        <View className={styles.bottomPadding} />
      </ScrollView>

      <BottomNav navigation={navigation} activeTab="OutfitPlanner" />

      {/* Look picker — always at screen level, never nested inside another Modal */}
      <OutfitLookPickerModal
        visible={!!lookPickerDate && !lookPickerSaving}
        profile={profile}
        onClose={closeLookPicker}
        onSelect={handleLookSelected}
      />

      {lookPickerSaving && (
        <View style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(255,255,255,0.7)",
          justifyContent: "center", alignItems: "center",
        }}>
          <ActivityIndicator size="large" color="#4052FF" />
        </View>
      )}

      {detailPlan && detailDate && (
        <OutfitDetailModal
          visible
          plan={detailPlan}
          dateStr={detailDate}
          profile={profile}
          onClose={handleDetailClose}
          onMoveStart={handleMoveStart}
          onReplace={handleReplace}
        />
      )}
    </View>
  );
}

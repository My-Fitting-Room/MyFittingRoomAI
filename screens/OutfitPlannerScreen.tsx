import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import OutfitMonthGrid from "../components/OutfitMonthGrid";
import OutfitAddEntryModal from "../components/OutfitAddEntryModal";
import OutfitDetailModal from "../components/OutfitDetailModal";
import OutfitBulkAssignConfirm from "../components/OutfitBulkAssignConfirm";
import { FONTS } from "../constants/fonts";
import { getStyles } from "../stylesheets/outfitPlannerScreen";
import { fetchMonth, movePlan, OutfitPlan } from "../utils/outfitPlans";
import { addMonths, monthKey, shortDateLabel } from "../utils/date";

type Mode =
  | { type: "normal" }
  | { type: "move"; fromDate: string };

export default function OutfitPlannerScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // Cache: Map keyed by "YYYY-MM" → Record<dateStr, OutfitPlan>
  const [cache, setCache] = useState<Map<string, Record<string, OutfitPlan>>>(new Map());
  const [monthLoading, setMonthLoading] = useState(false);

  const [mode, setMode] = useState<Mode>({ type: "normal" });
  const [addEntryDate, setAddEntryDate] = useState<string | null>(null);
  const [detailPlan, setDetailPlan] = useState<OutfitPlan | null>(null);
  const [detailDate, setDetailDate] = useState<string | null>(null);
  const [bulkAssets, setBulkAssets] = useState<any[] | null>(null);
  const [bulkStartDate, setBulkStartDate] = useState<string | null>(null);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);

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

  // Fetch when month changes (skip if cached, but always refetch on focus)
  useEffect(() => {
    if (!profile) return;
    loadMonth(year, month, profile.id);
  }, [year, month, profile]);

  // Refetch on focus in case a try-on was deleted elsewhere (cascades entries)
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

  const handleDayPress = async (dateStr: string) => {
    if (mode.type === "move") {
      const from = mode.fromDate;
      setMode({ type: "normal" });
      if (from === dateStr) return;

      const targetPlan = entriesByDate[dateStr] ?? null;
      const label = shortDateLabel(dateStr);
      const fromLabel = shortDateLabel(from);
      const msg = targetPlan
        ? `Swap "${fromLabel}" outfit with "${label}"?`
        : `Move outfit to ${label}?`;

      Alert.alert("Move outfit", msg, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await movePlan(from, dateStr);
              // Invalidate both months (move may cross a boundary)
              setCache((prev) => {
                const next = new Map(prev);
                next.delete(monthKey(year, month));
                const fromDate = new Date(from);
                const fromMonthKey = monthKey(fromDate.getFullYear(), fromDate.getMonth() + 1);
                next.delete(fromMonthKey);
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
      setAddEntryDate(dateStr);
    }
  };

  const handleEntryCreated = async () => {
    setAddEntryDate(null);
    await loadMonth(year, month, profile.id);
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
    <SafeAreaView className={styles.container}>
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

      <ScrollView className={styles.content}>
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

      {addEntryDate && (
        <OutfitAddEntryModal
          visible
          dateStr={addEntryDate}
          profile={profile}
          existingPlan={null}
          onClose={() => setAddEntryDate(null)}
          onCreated={handleEntryCreated}
          onBulkAssign={(assets, startDate) => {
          setBulkAssets(assets);
          setBulkStartDate(startDate);
        }}
        />
      )}

      {bulkAssets && bulkStartDate && (
        <OutfitBulkAssignConfirm
          visible
          assets={bulkAssets}
          startDate={bulkStartDate}
          existingByDate={entriesByDate}
          profile={profile}
          onClose={() => { setBulkAssets(null); setBulkStartDate(null); }}
          onComplete={async () => {
            setBulkAssets(null);
            setBulkStartDate(null);
            await loadMonth(year, month, profile.id);
          }}
        />
      )}

      {detailPlan && detailDate && (
        <OutfitDetailModal
          visible
          plan={detailPlan}
          dateStr={detailDate}
          profile={profile}
          onClose={handleDetailClose}
          onMoveStart={handleMoveStart}
          onReplace={(dateStr) => {
            setDetailPlan(null);
            setDetailDate(null);
            setAddEntryDate(dateStr);
          }}
        />
      )}
    </SafeAreaView>
  );
}

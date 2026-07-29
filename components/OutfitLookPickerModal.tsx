import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import { supabase } from "../App";
import { styles } from "../stylesheets/outfitModals";
import { OutfitPlan } from "../utils/outfitPlans";

type Look = { id: string; url: string; source: "tryon" | "avatar_tryon" };

const fetchLooks = async (profileId: string): Promise<Look[]> => {
  const [tryons, avatarTryons] = await Promise.all([
    supabase
      .from("tryon_images")
      .select("id, url, status")
      .eq("profiles_id", profileId)
      .eq("status", "success")
      .order("created_at", { ascending: false }),
    supabase
      .from("avatar_tryon_images")
      .select("id, url, status")
      .eq("profiles_id", profileId)
      .eq("status", "success")
      .order("created_at", { ascending: false }),
  ]);
  const t = (tryons.data ?? []).map((r) => ({ id: r.id, url: r.url, source: "tryon" as const }));
  const a = (avatarTryons.data ?? []).map((r) => ({ id: r.id, url: r.url, source: "avatar_tryon" as const }));
  return { tryon: t, avatar_tryon: a } as any;
};

export default function OutfitLookPickerModal({
  visible,
  profile,
  onClose,
  onSelect,
}: {
  visible: boolean;
  profile: any;
  onClose: () => void;
  onSelect: (source: "tryon" | "avatar_tryon", sourceId: string) => void;
}) {
  const [tab, setTab] = useState<"tryon" | "avatar_tryon">("tryon");
  const [looks, setLooks] = useState<{ tryon: Look[]; avatar_tryon: Look[] }>({ tryon: [], avatar_tryon: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchLooks(profile.id)
      .then((data: any) => setLooks(data))
      .catch(() => Alert.alert("Error", "Failed to load your looks."))
      .finally(() => setLoading(false));
  }, [visible]);

  const data = looks[tab];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { maxHeight: "80%" }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Choose a look</Text>

          <View style={styles.segmentRow}>
            {(["tryon", "avatar_tryon"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.segment, tab === t && styles.segmentActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.segmentLabel, tab === t && styles.segmentLabelActive]}>
                  {t === "tryon" ? "Try-Ons" : "Avatar Looks"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4052FF" style={{ marginVertical: 30 }} />
          ) : data.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No looks yet</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.lookTile} onPress={() => onSelect(item.source, item.id)}>
                  <FastImage
                    source={{ uri: item.url, priority: FastImage.priority.normal }}
                    style={styles.lookTileImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

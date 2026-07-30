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

type Look = { id: number; url: string };

const fetchAvatarLooks = async (profileId: string): Promise<Look[]> => {
  const { data, error } = await supabase
    .from("avatar_tryon_images")
    .select("id, url")
    .eq("profiles_id", profileId)
    .eq("status", "success")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
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
  onSelect: (sourceId: number) => void;
}) {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchAvatarLooks(profile.id)
      .then(setLooks)
      .catch(() => Alert.alert("Error", "Failed to load your looks."))
      .finally(() => setLoading(false));
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Inner TouchableOpacity stops taps on the sheet from closing the modal */}
        <TouchableOpacity activeOpacity={1} style={[styles.sheet, { maxHeight: "80%" }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Choose an avatar look</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#4052FF" style={{ marginVertical: 30 }} />
          ) : looks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No avatar looks yet</Text>
            </View>
          ) : (
            <FlatList
              data={looks}
              numColumns={3}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.lookTile} onPress={() => onSelect(item.id)}>
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

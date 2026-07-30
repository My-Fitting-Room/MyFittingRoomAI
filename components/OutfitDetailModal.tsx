import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import Feathericons from "react-native-vector-icons/Feather";
import { styles } from "../stylesheets/outfitModals";
import { OutfitPlan, removePlan, thumbnailUrl } from "../utils/outfitPlans";
import { shortDateLabel } from "../utils/date";

export default function OutfitDetailModal({
  visible,
  plan,
  dateStr,
  profile,
  onClose,
  onMoveStart,
  onReplace,
}: {
  visible: boolean;
  plan: OutfitPlan;
  dateStr: string;
  profile: any;
  onClose: (needsRefresh: boolean) => void;
  onMoveStart: (dateStr: string) => void;
  onReplace: (dateStr: string, plan: OutfitPlan) => void;
}) {
  const [removing, setRemoving] = useState(false);
  const url = thumbnailUrl(plan);

  const handleRemove = () => {
    Alert.alert(
      "Remove outfit",
      `Remove the outfit planned for ${shortDateLabel(dateStr)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setRemoving(true);
            try {
              await removePlan(plan);
              onClose(true);
            } catch {
              Alert.alert("Error", "Failed to remove outfit. Please try again.");
            } finally {
              setRemoving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => onClose(false)}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => onClose(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>{shortDateLabel(dateStr)}</Text>

          {url ? (
            <FastImage
              source={{ uri: url, priority: FastImage.priority.high }}
              style={styles.detailImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View style={styles.detailImage} />
          )}

          {removing ? (
            <ActivityIndicator size="large" color="#CC0000" style={{ marginTop: 16 }} />
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => onReplace(dateStr, plan)}>
                <Feathericons name="refresh-cw" size={22} color="#000" />
                <Text style={styles.actionLabel}>Replace</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => onMoveStart(dateStr)}>
                <Feathericons name="move" size={22} color="#000" />
                <Text style={styles.actionLabel}>Move</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={handleRemove}>
                <Feathericons name="trash-2" size={22} color="#CC0000" />
                <Text style={[styles.actionLabel, styles.actionLabelDestructive]}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

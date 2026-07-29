import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import FastImage from "react-native-fast-image";
import { styles as sheetStyles } from "../stylesheets/outfitModals";
import { FONTS } from "../constants/fonts";
import { createFromUpload, OutfitPlan } from "../utils/outfitPlans";
import { addDays, shortDateLabel } from "../utils/date";

type RowState = "new" | "replace";

export default function OutfitBulkAssignConfirm({
  visible,
  assets,
  startDate,
  existingByDate,
  profile,
  onClose,
  onComplete,
}: {
  visible: boolean;
  assets: any[];
  startDate: string;
  existingByDate: Record<string, OutfitPlan>;
  profile: any;
  onClose: () => void;
  onComplete: () => void;
}) {
  // Assign each asset to a consecutive date starting from startDate
  const rows = useMemo(() =>
    assets.map((asset, i) => {
      const dateStr = addDays(startDate, i);
      const existing = existingByDate[dateStr] ?? null;
      return { asset, dateStr, existing, state: (existing ? "replace" : "new") as RowState };
    }),
  [assets, startDate, existingByDate]);

  const conflicts = rows.filter((r) => r.state === "replace").length;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [failed, setFailed] = useState<string[]>([]);

  const handleConfirm = async () => {
    setUploading(true);
    setProgress(0);
    setFailed([]);
    const failures: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const { asset, dateStr, existing } = rows[i];
      try {
        await createFromUpload(profile.id, dateStr, asset, existing);
      } catch {
        failures.push(shortDateLabel(dateStr));
      }
      setProgress(i + 1);
    }

    setUploading(false);

    if (failures.length > 0) {
      Alert.alert(
        "Partial success",
        `Added ${rows.length - failures.length} of ${rows.length} outfits.\n\nFailed: ${failures.join(", ")}`,
        [{ text: "OK", onPress: onComplete }],
      );
    } else {
      onComplete();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={sheetStyles.backdrop}>
        <View style={[sheetStyles.sheet, { maxHeight: "85%" }]}>
          <View style={sheetStyles.handle} />
          <Text style={sheetStyles.sheetTitle}>Assign {assets.length} outfits</Text>
          {conflicts > 0 && (
            <Text style={sheetStyles.sheetSubtitle}>
              {conflicts} date{conflicts > 1 ? "s" : ""} already {conflicts > 1 ? "have" : "has"} an outfit — {conflicts > 1 ? "they" : "it"} will be replaced.
            </Text>
          )}
          <Text style={[sheetStyles.sheetSubtitle, { marginTop: -8 }]}>
            Photos are assigned in the order you picked them.
          </Text>

          {uploading ? (
            <View style={localStyles.progressWrap}>
              <ActivityIndicator size="large" color="#4052FF" />
              <Text style={localStyles.progressText}>{progress} / {rows.length}</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={rows}
                keyExtractor={(_, i) => String(i)}
                style={{ flexGrow: 0, maxHeight: 340 }}
                renderItem={({ item }) => (
                  <View style={localStyles.row}>
                    {item.asset.uri && (
                      <FastImage
                        source={{ uri: item.asset.uri, priority: FastImage.priority.low }}
                        style={localStyles.thumb}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
                    <View style={localStyles.rowMeta}>
                      <Text style={localStyles.rowDate}>{shortDateLabel(item.dateStr)}</Text>
                      {item.state === "replace" && (
                        <Text style={localStyles.rowConflict}>Replaces existing</Text>
                      )}
                    </View>
                  </View>
                )}
              />

              <TouchableOpacity style={localStyles.confirmBtn} onPress={handleConfirm}>
                <Text style={localStyles.confirmLabel}>Assign all</Text>
              </TouchableOpacity>
              <TouchableOpacity style={localStyles.cancelBtn} onPress={onClose}>
                <Text style={localStyles.cancelLabel}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  progressWrap: {
    alignItems: "center",
    paddingVertical: 32,
  },
  progressText: {
    marginTop: 12,
    fontSize: 14,
    color: "#000",
    fontFamily: FONTS.SATOSHI,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8E8E8",
  },
  thumb: {
    width: 44,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#F4F4F4",
    marginRight: 12,
  },
  rowMeta: {
    flex: 1,
  },
  rowDate: {
    fontSize: 14,
    color: "#000",
    fontFamily: FONTS.SATOSHI,
  },
  rowConflict: {
    fontSize: 12,
    color: "#CC0000",
    fontFamily: FONTS.SATOSHI,
    marginTop: 2,
  },
  confirmBtn: {
    backgroundColor: "#4052FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  confirmLabel: {
    color: "#fff",
    fontSize: 15,
    fontFamily: FONTS.SWITZER,
    fontWeight: "600",
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelLabel: {
    fontSize: 14,
    color: "#868686",
    fontFamily: FONTS.SATOSHI,
  },
});

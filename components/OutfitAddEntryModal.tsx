import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import { launchImageLibrary } from "react-native-image-picker";
import { styles } from "../stylesheets/outfitModals";
import { OutfitPlan, createFromLook, createFromUpload } from "../utils/outfitPlans";
import OutfitLookPickerModal from "./OutfitLookPickerModal";
import { shortDateLabel } from "../utils/date";

export default function OutfitAddEntryModal({
  visible,
  dateStr,
  profile,
  existingPlan,
  onClose,
  onCreated,
  onBulkAssign,
}: {
  visible: boolean;
  dateStr: string;
  profile: any;
  existingPlan: OutfitPlan | null;
  onClose: () => void;
  onCreated: () => void;
  onBulkAssign: (assets: any[], startDate: string) => void;
}) {
  const [showLookPicker, setShowLookPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLookSelect = async (source: "tryon" | "avatar_tryon", sourceId: string) => {
    setShowLookPicker(false);
    setSaving(true);
    try {
      await createFromLook(profile.id, dateStr, source, sourceId, existingPlan);
      onCreated();
    } catch {
      Alert.alert("Error", "Failed to save outfit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPress = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.8,
      selectionLimit: 31,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) return;

    if (result.assets.length > 1) {
      // Hand off to bulk assign flow
      onClose();
      onBulkAssign(result.assets, dateStr);
      return;
    }

    setSaving(true);
    try {
      await createFromUpload(profile.id, dateStr, result.assets[0], existingPlan);
      onCreated();
    } catch {
      Alert.alert("Error", "Failed to upload photo. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal visible={visible && !showLookPicker} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{shortDateLabel(dateStr)}</Text>
            <Text style={styles.sheetSubtitle}>Choose an outfit for this day</Text>

            {saving ? (
              <ActivityIndicator size="large" color="#4052FF" style={{ marginVertical: 24 }} />
            ) : (
              <>
                <TouchableOpacity style={styles.optionButton} onPress={() => setShowLookPicker(true)}>
                  <Feathericons name="image" size={20} color="#000" style={styles.optionIcon} />
                  <Text style={styles.optionLabel}>Choose from my looks</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={handleUploadPress}>
                  <Feathericons name="upload" size={20} color="#000" style={styles.optionIcon} />
                  <Text style={styles.optionLabel}>Upload photo(s)</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <OutfitLookPickerModal
        visible={showLookPicker}
        profile={profile}
        onClose={() => setShowLookPicker(false)}
        onSelect={handleLookSelect}
      />
    </>
  );
}

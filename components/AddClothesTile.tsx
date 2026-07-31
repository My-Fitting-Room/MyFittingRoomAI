import { View, ActivityIndicator, Dimensions } from "react-native";
import React from "react";
import Feathericons from "react-native-vector-icons/Feather";
import { StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default function AddClothesTile({ onPress, uploading = false }) {
  return (
    <View style={styles.tileWrapper}>
      <View style={styles.card}>
        {uploading
          ? <ActivityIndicator size="small" color="#9CA3AF" />
          : <Feathericons name="plus" size={28} color="#9CA3AF" onPress={onPress} />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tileWrapper: {
    width: width * 0.31,
    height: width * 0.35,
    marginRight: 10,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
});

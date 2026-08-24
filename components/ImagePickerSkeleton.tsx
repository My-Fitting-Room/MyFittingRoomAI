import React from "react";
import { View } from "react-native";
import { Skeleton } from "./Skeleton";

// Loading placeholder for the Model / Clothing picker cards. Takes the host
// component's own stylesheet so the card frame (margins, radius, image height)
// lines up exactly with the real content it replaces.
export default function ImagePickerSkeleton({ styles }: { styles: any }) {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        {/* Section header: title + subtitle lines */}
        <Skeleton width={110} height={22} borderRadius={6} />
        <Skeleton width="80%" height={13} borderRadius={6} style={{ marginTop: 8 }} />

        {/* Hero image */}
        <View style={styles.selectedImageContainer}>
          <Skeleton width="100%" height="100%" borderRadius={20} />
        </View>

        {/* Two action buttons */}
        <View style={styles.actionButtonsContainer}>
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginHorizontal: 20 }} />
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginHorizontal: 20 }} />
        </View>
      </View>

      {/* "Your X" strip */}
      <Skeleton width={130} height={18} borderRadius={6} style={{ marginLeft: 15, marginBottom: 12 }} />
      <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
        {[0, 1, 2].map(i => (
          <Skeleton key={i} width={120} height={150} borderRadius={8} style={{ marginRight: 10 }} />
        ))}
      </View>
    </View>
  );
}

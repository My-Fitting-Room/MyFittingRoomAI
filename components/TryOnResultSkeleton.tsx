import React from "react";
import { View } from "react-native";
import { Skeleton } from "./Skeleton";
import { styles } from "../stylesheets/tryonImages";

// Loading placeholder for the try-on results card: a hero result block plus the
// view / favourite / delete action row. Shared by TryOnImages' own loading
// state and the full-screen TryOnScreen skeleton so they stay in sync.
export default function TryOnResultSkeleton() {
  return (
    <View style={[styles.container, { paddingBottom: 20 }]}>
      <Skeleton width="100%" height={400} borderRadius={16} />
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
        {[0, 1, 2].map(i => (
          <Skeleton key={i} width={28} height={28} borderRadius={14} style={{ marginHorizontal: 16 }} />
        ))}
      </View>
    </View>
  );
}

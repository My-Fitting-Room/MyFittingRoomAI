import React from "react";
import { View } from "react-native";
import ScreenSkeletonFrame from "./ScreenSkeletonFrame";
import { Skeleton } from "./Skeleton";

// Mirrors the "Find My Size" form: heading, a few labelled input fields, and
// the submit button.
export default function SizingScreenSkeleton(props: any) {
  return (
    <ScreenSkeletonFrame {...props} activeTab="Sizing">
      <View style={{ paddingHorizontal: 20 }}>
        <Skeleton width={160} height={26} borderRadius={6} style={{ marginTop: 8, marginBottom: 28 }} />

        {[0, 1, 2, 3].map(i => (
          <View key={i} style={{ marginBottom: 22 }}>
            <Skeleton width={80} height={13} borderRadius={6} style={{ marginBottom: 10 }} />
            <Skeleton width="100%" height={50} borderRadius={12} />
          </View>
        ))}

        <Skeleton width="100%" height={54} borderRadius={27} style={{ marginTop: 12 }} />
      </View>
    </ScreenSkeletonFrame>
  );
}

import React from "react";
import { View } from "react-native";
import ScreenSkeletonFrame from "./ScreenSkeletonFrame";
import { Skeleton } from "./Skeleton";

// Mirrors Settings: centered profile card (avatar + name + email) followed by a
// card of info rows (icon + two text lines each).
export default function SettingsScreenSkeleton(props: any) {
  return (
    <ScreenSkeletonFrame {...props} activeTab="Settings">
      <View style={{ paddingHorizontal: 20 }}>
        {/* Profile card */}
        <View style={{ alignItems: "center", marginTop: 10, marginBottom: 28 }}>
          <Skeleton width={72} height={72} borderRadius={36} />
          <Skeleton width={140} height={18} borderRadius={6} style={{ marginTop: 14 }} />
          <Skeleton width={180} height={13} borderRadius={6} style={{ marginTop: 8 }} />
        </View>

        {/* Info rows */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingVertical: 8,
          }}
        >
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16, paddingHorizontal: 16 }}
            >
              <Skeleton width={34} height={34} borderRadius={9} />
              <View style={{ marginLeft: 14 }}>
                <Skeleton width={90} height={14} borderRadius={6} />
                <Skeleton width={150} height={12} borderRadius={6} style={{ marginTop: 8 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenSkeletonFrame>
  );
}

import React from "react";
import { View, ScrollView } from "react-native";
import ScreenSkeletonFrame from "./ScreenSkeletonFrame";
import { Skeleton } from "./Skeleton";

// Mirrors the Avatar tab: the Avatar / Try-Ons tab row, a large avatar hero,
// a strip of avatar thumbnails, then the outfit carousel.
export default function AvatarScreenSkeleton(props: any) {
  return (
    <ScreenSkeletonFrame {...props} activeTab="Avatar">
      {/* Tab row */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 40, marginBottom: 20 }}>
        <Skeleton width={70} height={18} borderRadius={6} />
        <Skeleton width={70} height={18} borderRadius={6} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar hero */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Skeleton width="80%" height={360} borderRadius={20} />
        </View>

        {/* Avatar thumbnails */}
        <View style={{ flexDirection: "row", paddingHorizontal: 15, marginBottom: 28 }}>
          {[0, 1, 2, 3].map(i => (
            <Skeleton key={i} width={90} height={120} borderRadius={10} style={{ marginRight: 10 }} />
          ))}
        </View>

        {/* Outfit carousel */}
        <Skeleton width={130} height={18} borderRadius={6} style={{ marginLeft: 15, marginBottom: 12 }} />
        <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
          {[0, 1, 2].map(i => (
            <Skeleton key={i} width={110} height={140} borderRadius={10} style={{ marginRight: 10 }} />
          ))}
        </View>
      </ScrollView>
    </ScreenSkeletonFrame>
  );
}

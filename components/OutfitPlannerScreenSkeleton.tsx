import React from "react";
import { View } from "react-native";
import ScreenSkeletonFrame from "./ScreenSkeletonFrame";
import { Skeleton } from "./Skeleton";

// Mirrors the planner: centered month title, weekday header row, then a month
// grid of day cells.
export default function OutfitPlannerScreenSkeleton(props: any) {
  return (
    <ScreenSkeletonFrame {...props} activeTab="OutfitPlanner">
      <View style={{ paddingHorizontal: 12 }}>
        {/* Month title */}
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 20 }}>
          <Skeleton width={150} height={22} borderRadius={6} />
        </View>

        {/* Weekday header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} width={30} height={12} borderRadius={4} />
          ))}
        </View>

        {/* Day grid */}
        {[0, 1, 2, 3, 4].map(row => (
          <View
            key={row}
            style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map(col => (
              <Skeleton key={col} width={42} height={52} borderRadius={8} />
            ))}
          </View>
        ))}
      </View>
    </ScreenSkeletonFrame>
  );
}

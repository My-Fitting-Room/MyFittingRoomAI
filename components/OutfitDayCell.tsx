import React from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import ScaleButton from "./ScaleButton";
import { styles } from "../stylesheets/outfitDayCell";
import { thumbnailUrl, OutfitPlan } from "../utils/outfitPlans";

export default function OutfitDayCell({
  cell,
  plan,
  isToday,
  isMoveSource,
  onPress,
}: {
  cell: { dateStr: string; day: number; inMonth: boolean };
  plan: OutfitPlan | null;
  isToday: boolean;
  isMoveSource: boolean;
  onPress: (dateStr: string) => void;
}) {
  const url = plan ? thumbnailUrl(plan) : null;

  return (
    <ScaleButton style={styles.cell} onPress={() => onPress(cell.dateStr)}>
      <Text
        style={[
          styles.dayNumber,
          !cell.inMonth && styles.dayNumberOutside,
          isToday && styles.dayNumberToday,
        ]}
      >
        {cell.day}
      </Text>
      <View
        style={[
          styles.thumbWrap,
          !cell.inMonth && styles.thumbWrapOutside,
          isToday && styles.todayRing,
          isMoveSource && styles.moveSource,
        ]}
      >
        {url ? (
          <FastImage
            source={{ uri: url, priority: FastImage.priority.normal }}
            style={styles.thumb}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : null}
      </View>
    </ScaleButton>
  );
}

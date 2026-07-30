import React from "react";
import { Text } from "react-native";
import FastImage from "react-native-fast-image";
import ScaleButton from "./ScaleButton";
import { styles } from "../stylesheets/outfitDayCell";
import { thumbnailUrl, OutfitPlan } from "../utils/outfitPlans";

export default function OutfitDayCell({
  cell,
  plan,
  isToday,
  isMoveSource,
  isLastInRow,
  onPress,
}: {
  cell: { dateStr: string; day: number; inMonth: boolean };
  plan: OutfitPlan | null;
  isToday: boolean;
  isMoveSource: boolean;
  isLastInRow: boolean;
  onPress: (dateStr: string) => void;
}) {
  const url = plan ? thumbnailUrl(plan) : null;

  return (
    <ScaleButton
      style={[
        styles.cell,
        isLastInRow && styles.cellLast,
        isToday && styles.cellToday,
        isMoveSource && styles.cellMoveSource,
      ]}
      onPress={() => onPress(cell.dateStr)}
    >
      <Text
        style={[
          styles.dayNumber,
          !cell.inMonth && styles.dayNumberOutside,
          isToday && styles.dayNumberToday,
        ]}
      >
        {cell.day}
      </Text>
      {url ? (
        <FastImage
          source={{ uri: url, priority: FastImage.priority.normal }}
          style={styles.thumb}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : cell.inMonth ? (
        <Text style={styles.plusMark}>+</Text>
      ) : null}
    </ScaleButton>
  );
}

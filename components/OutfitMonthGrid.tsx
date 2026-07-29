import React from "react";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScaleButton from "./ScaleButton";
import OutfitDayCell from "./OutfitDayCell";
import { styles } from "../stylesheets/outfitMonthGrid";
import { buildMonthGrid, monthTitle, todayString, WEEKDAY_LABELS } from "../utils/date";
import { OutfitPlan } from "../utils/outfitPlans";

export default function OutfitMonthGrid({
  year,
  month,
  entriesByDate,
  moveSourceDate,
  onDayPress,
  onChangeMonth,
}: {
  year: number;
  month: number;
  entriesByDate: Record<string, OutfitPlan>;
  moveSourceDate: string | null;
  onDayPress: (dateStr: string) => void;
  onChangeMonth: (delta: number) => void;
}) {
  const grid = buildMonthGrid(year, month);
  const today = todayString();

  const weeks = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ScaleButton style={styles.chevronButton} onPress={() => onChangeMonth(-1)}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </ScaleButton>
        <Text style={styles.monthTitle}>{monthTitle(year, month)}</Text>
        <ScaleButton style={styles.chevronButton} onPress={() => onChangeMonth(1)}>
          <Ionicons name="chevron-forward" size={22} color="#000" />
        </ScaleButton>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, i) => (
          <Text key={i} style={styles.weekdayLabel}>{label}</Text>
        ))}
      </View>

      {weeks.map((week, i) => (
        <View key={i} style={styles.weekRow}>
          {week.map((cell) => (
            <OutfitDayCell
              key={cell.dateStr}
              cell={cell}
              plan={entriesByDate[cell.dateStr] ?? null}
              isToday={cell.dateStr === today}
              isMoveSource={cell.dateStr === moveSourceDate}
              onPress={onDayPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

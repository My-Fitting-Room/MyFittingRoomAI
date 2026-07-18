import { View, Text } from "react-native";
import React from "react";
import { styles } from "../stylesheets/sectionHeader";

// inset=false is for headings inside padded cards, which supply their own
// horizontal and top spacing
export default function SectionHeader({ title, subtitle = null, inset = true }) {
  return (
    <View style={inset ? styles.container : null}>
      <Text style={[styles.title, subtitle ? styles.titleWithSubtitle : null]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

import React from "react";
import { View, ScrollView } from "react-native";
import HeaderNav from "./HeaderNav";
import BottomNav from "./BottomNav";
import TryOnResultSkeleton from "./TryOnResultSkeleton";
import ImagePickerSkeleton from "./ImagePickerSkeleton";
import { styles as modelStyles } from "../stylesheets/modelImages";
import { styles as clothesStyles } from "../stylesheets/clothesImages";

// Full-screen loading state for TryOnScreen. Keeps the real header + bottom nav
// so the chrome doesn't flash, and fills the body with skeletons that mirror
// the results / Model / Clothing cards — so the top-level profile fetch resolves
// straight into content instead of a centered spinner.
export default function TryOnScreenSkeleton({
  navigation,
  containerClass,
  contentClass,
  headerHeight,
  paddingTop,
  paddingBottom,
}: any) {
  return (
    <View className={containerClass} style={{ paddingTop, paddingBottom }}>
      <HeaderNav navigation={navigation} />
      <ScrollView
        className={contentClass}
        contentContainerStyle={{ paddingHorizontal: 5, paddingTop: headerHeight }}
      >
        <TryOnResultSkeleton />
        <ImagePickerSkeleton styles={modelStyles} />
        <ImagePickerSkeleton styles={clothesStyles} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="TryOn" />
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import HeaderNav from "./HeaderNav";
import BottomNav from "./BottomNav";

// Shared shell for a screen's loading state: real header + bottom nav (neither
// needs profile data) with a skeleton body in between. Keeping the chrome real
// means the top-level fetch resolves straight into content with no spinner flash
// and no layout jump. Screens pass their own container styling (NativeWind
// className or a StyleSheet object) so the frame matches the loaded screen.
export default function ScreenSkeletonFrame({
  navigation,
  activeTab,
  containerClass,
  containerStyle,
  headerHeight,
  paddingTop,
  paddingBottom,
  children,
}: any) {
  return (
    <View
      className={containerClass}
      style={[{ flex: 1, backgroundColor: "#F3F4F6", paddingTop, paddingBottom }, containerStyle]}
    >
      <HeaderNav navigation={navigation} />
      <View style={{ flex: 1, paddingTop: headerHeight }}>{children}</View>
      <BottomNav navigation={navigation} activeTab={activeTab} />
    </View>
  );
}

import { getDeviceGroup } from "../utils/device";
import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

export const tabStyles = StyleSheet.create({
  tabsRow: {
    flexDirection: "row",
    marginTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#9A9A9A",
    fontFamily: FONTS.SATOSHI,
  },
  tabTextActive: {
    color: "#000",
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: "#000",
  },
});

export const getStyles = (width, height) => {
  const deviceGroup = getDeviceGroup(width, height);

  const deviceGroupStyles = {
    group1: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-12",
      contentContainer: "px-1",
      bottomPadding: "h-40"
    },
    group2: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-12",
      contentContainer: "px-1",
      bottomPadding: "h-40"
    },
    group3: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1",
      bottomPadding: "h-40"
    },
    group4: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group5: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group6: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group7: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group8: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group9: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group10: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    unknown: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    }
  };

  return deviceGroupStyles[deviceGroup];
};

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
  contentArea: {
    flex: 1,
  },
  // Floats over the content area below the tab bar so it doesn't move
  // with scrolling or empty/has-avatar layout changes
  newAvatarAnchor: {
    position: "absolute",
    top: 10,
    right: 16,
    zIndex: 10,
  },
  newAvatarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFF",
  },
  newAvatarButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
    fontFamily: FONTS.SATOSHI,
  },
  // Blurs the avatar content region only; sits under the New Avatar button
  // (zIndex 10) and outside the header/tabs/bottom-nav so those stay crisp.
  generatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  // Non-iOS26 fallback where real glass blur is unavailable
  generatingBlurFallback: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  generatingContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  generatingHeadline: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    fontFamily: FONTS.SWITZER,
  },
  generatingSubtext: {
    marginTop: 10,
    maxWidth: 260,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B6B6B",
    textAlign: "center",
    fontFamily: FONTS.SATOSHI,
  },
});

export const getStyles = (width, height) => {
  const deviceGroup = getDeviceGroup(width, height);

  const deviceGroupStyles = {
    group1: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-12",
      contentContainer: "px-1",
      bottomPadding: "h-40"
    },
    group2: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-12",
      contentContainer: "px-1",
      bottomPadding: "h-40"
    },
    group3: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1",
      bottomPadding: "h-40"
    },
    group4: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group5: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group6: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group7: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group8: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group9: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    group10: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    },
    unknown: {
      container: "flex-1 bg-gray-100",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-40"
    }
  };

  return deviceGroupStyles[deviceGroup];
};

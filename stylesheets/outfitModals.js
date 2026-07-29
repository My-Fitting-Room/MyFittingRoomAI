import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
    maxHeight: "90%",
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.SWITZER,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#868686",
    fontFamily: FONTS.SATOSHI,
    marginBottom: 16,
  },

  // Add-entry options
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8E8E8",
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: "#000",
    fontFamily: FONTS.SATOSHI,
  },

  // Look picker
  segmentRow: {
    flexDirection: "row",
    marginBottom: 14,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: "#F4F4F4",
  },
  segmentActive: {
    backgroundColor: "#4052FF",
  },
  segmentLabel: {
    fontSize: 13,
    fontFamily: FONTS.SATOSHI,
    color: "#868686",
  },
  segmentLabelActive: {
    color: "#fff",
  },
  lookTile: {
    flex: 1 / 3,
    aspectRatio: 0.75,
    margin: 2,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F4F4F4",
  },
  lookTileImage: {
    flex: 1,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9A9A9A",
    fontFamily: FONTS.SATOSHI,
  },

  // Detail modal
  detailImage: {
    width: "100%",
    aspectRatio: 0.75,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#F4F4F4",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  actionBtn: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  actionLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: FONTS.SATOSHI,
    color: "#000",
  },
  actionLabelDestructive: {
    color: "#CC0000",
  },
});

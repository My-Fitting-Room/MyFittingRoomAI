import { getDeviceGroup } from "../utils/device";

export const getStyles = (width, height) => {
  const deviceGroup = getDeviceGroup(width, height);

  const deviceGroupStyles = {
    group1: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-12",
      contentContainer: "px-1",
      bottomPadding: "h-32"
    },
    group2: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-12",
      contentContainer: "px-1",
      bottomPadding: "h-32"
    },
    group3: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1",
      bottomPadding: "h-32"
    },
    group4: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    group5: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    group6: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    group7: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    group8: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    group9: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    group10: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    unknown: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-2xl text-black",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    }
  };

  return deviceGroupStyles[deviceGroup];
};

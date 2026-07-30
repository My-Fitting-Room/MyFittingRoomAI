import { getDeviceGroup } from "../utils/device";

export const getStyles = (width, height) => {
  const deviceGroup = getDeviceGroup(width, height);

  const base = {
    container: "flex-1 bg-gray-100",
    loadingContainer: "flex-1 justify-center items-center bg-white",
    loadingText: "mt-2.5 text-sm text-black",
    content: "flex-1 pt-12",
    bottomPadding: "h-32",
  };

  const large = {
    container: "flex-1 bg-gray-100",
    loadingContainer: "flex-1 justify-center items-center bg-white",
    loadingText: "mt-2.5 text-2xl text-black",
    content: "flex-1 pt-14",
    bottomPadding: "h-20",
  };

  const deviceGroupStyles = {
    group1: base,
    group2: base,
    group3: base,
    group4: large,
    group5: large,
    group6: large,
    group7: large,
    group8: large,
    group9: large,
    group10: large,
    unknown: large,
  };

  return deviceGroupStyles[deviceGroup];
};

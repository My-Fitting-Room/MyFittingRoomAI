import { getDeviceGroup } from "../utils/device";

export const getStyles = (width, height) => {
  const deviceGroup = getDeviceGroup(width, height);

  console.log(deviceGroup);
  
  const deviceGroupStyles = {
    group1: {
        container: "flex-1 bg-white",
        header: "flex-row items-center px-4 py-2",
        backButton: "p-1",
        profileSection: "items-center mt-2 mb-10",
        profileImageContainer: "w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4",
        profileName: "text-lg mb-1",
        profileEmail: "text-sm text-gray-600",
        settingsContainer: "px-5 flex-1 justify-end mb-8",
        logoutButton: "bg-black rounded-lg py-3 items-center my-2",
        logoutButtonText: "text-white text-base font-semibold",
        iconSize: 24,
        userIconSize: 42
    },
    group2: {
        container: "flex-1 bg-white",
      header: "flex-row items-center px-4 py-2",
      backButton: "p-1",
      profileSection: "items-center mt-2 mb-10",
      profileImageContainer: "w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4",
      profileName: "text-lg mb-1",
      profileEmail: "text-sm text-gray-600",
      settingsContainer: "px-5 flex-1 justify-end mb-8",
      logoutButton: "bg-black rounded-lg py-3 items-center my-2",
      logoutButtonText: "text-white text-base font-semibold",
      iconSize: 24,
      userIconSize: 42
    },
    group3: {
        container: "flex-1 bg-white",
      header: "flex-row items-center px-4 py-2",
      backButton: "p-1",
      profileSection: "items-center mt-2 mb-10",
      profileImageContainer: "w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4",
      profileName: "text-lg mb-1",
      profileEmail: "text-sm text-gray-600",
      settingsContainer: "px-5 flex-1 justify-end mb-8",
      logoutButton: "bg-black rounded-lg py-3 items-center my-2",
      logoutButtonText: "text-white text-base font-semibold",
      iconSize: 24,
      userIconSize: 42
    },
    group4: {
        container: "flex-1 bg-white",
        header: "flex-row items-center px-4 py-3",
        backButton: "p-1.5",
        profileSection: "items-center mt-4 mb-12",
        profileImageContainer: "w-24 h-24 rounded-full bg-gray-100 justify-center items-center mb-5",
        profileName: "text-xl mb-1",
        profileEmail: "text-base text-gray-600",
        settingsContainer: "px-6 flex-1 justify-end mb-10",
        logoutButton: "bg-black rounded-lg py-4 items-center my-2",
        logoutButtonText: "text-white text-lg font-semibold",
        iconSize: 28,
        userIconSize: 50
    },
    group5: {
        container: "flex-1 bg-white",
      header: "flex-row items-center px-5 py-3",
      backButton: "p-2",
      profileSection: "items-center mt-6 mb-16",
      profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
      profileName: "text-2xl mb-1",
      profileEmail: "text-lg text-gray-600",
      settingsContainer: "px-8 flex-1 justify-end mb-12",
      logoutButton: "bg-black rounded-xl py-4 items-center my-2",
      logoutButtonText: "text-white text-xl font-semibold",
      iconSize: 32,
      userIconSize: 56
    },
    group6: {
        container: "flex-1 bg-white",
        header: "flex-row items-center px-5 py-3",
        backButton: "p-2",
        profileSection: "items-center mt-6 mb-16",
        profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
        profileName: "text-2xl mb-1",
        profileEmail: "text-lg text-gray-600",
        settingsContainer: "px-8 flex-1 justify-end mb-12",
        logoutButton: "bg-black rounded-xl py-4 items-center my-2",
        logoutButtonText: "text-white text-xl font-semibold",
        iconSize: 32,
        userIconSize: 56
    },
    group7: {
        container: "flex-1 bg-white",
      header: "flex-row items-center px-5 py-3",
      backButton: "p-2",
      profileSection: "items-center mt-6 mb-16",
      profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
      profileName: "text-2xl mb-1",
      profileEmail: "text-lg text-gray-600",
      settingsContainer: "px-8 flex-1 justify-end mb-12",
      logoutButton: "bg-black rounded-xl py-4 items-center my-2",
      logoutButtonText: "text-white text-xl font-semibold",
      iconSize: 32,
      userIconSize: 56
    },
    group8: {
        container: "flex-1 bg-white",
      header: "flex-row items-center px-5 py-3",
      backButton: "p-2",
      profileSection: "items-center mt-6 mb-16",
      profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
      profileName: "text-2xl mb-1",
      profileEmail: "text-lg text-gray-600",
      settingsContainer: "px-8 flex-1 justify-end mb-12",
      logoutButton: "bg-black rounded-xl py-4 items-center my-2",
      logoutButtonText: "text-white text-xl font-semibold",
      iconSize: 32,
      userIconSize: 56
    },
    group9: {
        container: "flex-1 bg-white",
      header: "flex-row items-center px-5 py-3",
      backButton: "p-2",
      profileSection: "items-center mt-6 mb-16",
      profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
      profileName: "text-2xl mb-1",
      profileEmail: "text-lg text-gray-600",
      settingsContainer: "px-8 flex-1 justify-end mb-12",
      logoutButton: "bg-black rounded-xl py-4 items-center my-2",
      logoutButtonText: "text-white text-xl font-semibold",
      iconSize: 32,
      userIconSize: 56
    },
    group10: {
        container: "flex-1 bg-white",
        header: "flex-row items-center px-5 py-3",
        backButton: "p-2",
        profileSection: "items-center mt-6 mb-16",
        profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
        profileName: "text-2xl mb-1",
        profileEmail: "text-lg text-gray-600",
        settingsContainer: "px-8 flex-1 justify-end mb-12",
        logoutButton: "bg-black rounded-xl py-4 items-center my-2",
        logoutButtonText: "text-white text-xl font-semibold",
        iconSize: 32,
        userIconSize: 56
    },
    unknown: {
        container: "flex-1 bg-white",
      header: "flex-row items-center px-5 py-3",
      backButton: "p-2",
      profileSection: "items-center mt-6 mb-16",
      profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
      profileName: "text-2xl mb-1",
      profileEmail: "text-lg text-gray-600",
      settingsContainer: "px-8 flex-1 justify-end mb-12",
      logoutButton: "bg-black rounded-xl py-4 items-center my-2",
      logoutButtonText: "text-white text-xl font-semibold",
      iconSize: 32,
      userIconSize: 56
    }
  };

  return deviceGroupStyles[deviceGroup];
};
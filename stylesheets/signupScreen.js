// import { getDeviceGroup } from "../utils/device";

// export const getStyles = (width,height) => {
//   const deviceGroup = getDeviceGroup(width,height);

//   console.log(deviceGroup)
//   const deviceGroupStyles = {
//     group1: {
//         mainWrapper: "flex-[2] px-10 mt-40 items-center justify-center pb-0.5",
//         contentWrapper: "w-full",
//         headerText: "text-3xl text-center mb-4 font-bold text-black",
//         subHeader: "px-10 text-sm mb-6",
//         videoHeight: 200,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 pt-10 justify-start",
//         authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
//         authButtonText: "text-base font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: ""
//     },
//     group2: {
//         mainWrapper: "flex-[2] px-10 mt-40 items-center justify-center pb-0.5",
//         contentWrapper: "w-full",
//         headerText: "text-3xl text-center mb-4 font-bold text-black",
//         subHeader: "px-10 text-sm mb-6",
//         videoHeight: 200,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 pt-10 justify-start",
//         authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
//         authButtonText: "text-base font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: ""
//     },
//     group3: {
//         mainWrapper: "flex-[2] px-10 mt-40 items-center justify-center pb-0.5",
//         contentWrapper: "w-full",
//         headerText: "text-3xl text-center mb-4 font-bold text-black",
//         subHeader: "px-10 text-sm mb-6",
//         videoHeight: 200,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 pt-10 justify-start",
//         authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
//         authButtonText: "text-base font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: ""
//     },
//     group4: {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center ",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-2 text-lg mb-6",
//         videoHeight: 240,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-8 mb-4",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     },
//     group5: {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-6 text-lg mb-6",
//         videoHeight: 260,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     },
//     group6: {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-6 text-lg mb-6",
//         videoHeight: 260,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     },
//     group7: {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-6 text-lg mb-6",
//         videoHeight: 260,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     },
//     group8: {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-6 text-lg mb-6",
//         videoHeight: 260,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     },
//     group9 : {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-6 text-lg mb-6",
//         videoHeight: 260,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     },
//     group10 : {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-6 text-lg mb-6",
//         videoHeight: 260,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     },
//     unknown : {
//         mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
//         contentWrapper: "w-full",
//         headerText: "text-4xl text-center mb-6 font-bold text-black",
//         subHeader: "px-6 text-lg mb-6",
//         videoHeight: 260,
//         videoWidth: width * 0.95,
//         bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
//         authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
//         authButtonText: "text-lg font-medium",
//         icon: "w-5 h-5 mr-3",
//         videoView: "mt-4"
//     }
//   }



//   return deviceGroupStyles[deviceGroup];
// } 



import { getDeviceGroup } from "../utils/device";

export const getStyles = (width, height) => {
  const deviceGroup = getDeviceGroup(width, height);

  console.log(deviceGroup);
  
  const deviceGroupStyles = {
    group1: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-10 mt-40 items-center justify-center pb-0.5",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 pt-10 justify-start",
      
      // Text styles
      headerText: "text-3xl text-center mb-4 font-bold text-black",
      subHeader: "px-10 text-sm mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-base font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "",
      videoViewContainer: "items-center justify-center",
      videoHeight: 200,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group2: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-10 mt-40 items-center justify-center pb-0.5",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 pt-10 justify-start",
      
      // Text styles
      headerText: "text-3xl text-center px-10 mb-4 font-bold text-black",
      subHeader: "px-10 text-sm mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-base font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "",
      videoViewContainer: "items-center justify-center",
      videoHeight: 200,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group3: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-10 mt-40 items-center justify-center pb-0.5",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 pt-10 justify-start",
      
      // Text styles
      headerText: "text-3xl text-center mb-4 px-10 font-bold text-black",
      subHeader: "px-10 text-sm mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-base font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "",
      videoViewContainer: "items-center justify-center",
      videoHeight: 200,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group4: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-8 mb-4",
      
      // Text styles
      headerText: "text-4xl text-center mb-6 px-6 font-bold text-black",
      subHeader: "px-2 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 240,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group5: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      
      // Text styles
      headerText: "text-4xl text-center px-6 mb-6 font-bold text-black",
      subHeader: "px-2 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 260,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group6: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      
      // Text styles
      headerText: "text-4xl text-center px-6 mb-6 font-bold text-black",
      subHeader: "px-6 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 260,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group7: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      
      // Text styles
      headerText: "text-4xl text-center px-6 mb-6 font-bold text-black",
      subHeader: "px-2 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 260,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group8: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      
      // Text styles
      headerText: "text-4xl text-center mb-6 px-10 font-bold text-black",
      subHeader: "px-6 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 260,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group9: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      
      // Text styles
      headerText: "text-4xl text-center px-10 mb-6 font-bold text-black",
      subHeader: "px-6 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 260,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    group10: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      
      // Text styles
      headerText: "text-4xl text-center mb-6 px-12 font-bold text-black",
      subHeader: "px-6 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 260,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    },
    unknown: {
      // Screen and layout
      screen: "flex-1 bg-white",
      subscribeBanner: "absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]",
      subscribeBannerText: "text-white text-sm sm:text-base",
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      
      // Text styles
      headerText: "text-4xl text-center mb-6 font-bold text-black",
      subHeader: "px-6 text-lg mb-6",
      subHeaderText: "text-gray-800 text-center",
      
      // Button styles
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      authButtonActive: "bg-black active:bg-neutral-800 active:scale-[0.98]",
      authButtonTextColor: "text-white",
      
      // Video styles
      videoView: "mt-4",
      videoViewContainer: "items-center justify-center",
      videoHeight: 260,
      videoWidth: width * 0.95,
      
      // Icon styles
      icon: "w-5 h-5 mr-3",
      iconMaterial: "mr-3"
    }
  };

  return deviceGroupStyles[deviceGroup];
};
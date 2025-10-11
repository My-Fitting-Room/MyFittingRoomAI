import { getDeviceGroup } from "../utils/device";

export const getStyles = (width,height) => {
  const deviceGroup = getDeviceGroup(width,height);

  const deviceGroupStyles = {
    
    group2: {
      // Common styles
      container: "pt-16 px-8 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-2xl text-center mb-3  font-semibold text-black",
      step0SubHeader: "text-base text-center  mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[300px] h-[250px] ",
      step0ImageView: "items-center mt-10",
      step0ButtonsGroup: "flex-2 px-8 pb-24",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-2xl text-center mb-3  font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-12",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-2xl text-center mb-3  font-semibold text-black px-8",
      step2SubHeader: "text-base text-center  mt-2 text-gray-600 px-20 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-16",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-2xl text-center mb-3  font-semibold text-black",
      step3SubHeader: "text-base text-center mb-6  mt-2 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-20",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-2xl text-center mb-3 px-6  font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-24",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },
   
    group3: {
      // Common styles
      container: "pt-32 px-12 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-2xl text-center mb-3  font-semibold text-black",
      step0SubHeader: "text-base text-center  mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px] ",
      step0ImageView: "items-center mt-10",
      step0ButtonsGroup: "flex-2 px-8 pb-36",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-2xl text-center mb-3  font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-28",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-2xl text-center mb-3  font-semibold text-black px-8",
      step2SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 px-20 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-28",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-2xl text-center mb-3  font-semibold text-black",
      step3SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-28",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-2xl text-center mb-3 px-6  font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-40",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },
    
    group4: {
      // Common styles
      container: "pt-24 px-12 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-[28px] text-center mb-3 mt-12 font-semibold text-black",
      step0SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px]",
      step0ImageView: "items-center mt-4",
      step0ButtonsGroup: "flex-2 px-8 pb-40",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-[28px] text-center mb-3 mt-12 font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-32",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-[28px] text-center mb-3 mt-12 font-semibold text-black",
      step2SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-32",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-[28px] text-center mb-3 mt-12 font-semibold text-black",
      step3SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-32",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-[28px] text-center mb-3 mt-8 font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-40",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },
    
    
    group5: {
      // Common styles
      container: "pt-28 px-10 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-[30px] text-center mb-3 mt-12 font-semibold text-black",
      step0SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px]",
      step0ImageView: "items-center mt-4",
      step0ButtonsGroup: "flex-2 px-8 pb-40",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-[30px] text-center mb-3 mt-12 font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-32",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-[30px] text-center mb-3 mt-12 font-semibold text-black",
      step2SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-32",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-[30px] text-center mb-3 mt-12 font-semibold text-black",
      step3SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-32",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-[30px] text-center mb-3 mt-8 font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-40",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },
    
    group6: {
      // Common styles
      container: "pt-32 px-10 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step0SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px]",
      step0ImageView: "items-center mt-12",
      step0ButtonsGroup: "flex-2 px-8 pb-40",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-36",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step2SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-36",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step3SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-36",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-[30px] text-center mb-3 mt-8 font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-44",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },
    
    group7: {
      // Common styles
      container: "pt-28 px-10 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step0SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px]",
      step0ImageView: "items-center mt-12",
      step0ButtonsGroup: "flex-2 px-8 pb-40",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-36",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step2SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-36",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step3SubHeader: "text-base text-center mb-6 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-36",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-[30px] text-center mb-3 mt-8 font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-44",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },
   
    group8: {
      // Common styles
      container: "pt-24 px-10 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step0SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px]",
      step0ImageView: "items-center mt-12",
      step0ButtonsGroup: "flex-2 px-8 pb-48",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-44",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step2SubHeader: "text-base text-center mb-12 mt-5 text-gray-600 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-44",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step3SubHeader: "text-base text-center mb-12 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-44",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-[30px] text-center mb-3 mt-8 font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-48",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },

    group9: {
      // Common styles
      container: "pt-24 px-10 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step0SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px]",
      step0ImageView: "items-center mt-12",
      step0ButtonsGroup: "flex-2 px-8 pb-48",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-44",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step2SubHeader: "text-base text-center mb-12 mt-5 text-gray-600 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-44",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-[32px] text-center mb-3 mt-12 font-semibold text-black",
      step3SubHeader: "text-base text-center mb-12 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-44",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-[32px] text-center mb-3 mt-8 font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-48",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },



    group10: {
      // Common styles
      container: "pt-24 px-10 flex-1 items-center",
      stepContainer: "mt-16",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-10 bg-black active:bg-neutral-800 active:scale-[0.98]",
      continueButtonText: "text-white text-base font-medium",
      
      // Step 0 styles
      step0MainHeader: "text-[34px] text-center mb-3 mt-12 font-semibold text-black",
      step0SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step0Image: "w-[350px] h-[300px]",
      step0ImageView: "items-center mt-12",
      step0ButtonsGroup: "flex-2 px-8 pb-48",
      
      // Step 1 styles (Review)
      step1MainHeader: "text-[34px] text-center mb-3 mt-12 font-semibold text-black",
      step1SubHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      step1ButtonsGroup: "flex-2 px-8 pb-44",
      reviewImage: "w-80 h-64 border rounded-xl mt-4 border-[#D9D9D9] p-3 object-contain self-center",
      
      // Step 2 styles (Upload Model)
      step2MainHeader: "text-[34px] text-center mb-3 mt-12 font-semibold text-black",
      step2SubHeader: "text-base text-center mb-12 mt-5 text-gray-600 leading-[22px]",
      step2ButtonsGroup: "flex-2 px-8 pb-44",
      
      // Step 3 styles (Upload Clothes)
      step3MainHeader: "text-[34px] text-center mb-3 mt-12 font-semibold text-black",
      step3SubHeader: "text-base text-center mb-12 mt-5 text-gray-600 leading-[22px]",
      step3ButtonsGroup: "flex-2 px-8 pb-44",
      
      // Step 4 styles (Try-On)
      step4MainHeader: "text-[34px] text-center mb-3 mt-8 font-semibold text-black",
      step4ButtonsGroup: "flex-2 px-8 pb-48",
      checkmarkContainer: "items-center justify-center mb-8 mt-20",
      
      // Shared upload styles (used in steps 2 and 3)
      uploadPlaceholder: "w-44 h-56 bg-gray-100 rounded-xl items-center justify-center",
      uploadedImage: "w-44 h-56 rounded-xl",
    },
      
    
  }

  return deviceGroupStyles[deviceGroup];
};
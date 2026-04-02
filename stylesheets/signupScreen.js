export const getStyles = (width, height) => {
  return {
    screen: "flex-1 bg-white",
    scrollContent: "flex-grow justify-center items-center py-12 px-2",
    headerText: "text-4xl text-center mb-12 font-bold text-black",
    buttonsWrapper: "w-full px-4 mb-6",
    authButton: "py-4 flex-row items-center justify-center rounded-[12px] mb-4 w-full",
    authButtonActive: "bg-black active:bg-neutral-800",
    authButtonText: "text-lg font-medium",
    authButtonTextColor: "text-white",
    icon: "w-5 h-5 mr-3",
    iconMaterial: "mr-3",
    guestButton: "items-center mb-10",
    guestText: "text-base text-gray-800",
    guestTextBold: "font-bold text-black underline",
    videoViewContainer: "items-center justify-center w-full mb-10",
    videoView: "",
    videoHeight: 300,
    videoWidth: width * 0.9,
    termsContainer: "flex-row flex-wrap justify-center items-center mt-auto px-4",
    termsText: "text-sm text-gray-500 text-center",
    termsLink: "text-sm text-[#4051FF] text-center",
  };
};
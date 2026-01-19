import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

export const triggerHaptic = (type = "impactHard") => {
    ReactNativeHapticFeedback.trigger(type as any, options);
};

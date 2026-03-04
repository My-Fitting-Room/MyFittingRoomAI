import { Mixpanel } from "mixpanel-react-native";
import Config from "react-native-config";
import AsyncStorage from '@react-native-async-storage/async-storage';
const trackAutomaticEvents = true;
const mixpanel = new Mixpanel(Config.MIXPANEL_PROJECT_TOKEN, trackAutomaticEvents);

export const initMixpanel = async () => {
  try {
    await mixpanel.init();

    // Track unique first app open
    const hasSentFirstOpen = await AsyncStorage.getItem('mixpanel_first_open_sent');
    if (!hasSentFirstOpen) {
      mixpanel.getPeople().setOnce("First App Open", new Date().toISOString());
      mixpanel.track("First App Open");
      await AsyncStorage.setItem('mixpanel_first_open_sent', 'true');
    }

    // Track app session (fires every time)
    mixpanel.track("App Session", {
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Mixpanel initialization error:", error);
  }
};

export default mixpanel;

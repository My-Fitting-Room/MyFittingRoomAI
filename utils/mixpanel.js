import { Mixpanel } from "mixpanel-react-native";
import Config from "react-native-config";

const trackAutomaticEvents = true;
const mixpanel = new Mixpanel(Config.MIXPANEL_PROJECT_TOKEN, trackAutomaticEvents);

export const initMixpanel = async () => {
  try {
    await mixpanel.init();
    mixpanel.track("App Opened");
  } catch (error) {
  }
};

export default mixpanel;

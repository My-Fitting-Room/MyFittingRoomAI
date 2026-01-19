import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage"
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import TryOnScreen from "./screens/TryOnScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SizingScreen from "./screens/SizingScreen";
import { OneSignal } from "react-native-onesignal";
import Config from "react-native-config";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import FirstScreen from "./screens/FirstScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import "./global.css"
import { initMixpanel } from "./utils/mixpanel";
import { initTikTokSDK } from "./utils/tiktok";
import { getTrackingStatus, requestTrackingPermission } from "react-native-tracking-transparency";
import { initSingularSDK, singularLogin, singularLogout } from "./utils/singular";
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen1 from "./screens/OnboardingScreen1";
import OnboardingScreen2 from "./screens/OnboardingScreen2";
import OnboardingScreen3 from "./screens/OnboardingScreen3";
import OnboardingScreen4 from "./screens/OnboardingScreen4";
import OnboardingScreen5 from "./screens/OnboardingScreen5";
import OnboardingScreen6 from "./screens/OnboardingScreen6";
import OnboardingScreen7 from "./screens/OnboardingScreen7";
import OnboardingScreen8 from "./screens/OnboardingScreen8";
import OnboardingScreen9 from "./screens/OnboardingScreen9";
import OnboardingScreen10 from "./screens/OnboardingScreen10";
import OnboardingScreen11 from "./screens/OnboardingScreen11";
import OnboardingScreen12 from "./screens/OnboardingScreen12";
import OnboardingScreen13 from "./screens/OnboardingScreen13";
import OnboardingScreen14 from "./screens/OnboardingScreen14";
import OnboardingScreen15 from "./screens/OnboardingScreen15";
import OnboardingScreen16 from "./screens/OnboardingScreen16";
import OnboardingScreen17 from "./screens/OnboardingScreen17";
import OnboardingScreen18 from "./screens/OnboardingScreen18";
import OnboardingScreen19 from "./screens/OnboardingScreen19";
import OnboardingScreen20 from "./screens/OnboardingScreen20";
import OnboardingScreen21 from "./screens/OnboardingScreen21";
import OnboardingScreen22 from "./screens/OnboardingScreen22";
import OnboardingScreen23 from "./screens/OnboardingScreen23";
import OnboardingScreen23b from "./screens/OnboardingScreen23b";
import OnboardingScreen24 from "./screens/OnboardingScreen24";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const supabaseUrl = Config.SUPABASE_URL;
const supabaseKey = Config.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

import { OnboardingProvider } from "./context/OnboardingContext";

const Stack = createNativeStackNavigator();

const App = () => {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    const bootstrap = async () => {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      if (Platform.OS === "ios") {
        Purchases.configure({ apiKey: Config.REVENUECAT_APPLE_KEY });

        try {
          const status = await getTrackingStatus();
          if (status === "not-determined") {
            await requestTrackingPermission();
          }
        } catch { }
      }

      OneSignal.initialize(Config.ONE_SIGNAL_APP_ID);
      OneSignal.Notifications.requestPermission(true);

      initMixpanel();
      await initTikTokSDK();
      await initSingularSDK();
    };

    bootstrap();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          OneSignal.login(session.user.id);
          await Purchases.logIn(session.user.id);
          setSession(session);
          singularLogin(session.user.id);
        } else {
          Purchases.logOut();
          OneSignal.logout();
          singularLogout();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: false,
              headerShown: false,
            }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen
              name="First"
              options={{ headerShown: false }}
              component={FirstScreen}
            />
            <Stack.Screen
              name="SignIn"
              options={{ headerShown: false }}
              component={SignInScreen}
            />
            <Stack.Screen
              name="SignUp"
              options={{ headerShown: false }}
              component={SignUpScreen}
            />
            <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
            <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
            <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />
            <Stack.Screen name="OnboardingScreen4" component={OnboardingScreen4} />
            <Stack.Screen name="OnboardingScreen5" component={OnboardingScreen5} />
            <Stack.Screen name="OnboardingScreen6" component={OnboardingScreen6} />
            <Stack.Screen name="OnboardingScreen7" component={OnboardingScreen7} />
            <Stack.Screen name="OnboardingScreen8" component={OnboardingScreen8} />
            <Stack.Screen name="OnboardingScreen9" component={OnboardingScreen9} />
            <Stack.Screen name="OnboardingScreen10" component={OnboardingScreen10} />
            <Stack.Screen name="OnboardingScreen11" component={OnboardingScreen11} />
            <Stack.Screen name="OnboardingScreen12" component={OnboardingScreen12} />
            <Stack.Screen name="OnboardingScreen13" component={OnboardingScreen13} />
            <Stack.Screen name="OnboardingScreen14" component={OnboardingScreen14} />
            <Stack.Screen name="OnboardingScreen15" component={OnboardingScreen15} />
            <Stack.Screen name="OnboardingScreen16" component={OnboardingScreen16} />
            <Stack.Screen name="OnboardingScreen17" component={OnboardingScreen17} />
            <Stack.Screen name="OnboardingScreen18" component={OnboardingScreen18} />
            <Stack.Screen name="OnboardingScreen19" component={OnboardingScreen19} />
            <Stack.Screen name="OnboardingScreen20" component={OnboardingScreen20} />
            <Stack.Screen name="OnboardingScreen21" component={OnboardingScreen21} />
            <Stack.Screen name="OnboardingScreen22" component={OnboardingScreen22} />
            <Stack.Screen name="OnboardingScreen23" component={OnboardingScreen23} />
            <Stack.Screen name="OnboardingScreen23b" component={OnboardingScreen23b} />
            <Stack.Screen name="OnboardingScreen24" component={OnboardingScreen24} />
            <Stack.Screen
              name="TryOn"
              options={{ headerShown: false }}
              component={TryOnScreen}
            />
            <Stack.Screen
              name="Settings"
              options={{ headerShown: false }}
              component={SettingsScreen}
            />
            <Stack.Screen
              name="Sizing"
              options={{ headerShown: false }}
              component={SizingScreen}
            />
            <Stack.Screen
              name="Onboarding"
              options={{ headerShown: false }}
              component={OnboardingScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}

export default App;




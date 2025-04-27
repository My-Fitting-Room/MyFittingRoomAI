import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createClient} from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage"
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import TryOnScreen from "./screens/TryOnScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SizingScreen from "./screens/SizingScreen";
import { LogLevel, OneSignal } from "react-native-onesignal";
import Config from "react-native-config";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";

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

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {

    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'ios') {
       Purchases.configure({apiKey: Config.REVENUECAT_APPLE_KEY});
    } 


    //OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(Config.ONE_SIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if(session) {
          OneSignal.login(session.user.id);
          const { customerInfo, created } = await Purchases.logIn(session.user.id);

          setSession(session);
        } else {
          Purchases.logOut();
          OneSignal.logout();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="TryOn" 
          options={{ headerShown: false }} 
          component={TryOnScreen} 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
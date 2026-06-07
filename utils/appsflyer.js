import appsFlyer from 'react-native-appsflyer';
import Config from "react-native-config";
import Purchases from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mixpanel from './mixpanel';

const getSubInfoWithRetry = async (subscriptionId, retries = 3, delayMs = 1500) => {
    for (let i = 0; i < retries; i++) {
        const customerInfo = await Purchases.getCustomerInfo();
        const subInfo = customerInfo.subscriptionsByProductIdentifier[subscriptionId];

        if (subInfo?.periodType) return subInfo;

        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    return null;
};

export const trackAppsFlyerPurchase = async () => {
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        const activeSubscriptions = customerInfo.activeSubscriptions;
        const entitlements = customerInfo.entitlements.active;

        if (activeSubscriptions.length > 0 && Object.keys(entitlements).length > 0) {
            const subscriptionId = activeSubscriptions[0];

            // Wait for RevenueCat to settle before reading periodType
            const subInfo = await getSubInfoWithRetry(subscriptionId);

            const isTrial = subInfo?.periodType?.toLowerCase() === 'trial';
            const price = subInfo?.price?.amount ?? 0;
            const currency = subInfo?.price?.currency ?? 'USD';

            if (isTrial) {
                // Dedup guard for trials — keyed separately so trial→paid conversion
                // still fires af_subscribe when the same product ID converts later.
                const trackedTrialId = await AsyncStorage.getItem('af_tracked_trial_id');
                if (trackedTrialId === subscriptionId) return;

                appsFlyer.logEvent('af_start_trial', {
                    af_currency: currency,
                    af_content_id: subscriptionId,
                    af_revenue: 0,
                });
                mixpanel.track('Trial Started', {
                    subscription_id: subscriptionId,
                    currency,
                });
                await AsyncStorage.setItem('af_tracked_trial_id', subscriptionId);
            } else {
                // Dedup guard for paid subscriptions — separate from trial key.
                const trackedPaidId = await AsyncStorage.getItem('af_tracked_paid_id');
                if (trackedPaidId === subscriptionId) return;

                appsFlyer.logEvent('af_subscribe', {
                    af_revenue: parseFloat(price),
                    af_currency: currency,
                    af_content_id: subscriptionId,
                    af_order_id: subscriptionId,
                });
                await AsyncStorage.setItem('af_tracked_paid_id', subscriptionId);
            }
        }
    } catch (error) {
        return;
    }
};

export const logAppsFlyerEvent = async (eventName, eventData = {}) => {
    try {
        appsFlyer.logEvent(eventName, eventData);
    } catch (error) {
        return;
    }
};

export const initAppsFlyerSDK = async () => {
    try {
        const options = {
            devKey: Config.APPSFLYER_DEV_KEY,
            appId: Config.APPSFLYER_APP_ID,
            isDebug: false,
            onInstallConversionDataListener: true,
            onDeepLinkListener: true,
            timeToWaitForATTUserAuthorization: 10,
        };

        appsFlyer.initSdk(
            options,
            (result) => {
                console.log('AppsFlyer init success:', result);
            },
            (error) => {
                console.log('AppsFlyer init error:', error);
            }
        );
    } catch (error) {
        return;
    }
};

export const appsFlyerLogin = (customerId) => {
    appsFlyer.setCustomerUserId(customerId);
};

export const appsFlyerLogout = async () => {
    appsFlyer.setCustomerUserId('');
    // Clear dedup flags so a re-subscribing user is tracked correctly
    await AsyncStorage.multiRemove(['af_tracked_trial_id', 'af_tracked_paid_id']);
};
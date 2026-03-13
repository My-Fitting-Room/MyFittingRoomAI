// import appsFlyer from 'react-native-appsflyer';
// import Config from "react-native-config";
// import Purchases from 'react-native-purchases';

// export const trackAppsFlyerPurchase = async () => {
//     try {
//         const customerInfo = await Purchases.getCustomerInfo();
//         const activeSubscriptions = customerInfo.activeSubscriptions;
//         const entitlements = customerInfo.entitlements.active;
//         const subscriptionsInfo = customerInfo.subscriptionsByProductIdentifier;

//         if (activeSubscriptions.length > 0 && Object.keys(entitlements).length > 0) {
//             const subscriptionId = activeSubscriptions[0];
//             let price = 0;
//             let currency = 'USD';

//             if (Object.keys(subscriptionsInfo).length > 0) {
//                 price = subscriptionsInfo[subscriptionId].price.amount;
//                 currency = subscriptionsInfo[subscriptionId].price.currency;
//             }

//             appsFlyer.logEvent('af_subscribe', {
//                 af_revenue: parseFloat(price),
//                 af_currency: currency,
//                 af_content_id: subscriptionId,
//                 af_order_id: subscriptionId
//             });

//             return;
//         }
//     } catch (error) {
//         return;
//     }
// };

// export const logAppsFlyerEvent = async (eventName, eventData = {}) => {
//     try {
//         console.log('hello apps event', eventName, eventData);
//         appsFlyer.logEvent(eventName, eventData);
//         return;
//     } catch (error) {
//         console.log('hello apps event error', error);
//         return;
//     }
// };

// export const initAppsFlyerSDK = async () => {
//     try {
//         const options = {
//             devKey: Config.APPSFLYER_DEV_KEY,
//             appId: Config.APPSFLYER_APP_ID,
//             isDebug: false,
//             onInstallConversionDataListener: true,
//             onDeepLinkListener: true,
//             timeToWaitForATTUserAuthorization: 10
//         };

//         appsFlyer.initSdk(
//             options,
//             (result) => {
//                 console.log('hello apps ', result);
//             },
//             (error) => {
//                 console.log('hello apps error', error);
//             }
//         );
//         return;
//     } catch (error) {
//         return;
//     }
// };

// export const appsFlyerLogin = (customerId) => {
//     appsFlyer.setCustomerUserId(customerId);
// };

// export const appsFlyerLogout = () => {
//     appsFlyer.setCustomerUserId('');
// };
import appsFlyer from 'react-native-appsflyer';
import Config from "react-native-config";
import Purchases from 'react-native-purchases';

export const trackAppsFlyerPurchase = async () => {
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        const activeSubscriptions = customerInfo.activeSubscriptions;
        const entitlements = customerInfo.entitlements.active;
        const subscriptionsInfo = customerInfo.subscriptionsByProductIdentifier;

        if (activeSubscriptions.length > 0 && Object.keys(entitlements).length > 0) {
            const subscriptionId = activeSubscriptions[0];
            const subInfo = subscriptionsInfo[subscriptionId];

            const isTrial = subInfo?.periodType === 'trial';
            const price = subInfo?.price?.amount ?? 0;
            const currency = subInfo?.price?.currency ?? 'USD';

            if (isTrial) {
                // Log trial activation separately — not a paid conversion
                appsFlyer.logEvent('af_start_trial', {
                    af_currency: currency,
                    af_content_id: subscriptionId,
                });
                return;
            }

            // Only reaches here for real paid subscriptions
            appsFlyer.logEvent('af_subscribe', {
                af_revenue: parseFloat(price),
                af_currency: currency,
                af_content_id: subscriptionId,
                af_order_id: subscriptionId,
            });
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

export const appsFlyerLogout = () => {
    appsFlyer.setCustomerUserId('');
};
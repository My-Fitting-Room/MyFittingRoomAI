import { Singular, SingularConfig } from 'singular-react-native';
import Config from "react-native-config";
import Purchases from 'react-native-purchases';

export const trackSingularPurchase = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const activeSubscriptions = customerInfo.activeSubscriptions;
    const entitlements = customerInfo.entitlements.active;
    const subscriptionsInfo = customerInfo.subscriptionsByProductIdentifier;

    if (activeSubscriptions.length > 0 && Object.keys(entitlements).length > 0) {
      const subscriptionId = activeSubscriptions[0];
      let price = 0;
      let currency = 'USD';

      if (Object.keys(subscriptionsInfo).length > 0) {
        price = subscriptionsInfo[subscriptionId].price.amount;
        currency = subscriptionsInfo[subscriptionId].price.currency;
      }

      Singular.event('sng_purchase', {
        'revenue': parseFloat(price),
        'currency': currency,
        'product_id': subscriptionId,
        'content_type': 'subscription',
        'description': `${subscriptionId} subscription purchase`,
        'brand': 'MyFittingRoom',
        'quantity': 1
      });

      return;
    }
  } catch (error) {

    return;
  }
};

export const trackSingularStandardEvent = async (eventName, eventData = {}) => {
  try {
    Singular.event(eventName, eventData);

    return;
  } catch (error) {

    return;
  }
};

export const initSingularSDK = async () => {
  try {
    const config = new SingularConfig(Config.SINGULAR_SDK_KEY, Config.SINGULAR_SDK_SECRET)
      .withFacebookAppId('1876415689885099')
      .withSkAdNetworkEnabled(true)
      .withManualSkanConversionManagement(false)
      .withLimitDataSharing(false)
      .withWaitForTrackingAuthorizationWithTimeoutInterval(30);

    Singular.init(config);

    return;
  } catch (error) {

    return;
  }
};

export const singularLogin = (customerId) => {
  Singular.setCustomUserId(customerId);
};

export const singularLogout = () => {
  Singular.unsetCustomUserId();
};
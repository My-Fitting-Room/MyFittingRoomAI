import { TikTokBusiness, TikTokContentEventName, TikTokContentEventParameter, TikTokContentEventContentsParameter } from 'react-native-tiktok-business-sdk';
import Config from "react-native-config";
import Purchases from 'react-native-purchases';

export const trackTikTokPurchase = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const activeSubscriptions = customerInfo.activeSubscriptions;
    const entitlements = customerInfo.entitlements.active;
    const subscriptionsInfo = customerInfo.subscriptionsByProductIdentifier;

    if (activeSubscriptions.length > 0 && Object.keys(entitlements).length > 0) {
      const subscriptionId = activeSubscriptions[0];
      let price = 0;
      let currency = 'USD';

      if (Object.keys(subscriptionsInfo.length > 0)) {
        price = subscriptionsInfo[subscriptionId].price.amount;
        currency = subscriptionsInfo[subscriptionId].price.currency;
      }

      let purchaseEventData = {
        [TikTokContentEventParameter.CURRENCY]: currency,
        [TikTokContentEventParameter.VALUE]: price,
        [TikTokContentEventParameter.CONTENT_TYPE]: 'subscription',
        [TikTokContentEventParameter.DESCRIPTION]: `${subscriptionId} subscription purchase`,
        [TikTokContentEventParameter.CONTENTS]: [
          {
            [TikTokContentEventContentsParameter.CONTENT_ID]: subscriptionId,
            [TikTokContentEventContentsParameter.CONTENT_NAME]: 'Subscription',
            [TikTokContentEventContentsParameter.BRAND]: 'MyFittingRoom',
            [TikTokContentEventContentsParameter.PRICE]: parseFloat(price),
            [TikTokContentEventContentsParameter.QUANTITY]: 1,
          },
        ],
      };

      await TikTokBusiness.trackContentEvent(TikTokContentEventName.PURCHASE, purchaseEventData);

      return;
    } 
  } catch (error) {
    return;
  }
}

export const trackTikTokStandardEvent = async (event) => {
  try {
    await TikTokBusiness.trackEvent(event);
    return;
  } catch (error) {
    return;
  }
}


export const initTikTokSDK = async () => {
  try {
     await TikTokBusiness.initializeSdk(
      '6743954773',
      '7541003983867920391',            
      Config.TIKTOK_ACCESS_TOKEN,
      false                 
    );
    return;
  } catch (error) {
    return;
  }
};

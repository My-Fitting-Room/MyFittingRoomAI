import React from "react";
import { View, Text, Share, TouchableOpacity, Alert } from "react-native";
import { styles } from "../stylesheets/tokensBox";

const TokensBox = ({ tokensUsed, tokensTotal,plan, extraTokensTotal, referralCode }) => {

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Try on clothes online for free when you sign up and use my referral code: ${referralCode} https://apps.apple.com/us/app/my-fitting-room/id6743954773`,
        url: 'https://apps.apple.com/us/app/my-fitting-room/id6743954773',
      });
     
    } catch (error) {
      Alert.alert(
        "Error",
        "Please Try Again Later!",
        [{ 
          text: "OK"
        }]
      );
    }
  };

  if(plan !== null) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {(plan !== null && plan?.unlimited_tokens === true)
             ?                
             (                 
                <Text style={styles.tokenText}>
                  Unlimited Tokens
                </Text>
             )
          : (
            <>
              <Text style={styles.tokenText}>
                Tokens Used: {tokensUsed}/{tokensTotal} 
              </Text>
              {(extraTokensTotal > 0) ?                   
                (              
                  <>
                    <Text style={styles.tokenText}>
                      Referral tokens left: {extraTokensTotal}
                    </Text>
                    <TouchableOpacity onPress={handleShare}>
                      <Text style={[styles.tokenText, { color: '#007AFF' }]}>
                        Copy link and get 5 free try-ons
                      </Text>
                    </TouchableOpacity>
                  </>       
                )
                :                    
                (                     
                  <TouchableOpacity onPress={handleShare}>
                    <Text style={[styles.tokenText, { color: '#007AFF' }]}>
                      Copy link and get 5 free try-ons
                    </Text>
                  </TouchableOpacity>
                )                 
              }                              
            </>                           
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.tokenText}>
          Referral tokens left: {extraTokensTotal}
        </Text>
        <TouchableOpacity onPress={handleShare}>
          <Text style={[styles.tokenText, { color: '#007AFF' }]}>
            Copy link and get 5 free try-ons
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default TokensBox;
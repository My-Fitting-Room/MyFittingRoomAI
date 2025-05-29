import React from "react";
import { View, Text } from "react-native";
import { styles } from "../stylesheets/tokensBox";

const TokensBox = ({ tokensUsed, tokensTotal,plan }) => {

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
              <Text style={styles.tokenText}>
                Tokens Used: {tokensUsed}/{tokensTotal} 
              </Text>
            )
          }
        </View>
      </View>
    );
  } else {
    return <></>
  }
};

export default TokensBox;
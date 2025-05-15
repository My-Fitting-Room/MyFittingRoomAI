import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

const TokensBox = ({ tokensUsed, tokensTotal, renewalDate,plan }) => {

  if(plan !== null) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {(plan !== null && plan?.unlimited_tokens === true) 
            ? 
              (
                <>
                  <Text style={styles.tokenText}>
                    Unlimited Tokens
                  </Text>
                  <Text style={styles.tokenText}>
                    Renews: {renewalDate}
                  </Text>
                </>
              )
            : (
              <>
                <Text style={styles.tokenText}>
                  Tokens Used: {tokensUsed}/{tokensTotal} 
                </Text>
                <Text style={styles.tokenText}>
                  Renews: {renewalDate}
                </Text>
              </>
            )
          }
        </View>
      </View>
    );
  } else {
    return <></>
  }
 
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
    fontFamily: FONTS.SATOSHI,
    marginBottom:6
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 16,
    width: "100%",
  },
});

export default TokensBox;
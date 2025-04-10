import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

const TokensBox = ({ tokensUsed, tokensTotal, renewalDate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.tokenText}>
          Tokens Used: {tokensUsed}/{tokensTotal} | Renew: {renewalDate}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  contentContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
    fontFamily: FONTS.SATOSHI,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 16,
    width: "100%",
  },
});

export default TokensBox;
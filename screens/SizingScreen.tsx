import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Platform, 
  ActivityIndicator,
  TextInput,
  Dimensions,
  Modal
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import { FONTS } from "../constants/fonts";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

const CLOTHING_DATA = {
  "clothing_types": {
    "tops": {
      "shirt": {
        "required_measurements": ["chest", "sleeve_length", "shoulder_width"],
        "optional_measurements": ["neck", "waist"]
      },
      "t_shirt": {
        "required_measurements": ["chest"],
        "optional_measurements": ["shoulder_width", "length"]
      },
      "sweater": {
        "required_measurements": ["chest", "sleeve_length"],
        "optional_measurements": ["shoulder_width", "length"]
      },
      "jacket": {
        "required_measurements": ["chest", "sleeve_length", "shoulder_width"],
        "optional_measurements": ["waist"]
      },
      "coat": {
        "required_measurements": ["chest", "sleeve_length", "shoulder_width"],
        "optional_measurements": ["waist", "length"]
      },
      "blouse": {
        "required_measurements": ["bust", "sleeve_length", "shoulder_width"],
        "optional_measurements": ["waist"]
      }
    },
    "bottoms": {
      "trousers": {
        "required_measurements": ["waist", "inseam", "hip"],
        "optional_measurements": ["thigh", "leg_opening"]
      },
      "jeans": {
        "required_measurements": ["waist", "inseam", "hip"],
        "optional_measurements": ["thigh", "leg_opening"]
      },
      "shorts": {
        "required_measurements": ["waist", "hip"],
        "optional_measurements": ["inseam", "thigh"]
      },
      "skirt": {
        "required_measurements": ["waist", "hip"],
        "optional_measurements": ["length"]
      },
      "leggings": {
        "required_measurements": ["waist", "hip", "inseam"],
        "optional_measurements": ["thigh"]
      }
    },
    "dresses": {
      "dress": {
        "required_measurements": ["bust", "waist", "hip"],
        "optional_measurements": ["length", "shoulder_width"]
      }
    }
  },
  "country_measurements": {
    "UK": {
      "unit_system": "imperial",
      "measurements": {
        "chest": "inches",
        "bust": "inches",
        "waist": "inches",
        "hip": "inches",
        "inseam": "inches",
        "sleeve_length": "inches",
        "shoulder_width": "inches",
        "neck": "inches",
        "thigh": "inches",
        "leg_opening": "inches",
        "length": "inches"
      }
    },
    "USA": {
      "unit_system": "imperial",
      "measurements": {
        "chest": "inches",
        "bust": "inches",
        "waist": "inches",
        "hip": "inches",
        "inseam": "inches",
        "sleeve_length": "inches",
        "shoulder_width": "inches",
        "neck": "inches",
        "thigh": "inches",
        "leg_opening": "inches",
        "length": "inches"
      }
    },
    "EU": {
      "unit_system": "metric",
      "measurements": {
        "chest": "cm",
        "bust": "cm",
        "waist": "cm",
        "hip": "cm",
        "inseam": "cm",
        "sleeve_length": "cm",
        "shoulder_width": "cm",
        "neck": "cm",
        "thigh": "cm",
        "leg_opening": "cm",
        "length": "cm"
      }
    },
    "Japan": {
      "unit_system": "metric",
      "measurements": {
        "chest": "cm",
        "bust": "cm",
        "waist": "cm",
        "hip": "cm",
        "inseam": "cm",
        "sleeve_length": "cm",
        "shoulder_width": "cm",
        "neck": "cm",
        "thigh": "cm",
        "leg_opening": "cm",
        "length": "cm"
      }
    },
    "China": {
      "unit_system": "metric",
      "measurements": {
        "chest": "cm",
        "bust": "cm",
        "waist": "cm",
        "hip": "cm",
        "inseam": "cm",
        "sleeve_length": "cm",
        "shoulder_width": "cm",
        "neck": "cm",
        "thigh": "cm",
        "leg_opening": "cm",
        "length": "cm"
      }
    },
    "Italy": {
      "unit_system": "metric",
      "measurements": {
        "chest": "cm",
        "bust": "cm",
        "waist": "cm",
        "hip": "cm",
        "inseam": "cm",
        "sleeve_length": "cm",
        "shoulder_width": "cm",
        "neck": "cm",
        "thigh": "cm",
        "leg_opening": "cm",
        "length": "cm"
      }
    },
    "France": {
      "unit_system": "metric",
      "measurements": {
        "chest": "cm",
        "bust": "cm",
        "waist": "cm",
        "hip": "cm",
        "inseam": "cm",
        "sleeve_length": "cm",
        "shoulder_width": "cm",
        "neck": "cm",
        "thigh": "cm",
        "leg_opening": "cm",
        "length": "cm"
      }
    },
    "Canada": {
      "unit_system": "imperial",
      "measurements": {
        "chest": "inches",
        "bust": "inches",
        "waist": "inches",
        "hip": "inches",
        "inseam": "inches",
        "sleeve_length": "inches",
        "shoulder_width": "inches",
        "neck": "inches",
        "thigh": "inches",
        "leg_opening": "inches",
        "length": "inches"
      }
    }
  }
};

const DropdownSelect = ({ label, placeholder, value, options, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
          {value ? options.find(opt => opt.value === value)?.label || value : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#777" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    value === option.value && styles.selectedOption
                  ]}
                  onPress={() => {
                    onChange(option.value);
                    setModalVisible(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      value === option.value && styles.selectedOptionText
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function SizingScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [sizing, setSizing] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [clothingTypes, setClothingTypes] = useState([]);
  const [requiredMeasurements, setRequiredMeasurements] = useState([]);
  const [optionalMeasurements, setOptionalMeasurements] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    category: "",
    clothingType: "",
    measurements: {}
  });

  const presentPaywallIfNeeded = async () => {
    if (profile.price_id === null && !profile.all_access) {
      const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited"
      });    

      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          Alert.alert("Error", "Purchase Not Succesful");
          navigation.replace("TryOn");
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:

      }
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigation.navigate("First");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session?.user?.id)
          .single();

        if (error) {
          Alert.alert("Error", "Please Try Again Later!");
          return;
        }

        if (profileData.onboarding_complete === false) {
          navigation.navigate("Onboarding");
          return;
        }
        
        setProfile(profileData);
        setLoading(false);
      } catch (error) {
        navigation.navigate("First");
      }
    };

    checkSession();
  }, []);

  const getSessionToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || "";
    } catch (error) {
      return "";
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setFormData(prev => ({
      ...prev,
      category: value,
      clothingType: "",
      measurements: {}
    }));
    setClothingTypes(Object.keys(CLOTHING_DATA.clothing_types[value] || {}));
    setRequiredMeasurements([]);
    setOptionalMeasurements([]);
  };

  const handleClothingTypeChange = (value) => {
    const categoryData = CLOTHING_DATA.clothing_types[selectedCategory][value];
    setFormData(prev => ({
      ...prev,
      clothingType: value,
      measurements: {}
    }));
    setRequiredMeasurements(categoryData.required_measurements || []);
    setOptionalMeasurements(categoryData.optional_measurements || []);
  };

  const handleMeasurementChange = (measurement, value) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [measurement]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.brand || !formData.category || !formData.clothingType) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    await presentPaywallIfNeeded();

    const missingMeasurements = requiredMeasurements.filter(
      measurement => !formData.measurements[measurement]
    );

    if (missingMeasurements.length > 0) {
      Alert.alert(
        "Missing Measurements",
        `Please provide all required measurements: ${missingMeasurements.join(", ")}`
      );
      return;
    }

    setSubmitting(true);
    try {
      const access_token = await getSessionToken();

      const response = await fetch("https://my-fitting-room-server.onrender.com/api/gemini/clothing-size", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success === false) {
        Alert.alert("Error", "Failed to determine sizing. Please try again.");
        return;
      } else {
        setSizing(data.sizing);
      }
    } catch (e) {
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      brand: "",
      category: "",
      clothingType: "",
      measurements: {}
    });
    setSelectedCategory("");
    setSizing(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4052FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.heading}>Find My Size</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Brand</Text>
        <TextInput
          placeholderTextColor="#666"
          style={styles.input}
          placeholder="Nike"
          value={formData.brand}
          onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
        />
      </View>

      <DropdownSelect
        label="Category"
        placeholder="Select a category"
        value={selectedCategory}
        options={Object.keys(CLOTHING_DATA.clothing_types).map(category => ({
          value: category,
          label: category.charAt(0).toUpperCase() + category.slice(1)
        }))}
        onChange={handleCategoryChange}
      />

      {selectedCategory ? (
        <DropdownSelect
          label="Clothing Type"
          placeholder="Select a type"
          value={formData.clothingType}
          options={clothingTypes.map(type => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")
          }))}
          onChange={handleClothingTypeChange}
        />
      ) : null}

      {requiredMeasurements.length > 0 && (
        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>Required Measurements</Text>
          {requiredMeasurements.map((measurement) => (
            <View key={measurement} style={styles.inputGroup}>
              <Text style={styles.label}>
                {measurement.charAt(0).toUpperCase() + measurement.slice(1).replace("_", " ")}{" "}
                <Text style={styles.unitText}>
                  ({CLOTHING_DATA.country_measurements["USA"]["measurements"][measurement]})
                </Text>
              </Text>
              <TextInput
                placeholderTextColor="#666"
                style={styles.input}
                keyboardType="numeric"
                placeholder={`Enter ${measurement.replace("_", " ")}`}
                value={formData.measurements[measurement]?.toString() || ""}
                onChangeText={(text) => handleMeasurementChange(measurement, text)}
              />
            </View>
          ))}
        </View>
      )}

      {optionalMeasurements.length > 0 && (
        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>Optional Measurements</Text>
          {optionalMeasurements.map((measurement) => (
            <View key={measurement} style={styles.inputGroup}>
              <Text style={styles.label}>
                {measurement.charAt(0).toUpperCase() + measurement.slice(1).replace("_", " ")}{" "}
                <Text style={styles.unitText}>
                  ({CLOTHING_DATA.country_measurements["USA"]["measurements"][measurement]})
                </Text>
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#666"
                placeholder={`Enter ${measurement.replace("_", " ")} (optional)`}
                value={formData.measurements[measurement]?.toString() || ""}
                onChangeText={(text) => handleMeasurementChange(measurement, text)}
              />
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Find My Size</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSizingResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <TouchableOpacity onPress={handleResetForm}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.resultTitle}>Your Size</Text>
        <View style={{ width: 24 }} /> {/* For alignment */}
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.sizeText}>{sizing}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav navigation={navigation} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {sizing ? renderSizingResult() : renderForm()}
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="Sizing" />
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4052FF",
    fontFamily: FONTS.SATOSHI
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 70 : 80,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    width: "100%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 20,
    fontFamily: FONTS.SWITZER
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontFamily: FONTS.SATOSHI
  },
  unitText: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#333",  
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    fontFamily: FONTS.SATOSHI
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    maxHeight: height * 0.6,
    marginHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: FONTS.SATOSHI
  },
  optionsContainer: {
    maxHeight: height * 0.5,
  },
  optionItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  selectedOption: {
    backgroundColor: "#F0F4FF",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: FONTS.SATOSHI

  },
  selectedOptionText: {
    color: "#4052FF",
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI

  },
  measurementsSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 12,
    color: "#333",
    fontFamily: FONTS.SATOSHI
  },
  button: {
    backgroundColor: "#6666FF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  resultContainer: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "400",
    color: "#333",
    fontFamily: FONTS.SWITZER
  },
  resultContent: {
    alignItems: "center",
  },
  sizeText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#333",
    fontFamily: FONTS.SATOSHI
  },
  bottomPadding: {
    height: 80, 
  },
  paywallContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  paywallTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  paywallMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
    lineHeight: 24,
  },
  paywallButton: {
    backgroundColor: "#6666FF",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  paywallButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
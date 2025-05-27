import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,  
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
import { getDropdownStyles } from "../stylesheets/dropdownSelect";
import { getStyles } from "../stylesheets/sizingScreen";

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

const DropdownSelect = ({ label, placeholder, value, options, onChange , width,height }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // const styles = {
  //   small: {
  //     inputGroup: "mb-5",
  //     label: " mb-1.5 text-gray-800",
  //     dropdownButton: "flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white",
  //     dropdownText: " text-gray-800",
  //     dropdownPlaceholder: " text-gray-800",
  //     modalOverlay: "flex-1 justify-center bg-black/50",
  //     modalContent: "bg-white rounded-xl px-4 pb-4 mx-4 max-h-[70%]",
  //     modalHeader: "flex-row justify-between items-center py-3 border-b border-gray-200",
  //     modalTitle: "text-base font-semibold text-gray-800",
  //     optionsContainer: "max-h-80",
  //     optionItem: "py-3 border-b border-gray-200",
  //     selectedOption: "bg-blue-50",
  //     optionText: " text-gray-800",
  //     selectedOptionText: "text-[#4052FF] font-medium"
  //   },
  //   regular: {
  //     inputGroup: "mb-5",
  //     label: "text-base mb-2 text-gray-800",
  //     dropdownButton: "flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white",
  //     dropdownText: " text-gray-800",
  //     dropdownPlaceholder: " text-gray-800",
  //     modalOverlay: "flex-1 justify-center bg-black/50",
  //     modalContent: "bg-white rounded-xl px-4 pb-5 mx-5 max-h-[60%]",
  //     modalHeader: "flex-row justify-between items-center py-4 border-b border-gray-200",
  //     modalTitle: "text-lg font-semibold text-gray-800",
  //     optionsContainer: "max-h-80",
  //     optionItem: "py-3.5 border-b border-gray-200",
  //     selectedOption: "bg-blue-50",
  //     optionText: " text-gray-800",
  //     selectedOptionText: "text-[#4052FF] font-medium"
  //   },
  //   proMax: {
  //     inputGroup: "mb-5",
  //     label: "text-base mb-2 text-gray-800",
  //     dropdownButton: "flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white",
  //     dropdownText: " text-gray-800",
  //     dropdownPlaceholder: " text-gray-800",
  //     modalOverlay: "flex-1 justify-center bg-black/50",
  //     modalContent: "bg-white rounded-xl px-4 pb-5 mx-5 max-h-[60%]",
  //     modalHeader: "flex-row justify-between items-center py-4 border-b border-gray-200",
  //     modalTitle: "text-lg font-semibold text-gray-800",
  //     optionsContainer: "max-h-96",
  //     optionItem: "py-3.5 border-b border-gray-200",
  //     selectedOption: "bg-blue-50",
  //     optionText: " text-gray-800",
  //     selectedOptionText: "text-[#4052FF] font-medium"
  //   }
  // };

  // const style = styles[deviceType];

  const style = getDropdownStyles(width,height)

  return (
    <View className={style.inputGroup}>
      <Text className={style.label} style={{ fontFamily: FONTS.SATOSHI }}>{label}</Text>
      <TouchableOpacity
        className={style.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text 
          className={value ? style.dropdownText : style.dropdownPlaceholder}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
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
          className={style.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View className={style.modalContent}>
            <View className={style.modalHeader}>
              <Text 
                className={style.modalTitle}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                {label}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView className={style.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`${style.optionItem} ${value === option.value ? style.selectedOption : ""}`}
                  onPress={() => {
                    onChange(option.value);
                    setModalVisible(false);
                  }}
                >
                  <Text 
                    className={`${style.optionText} ${value === option.value ? style.selectedOptionText : ""}`}
                    style={{ fontFamily: FONTS.SATOSHI }}
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

  const { width, height } = Dimensions.get("window");
  // const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";

  // const deviceStyles = {
  //   small: {
  //     container: "flex-1 bg-gray-100 ",
  //     loadingContainer: "flex-1 justify-center items-center bg-white",
  //     loadingText: "mt-2.5 text-sm text-black",
  //     content: "flex-1 pt-20",
  //     contentContainer: "px-3",
  //     card: "bg-white rounded-xl p-4 my-2 shadow",
  //     formContainer: "w-full ",
  //     heading: "text-[20px] font-medium mb-6",
  //     inputGroup: "mb-5",
  //     label: " mb-1.5 text-gray-800",
  //     unitText: "text-xs text-gray-500",
  //     input: "border border-gray-300 rounded-lg p-3  bg-white text-gray-800",
  //     measurementsSection: "mt-2 mb-2",
  //     sectionTitle: "text-base font-normal mb-3 text-gray-800",
  //     button: "bg-[#6666FF] rounded-[10px] px-3 py-4 items-center mt-4",
  //     buttonText: "text-white  font-normal",
  //     resultContainer: "p-4",
  //     resultHeader: "flex-row justify-between items-center mb-5",
  //     resultTitle: "text-xl font-normal text-gray-800",
  //     resultContent: "items-center",
  //     sizeText: "text-lg font-normal text-gray-800",
  //     bottomPadding: "h-28"
  //   },
  //   regular: {
  //     container: "flex-1 bg-gray-100",
  //     loadingContainer: "flex-1 justify-center items-center bg-white",
  //     loadingText: "mt-2.5 text-2xl text-black",
  //     content: "flex-1 pt-20",
  //     contentContainer: "px-4",
  //     card: "bg-white rounded-xl p-4 my-2.5 shadow",
  //     formContainer: "w-full mt-3 ",
  //     heading: "text-[20px] font-medium mb-4",
  //     inputGroup: "mb-5",
  //     label: "text-base mb-2 text-gray-800",
  //     unitText: "text-sm text-gray-500",
  //     input: "border border-gray-300 rounded-lg p-4  bg-white text-gray-800",
  //     measurementsSection: "mt-2 mb-2",
  //     sectionTitle: "text-lg font-normal mb-3 text-gray-800",
  //     button: "bg-[#6666FF] rounded-[10px] p-4 items-center mt-5",
  //     buttonText: "text-white  font-normal",
  //     resultContainer: "p-4",
  //     resultHeader: "flex-row justify-between items-center mb-6",
  //     resultTitle: "text-2xl font-normal text-gray-800",
  //     resultContent: "items-center",
  //     sizeText: "text-xl font-normal text-gray-800",
  //     bottomPadding: "h-28"
  //   },
  //   proMax: {
  //     container: "flex-1 bg-gray-100",
  //     loadingContainer: "flex-1 justify-center items-center bg-white",
  //     loadingText: "mt-2.5 text-2xl text-black",
  //     content: "flex-1 pt-20",
  //     contentContainer: "px-4",
  //     card: "bg-white rounded-xl p-4 my-2.5 shadow",
  //     formContainer: "w-full",
  //     heading: "text-[20px] font-medium mb-4",
  //     inputGroup: "mb-5",
  //     label: "text-base mb-2 text-gray-800",
  //     unitText: "text-sm text-gray-500",
  //     input: "border border-gray-300 rounded-lg p-4  bg-white text-gray-800",
  //     measurementsSection: "mt-2 mb-2",
  //     sectionTitle: "text-lg font-normal mb-3 text-gray-800",
  //     button: "bg-[#6666FF] rounded-[10px] p-4 items-center mt-5",
  //     buttonText: "text-white  font-normal",
  //     resultContainer: "p-4",
  //     resultHeader: "flex-row justify-between items-center mb-6",
  //     resultTitle: "text-2xl font-normal text-gray-800",
  //     resultContent: "items-center",
  //     sizeText: "text-xl font-normal text-gray-800",
  //     bottomPadding: "h-28"
  //   }
  // };

  // const styles = deviceStyles[deviceType];

  const styles = getStyles(width,height)

  const [formData, setFormData] = useState({
    brand: "",
    category: "",
    clothingType: "",
    measurements: {}
  });

  const presentPaywallIfNeeded = async () => {
    if (profile.price_id === null && !profile.all_access) {
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited"
      });    

      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          navigation.replace("TryOn");
          break;
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          break;
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
      <View className={styles.loadingContainer}>
         <ActivityIndicator size={"large"} color="black" />
        <Text 
          className={styles.loadingText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  const renderForm = () => (
    <View className={styles.formContainer}>
      <Text 
        className={styles.heading}
        style={{ fontFamily: FONTS.SWITZER }}
      >
        Find My Size
      </Text>

      <View className={styles.inputGroup}>
        <Text 
          className={styles.label}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Brand
        </Text>
        <TextInput
          placeholderTextColor="#666"
          className={styles.input}
          placeholder="Nike"
          value={formData.brand}
          onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
          style={{ fontFamily: FONTS.SATOSHI }}
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
        width={width}
        height={height}

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
          width={width}
          height={height}
        />
      ) : null}

      {requiredMeasurements.length > 0 && (
        <View className={styles.measurementsSection}>
          <Text 
            className={styles.sectionTitle}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Required Measurements
          </Text>
          {requiredMeasurements.map((measurement) => (
            <View key={measurement} className={styles.inputGroup}>
              <Text 
                className={styles.label}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                {measurement.charAt(0).toUpperCase() + measurement.slice(1).replace("_", " ")}{" "}
                <Text className={styles.unitText}>
                  ({CLOTHING_DATA.country_measurements["USA"]["measurements"][measurement]})
                </Text>
              </Text>
              <TextInput
                placeholderTextColor="#666"
                className={styles.input}
                keyboardType="numeric"
                placeholder={`Enter ${measurement.replace("_", " ")}`}
                value={formData.measurements[measurement]?.toString() || ""}
                onChangeText={(text) => handleMeasurementChange(measurement, text)}
                style={{ fontFamily: FONTS.SATOSHI }}
              />
            </View>
          ))}
        </View>
      )}

      {optionalMeasurements.length > 0 && (
        <View className={styles.measurementsSection}>
          <Text 
            className={styles.sectionTitle}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Optional Measurements
          </Text>
          {optionalMeasurements.map((measurement) => (
            <View key={measurement} className={styles.inputGroup}>
              <Text 
                className={styles.label}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                {measurement.charAt(0).toUpperCase() + measurement.slice(1).replace("_", " ")}{" "}
                <Text className={styles.unitText}>
                  ({CLOTHING_DATA.country_measurements["USA"]["measurements"][measurement]})
                </Text>
              </Text>
              <TextInput
                className={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#666"
                placeholder={`Enter ${measurement.replace("_", " ")} (optional)`}
                value={formData.measurements[measurement]?.toString() || ""}
                onChangeText={(text) => handleMeasurementChange(measurement, text)}
                style={{ fontFamily: FONTS.SATOSHI }}
              />
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity 
        className={styles.button} 
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text 
            className={styles.buttonText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Find My Size
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSizingResult = () => (
    <View className={styles.resultContainer}>
      <View className={styles.resultHeader}>
        <TouchableOpacity onPress={handleResetForm}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text 
          className={styles.resultTitle}
          style={{ fontFamily: FONTS.SWITZER }}
        >
          Your Size
        </Text>
        <View style={{ width: 24 }} /> 
      </View>
      <View className={styles.resultContent}>
        <Text 
          className={styles.sizeText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          {sizing}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={styles.container}>
      <HeaderNav navigation={navigation} />
      <ScrollView
        className={styles.content}
        contentContainerStyle={{ paddingHorizontal:  15 }}
        showsVerticalScrollIndicator={false}
      >
        <View 
          className={styles.card}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {sizing ? renderSizingResult() : renderForm()}
        </View>
        <View className={styles.bottomPadding} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="Sizing" />
    </SafeAreaView>
  );
}
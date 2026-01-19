import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import OnBoardingImage from '../assets/images/OnboardingScreen21.png';



import { useOnboarding } from '../context/OnboardingContext';

import { uploadUserImage } from '../utils/upload';

const OnboardingScreen21 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedImage, setSelectedImage] = useState(onboardingData.userImage ? { uri: onboardingData.userImage } : null);
    const [isUploading, setIsUploading] = useState(false);

    const handleContinue = async () => {
        if (!selectedImage) return;

        setIsUploading(true);
        try {
            // Check if it's already a URL (e.g. from context)
            let imageUrl = onboardingData.userImage;

            // If selectedImage has a local uri (from picker), it needs upload
            if (selectedImage.uri && !selectedImage.uri.startsWith('http')) {
                imageUrl = await uploadUserImage(selectedImage);
            }

            updateOnboardingData({ userImage: imageUrl });
            navigation.navigate('OnboardingScreen22', { userImage: imageUrl });
        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert("Upload Error", "Failed to upload your photo. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert("Error", "Could not pick image.");
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setSelectedImage(asset);
            }
        });
    };

    return (
        <Container
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', opacity: (selectedImage && !isUploading) ? 1 : 0.5 }}
                    onPress={handleContinue}
                    disabled={!selectedImage || isUploading}
                    loading={isUploading}
                />
            }
        >
            <OnboardingHeader
                progress={0.875} initialProgress={0.833} nextProgress={0.917}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                title={"Upload a full body photo of yourself"}
                bottomText={"Use a photo taken by someone else in good lighting."}
            />

            <View style={styles.content}>
                <View style={styles.row}>
                    {/* Left Side: Example Image or Uploaded Image */}
                    <Image
                        source={selectedImage ? { uri: selectedImage.uri || selectedImage } : OnBoardingImage}
                        style={[styles.exampleImage, selectedImage && {
                            marginTop: 20,
                            width: '48%',
                            height: '82%',
                        }]}
                    />

                    {/* Right Side: Upload Area */}
                    <TouchableOpacity style={styles.uploadContainer} onPress={handleImagePick} activeOpacity={0.7} disabled={isUploading}>
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.uploadText}>
                                {selectedImage ? "Retake photo" : "Upload full body photo here."}
                            </Text>
                            <Ionicons name="cloud-upload-outline" size={40} color="#000" style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 300,
    },
    exampleImage: {
        width: '48%',
        height: '100%',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    uploadContainer: {
        width: '48%',
        height: '82%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Assuming white card look
        overflow: 'hidden', // For uploaded image
        marginTop: 20,
    },
    placeholderContainer: {
        alignItems: 'center',
        padding: 20,
    },
    uploadText: {
        fontFamily: Fonts.Medium,
        fontSize: 13,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 20,
    },
    icon: {
        marginTop: 10,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        fontSize: 15,
        fontFamily: Fonts.Regular,
        color: "#000000"
    },
    subtitle: {
        fontSize: 26,
        fontFamily: Fonts.Bold,
        color: "#6665FF"
    },
});

export default OnboardingScreen21;

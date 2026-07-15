import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../App";
import Feathericons from "react-native-vector-icons/Feather";
import { styles } from "../stylesheets/avatars";
import { triggerHaptic } from "../utils/haptics";

export default function Avatars({ profile = null, setSelectedAvatar, navigation }) {
  const [avatars, setAvatars] = useState([]);
  const [pendingAvatars, setPendingAvatars] = useState([]);
  const [modelImages, setModelImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedAvatarImage, setSelectedAvatarImage] = useState(null);
  const selectedAvatarRef = useRef(null);

  const updateSelectedAvatar = (avatar) => {
    selectedAvatarRef.current = avatar;
    setSelectedAvatarImage(avatar);
    setSelectedAvatar(avatar);
  };

  useEffect(() => {
    // null until the first fetch seeds the baseline, so pre-existing
    // failed rows don't fire the alert on every remount
    let currentFailedAvatars: any[] | null = null;

    const fetchAvatars = async () => {
      const { data: avatarsData, error: avatarsError } = await supabase
        .from("avatars")
        .select("*")
        .eq("profiles_id", profile.id)
        .order("created_at", { ascending: false });

      if (avatarsError) {
        return;
      }

      const failAvatars = (avatarsData || []).filter(avatar => avatar.status === "failed");
      const succAvatars = (avatarsData || []).filter(avatar => avatar.status === "success");
      const pendAvatars = (avatarsData || []).filter(avatar => avatar.status === "pending");

      if (currentFailedAvatars !== null && failAvatars.length > currentFailedAvatars.length) {
        Alert.alert("Error", "Your avatar creation failed!");
      }

      setAvatars(succAvatars);
      setPendingAvatars(pendAvatars);
      currentFailedAvatars = failAvatars;

      if (!selectedAvatarRef.current && succAvatars.length > 0) {
        updateSelectedAvatar(succAvatars[0]);
      }
    };

    const loadModelImages = async () => {
      const { data: modelImagesData, error: imageError } = await supabase
        .from("model_images")
        .select("*")
        .eq("profiles_id", profile.id)
        .order("created_at", { ascending: false });

      if (!imageError) {
        setModelImages(modelImagesData || []);
      }
    };

    const load = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      await Promise.all([fetchAvatars(), loadModelImages()]);
      setLoading(false);
    };

    load();

    const interval = setInterval(() => {
      if (profile) {
        fetchAvatars();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [profile]);

  const handleAvatarSelect = (avatar) => {
    updateSelectedAvatar(avatar);
  };

  const handleCreateAvatar = async (modelImage) => {
    try {
      triggerHaptic();
      setCreating(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        Alert.alert("Error", "You must be logged in to create an avatar.");
        setCreating(false);
        return;
      }

      const response = await fetch(
        "https://my-fitting-room-server.onrender.com/api/avatar/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            model_image_slug: modelImage.slug,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create avatar");
      }

      navigation.replace("Avatar");
    } catch (error) {
      Alert.alert("Error", "Failed to create avatar. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const confirmCreateAvatar = (modelImage) => {
    Alert.alert(
      "Create Avatar",
      "Create an avatar from this photo? We'll extract you onto a clean studio background.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Create", onPress: () => handleCreateAvatar(modelImage) },
      ]
    );
  };

  const handleDeleteAvatar = async () => {
    try {
      setDeleting(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        Alert.alert("Error", "Failed to delete avatar. Please try again.");
        setDeleting(false);
        return;
      }

      const response = await fetch(
        "https://my-fitting-room-server.onrender.com/api/image/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            image_bucket: "avatars",
            image_table: "avatars",
            image_slug: selectedAvatarImage.slug,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete avatar");
      }

      navigation.replace("Avatar");
    } catch (error) {
      Alert.alert("Error", "Failed to delete avatar. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color="black" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Avatar</Text>
        <Text style={styles.subheading}>Create an avatar once, then try on as many outfits as you like</Text>

        {pendingAvatars.length > 0 && (
          <View style={styles.pendingItem}>
            <View style={styles.loadingBar}></View>
            <Text style={styles.pendingText}>Creating your avatar....</Text>
          </View>
        )}

        {avatars.length > 0 ? (
          <>
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedAvatarImage?.url }}
                style={styles.selectedImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowPicker(!showPicker)}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#4052FF" />
                ) : (
                  <Feathericons name="user-plus" size={24} color="black" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeleteAvatar}
                disabled={!selectedAvatarImage || deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#FF0000" />
                ) : (
                  <Feathericons name="trash" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          pendingAvatars.length === 0 && (
            <View style={styles.createSection}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowPicker(!showPicker)}
                disabled={creating}
              >
                <View style={styles.createIconContainer}>
                  {creating ? (
                    <ActivityIndicator size="small" color="#4052FF" />
                  ) : (
                    <Feathericons name="user-plus" size={24} color="black" />
                  )}
                </View>
                <Text style={styles.createText}>
                  {creating ? "Creating..." : "Create your avatar"}
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {showPicker && (
          modelImages.length > 0 ? (
            <>
              <Text style={styles.pickerHeading}>Choose a model photo for your avatar</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pickerScrollContainer}
              >
                {modelImages.map((image, index) => (
                  <TouchableOpacity
                    key={image.id || index}
                    style={styles.thumbnailContainer}
                    onPress={() => confirmCreateAvatar(image)}
                    disabled={creating}
                  >
                    <Image
                      source={{ uri: image.url }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <Text style={styles.hintText}>Upload a model image on the Try-On tab first</Text>
          )
        )}
      </View>

      {avatars.length > 0 && (
        <>
          <Text style={styles.yourAvatarsHeading}>Your avatars</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={avatar.id || index}
                style={[
                  styles.thumbnailContainer,
                  selectedAvatarImage?.id === avatar.id && styles.selectedThumbnail
                ]}
                onPress={() => handleAvatarSelect(avatar)}
              >
                <Image
                  source={{ uri: avatar.url }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

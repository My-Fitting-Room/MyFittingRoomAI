import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../App";
import { launchImageLibrary } from "react-native-image-picker";
import Feathericons from "react-native-vector-icons/Feather";
import { Skeleton } from "./Skeleton";
import { styles } from "../stylesheets/avatars";
import { triggerHaptic } from "../utils/haptics";

// Matches heroImage in the stylesheet (width * 0.56) so the skeleton hero lands
// where the real avatar will.
const HERO_WIDTH = Dimensions.get("window").width * 0.56;

export default function Avatars({ profile = null, setSelectedAvatar, navigation, showPicker = false, setShowPicker = (_visible: boolean) => {}, resultImageUrl = null }) {
  const [avatars, setAvatars] = useState<any[]>([]);
  const [pendingAvatars, setPendingAvatars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedAvatarImage, setSelectedAvatarImage] = useState<any>(null);
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
        const previousFailedIds = new Set(currentFailedAvatars.map(avatar => avatar.id));
        const newlyFailed = failAvatars.filter(avatar => !previousFailedIds.has(avatar.id));
        // Server stores the raw OpenAI error; safety rejections mention the
        // safety system / moderation (or the stable safety_rejected code)
        const safetyRejected = newlyFailed.some(avatar => /safety|moderation/i.test(avatar.error_message || ""));

        if (safetyRejected) {
          Alert.alert(
            "Couldn't Create Avatar",
            "This photo couldn't be processed. Try a photo with a bit more coverage — fitted is fine, but very revealing shots sometimes get rejected."
          );
        } else {
          Alert.alert("Error", "Your avatar creation failed!");
        }
      }

      setAvatars(succAvatars);
      setPendingAvatars(pendAvatars);
      currentFailedAvatars = failAvatars;

      if (!selectedAvatarRef.current && succAvatars.length > 0) {
        updateSelectedAvatar(succAvatars[0]);
      }
    };

    const load = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      await fetchAvatars();
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

      // Refresh in place so the new "pending" avatar shows immediately, instead
      // of remounting the screen (the remount is what showed the old loading
      // spinner). The 15s poll then flips it to success / handles failures.
      if (profile) {
        const { data: refreshed } = await supabase
          .from("avatars")
          .select("*")
          .eq("profiles_id", profile.id)
          .order("created_at", { ascending: false });

        if (refreshed) {
          setAvatars(refreshed.filter(avatar => avatar.status === "success"));
          setPendingAvatars(refreshed.filter(avatar => avatar.status === "pending"));
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create avatar. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      triggerHaptic();
      setCreating(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        Alert.alert("Error", "You must be logged in to create an avatar.");
        return;
      }

      const result = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert("Error", `Image picker error: ${result.errorMessage}`);
        return;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        return;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || "image.jpg",
      });
      formData.append("image_bucket", "models");
      formData.append("image_table", "model_images");

      const uploadResponse = await fetch(
        "https://my-fitting-room-server.onrender.com/api/image/upload",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || "Failed to upload image");
      }

      // The upload response doesn't include the new row's slug, so fetch it
      const { data: modelImage, error: modelImageError } = await supabase
        .from("model_images")
        .select("*")
        .eq("profiles_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (modelImageError || !modelImage) {
        throw new Error("Failed to load uploaded image");
      }

      await handleCreateAvatar(modelImage);
    } catch (error) {
      Alert.alert("Error", "Failed to upload your photo. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // The parent's "New avatar" button toggles showPicker; the picker carousel
  // is gone, so treat it as a request to start the photo upload flow
  useEffect(() => {
    if (showPicker) {
      setShowPicker(false);
      handleUploadPhoto();
    }
  }, [showPicker]);

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

      // Remove locally and re-select the next avatar instead of remounting the
      // screen (the remount is what showed the old loading spinner).
      // updateSelectedAvatar keeps the ref and parent selection in sync.
      const remaining = avatars.filter(avatar => avatar.id !== selectedAvatarImage.id);
      setAvatars(remaining);
      updateSelectedAvatar(remaining[0] || null);
    } catch (error) {
      Alert.alert("Error", "Failed to delete avatar. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.rootContainer}>
        {/* Avatar hero */}
        <View style={styles.heroContainer}>
          <Skeleton width={HERO_WIDTH} height={252} borderRadius={16} />
        </View>
        {/* upload / delete actions */}
        <View style={styles.heroActions}>
          <Skeleton width={40} height={26} borderRadius={8} style={{ marginHorizontal: 18 }} />
          <Skeleton width={40} height={26} borderRadius={8} style={{ marginHorizontal: 18 }} />
        </View>
        {/* avatar switcher thumbnails */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
          {[0, 1, 2].map(i => (
            <Skeleton key={i} width={48} height={60} borderRadius={6} style={{ marginHorizontal: 4 }} />
          ))}
        </View>
        {/* "Your Avatar" heading + subtext */}
        <View style={{ alignItems: "center", marginTop: 28 }}>
          <Skeleton width={150} height={22} borderRadius={6} />
          <Skeleton width={240} height={14} borderRadius={6} style={{ marginTop: 12 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      {pendingAvatars.length > 0 && (
        <View style={styles.pendingItem}>
          <View style={styles.loadingBar}></View>
          <Text style={styles.pendingText}>Creating your avatar....</Text>
        </View>
      )}

      {avatars.length > 0 ? (
        <>
          <View style={styles.heroContainer}>
            {/* Display-only: the latest try-on result is shown here, but it is
                never used as the generation reference (that stays selectedAvatar,
                the original uploaded model) so quality can't compound. */}
            <Image
              source={{ uri: (resultImageUrl || selectedAvatarImage?.url) }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={handleUploadPhoto}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Feathericons name="user-plus" size={18} color="#9A9A9A" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={handleDeleteAvatar}
              disabled={!selectedAvatarImage || deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Feathericons name="trash" size={18} color="#9A9A9A" />
              )}
            </TouchableOpacity>
          </View>

          {avatars.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.switcherContainer}
            >
              {avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={avatar.id || index}
                  style={[
                    styles.switcherThumbnail,
                    selectedAvatarImage?.id === avatar.id && styles.switcherThumbnailSelected
                  ]}
                  onPress={() => handleAvatarSelect(avatar)}
                >
                  <Image
                    source={{ uri: avatar.url }}
                    style={styles.switcherThumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text style={styles.heading}>Your Avatar</Text>
          <Text style={styles.subtext}>
            Pick an item below and see it on you — same you, new outfit.
          </Text>
        </>
      ) : (
        pendingAvatars.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <TouchableOpacity
              onPress={handleUploadPhoto}
              disabled={creating}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/mannequin.png")}
                style={styles.emptyFigureImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text style={[styles.heading, styles.emptyHeading]}>
              Upload a full-body photo to{"\n"}create your first avatar
            </Text>

            <TouchableOpacity
              style={styles.uploadPillButton}
              onPress={handleUploadPhoto}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#6B6B6B" />
              ) : (
                <Text style={styles.uploadPillText}>Upload photo</Text>
              )}
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
}

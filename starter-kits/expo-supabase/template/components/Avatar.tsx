import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { COLORS, STORAGE_BUCKETS } from "@/lib/constants";

interface AvatarProps {
  /** Current avatar URL from Supabase Storage */
  url: string | null;
  /** Size in pixels (width and height) */
  size?: number;
  /** Whether to show the upload/edit overlay */
  editable?: boolean;
  /** Callback when avatar is uploaded. Receives the new public URL. */
  onUpload?: (url: string) => void;
  /** Fallback text to show when no image (e.g. user initials) */
  fallback?: string;
}

/**
 * User avatar component with optional upload capability.
 * Displays the user image from Supabase Storage, a fallback with initials,
 * or a placeholder icon. When editable, taps open the image picker.
 */
export function Avatar({
  url,
  size = 64,
  editable = false,
  onUpload,
  fallback,
}: AvatarProps) {
  const [uploading, setUploading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const pickAndUploadImage = async () => {
    if (!editable) return;

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to upload an avatar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    try {
      const asset = result.assets[0];
      const fileExt = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Read the file as a blob for upload
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.avatars)
        .upload(filePath, arrayBuffer, {
          contentType: asset.mimeType || `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from(STORAGE_BUCKETS.avatars)
        .getPublicUrl(filePath);

      onUpload?.(publicUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed";
      Alert.alert("Upload Error", message);
    } finally {
      setUploading(false);
    }
  };

  const borderRadius = size / 2;
  const backgroundColor = isDark ? COLORS.dark.card : COLORS.light.card;

  return (
    <TouchableOpacity
      activeOpacity={editable ? 0.7 : 1}
      onPress={editable ? pickAndUploadImage : undefined}
      disabled={uploading}
      style={{
        width: size,
        height: size,
        borderRadius,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {url ? (
        <Image
          source={{ uri: url }}
          style={{ width: size, height: size, borderRadius }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius,
            backgroundColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {fallback ? (
            <Text
              style={{
                fontSize: size * 0.36,
                fontWeight: "600",
                color: COLORS.brand[500],
              }}
            >
              {fallback}
            </Text>
          ) : (
            <Ionicons
              name="person"
              size={size * 0.45}
              color={COLORS.brand[500]}
            />
          )}
        </View>
      )}

      {/* Upload overlay */}
      {editable && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: size * 0.3,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="camera" size={size * 0.16} color="#ffffff" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

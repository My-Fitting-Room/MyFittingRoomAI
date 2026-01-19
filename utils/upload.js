import { Platform } from 'react-native';
import { supabase } from '../App';

/**
 * Uploads a local image file to the Onrender backend.
 * Returns the public image URL.
 */
export const uploadUserImage = async (imageAsset) => {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            throw new Error('Authentication required');
        }

        const supabaseToken = session.access_token;

        const formData = new FormData();

        // Handle iOS file URIs correctly
        const uri = Platform.OS === 'ios' ? imageAsset.uri.replace('file://', '') : imageAsset.uri;

        formData.append('file', {
            uri: imageAsset.uri, // fetch usually handles file:// on iOS, but let's be careful
            type: imageAsset.type || 'image/jpeg',
            name: imageAsset.fileName || `user_${Date.now()}.jpg`,
        });

        formData.append('image_bucket', 'models');
        formData.append('image_table', 'model_images');

        const response = await fetch(
            'https://my-fitting-room-server.onrender.com/api/image/upload',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${supabaseToken}`,
                },
                body: formData,
            }
        );

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to upload image');
        }

        return responseData.image_url;
    } catch (error) {
        console.error('uploadUserImage error:', error);
        throw error;
    }
};

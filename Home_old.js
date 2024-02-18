import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import RNPickerSelect from 'react-native-picker-select';
import styles from './AppStyles'; // Assuming you have this file for styles
import * as FileSystem from 'expo-file-system';
import GradientButton from './Button'; // Custom GradientButton component

export default function HomeScreen() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [image, setImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    const pickImage = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Permission is granted, proceed with opening the image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;  // Access the uri of the first image in the assets array
            console.log(imageUri);  // This should now log the correct URI
            setImage(imageUri);  // Set the selected image for UI display
        
            const savedImagePath = await saveImage(imageUri);
            if (savedImagePath) {
                await uploadImage(savedImagePath);  // Use the saved image path for uploading
            }
        }
        
    };


    // Function to save the image to the file system
    const saveImage = async (imageUri) => {
        const fileName = imageUri.split('/').pop(); // Extract the file name
        const newPath = FileSystem.documentDirectory + fileName; // Define the new path

        try {
            await FileSystem.moveAsync({
                from: imageUri,
                to: newPath,
            });
            console.log('Image saved to:', newPath);
            return newPath;  // Return the new path for future use
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Error', 'Failed to save the image');
            return null;  // In case of error, return null
        }
    };

    const uploadImage = async (imageUri) => {
        const formData = new FormData();
        const fileExtension = imageUri.split('.').pop();
        let mimeType = 'image/jpeg'; // Default to JPEG
        if (fileExtension === 'png') {
            mimeType = 'image/png';
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            mimeType = 'image/jpeg';
        } else if (fileExtension === 'gif') {
            mimeType = 'image/gif';
        }
        formData.append('image', {
            uri: imageUri,
            type: mimeType, // Dynamically set the MIME type
            name: `image.${fileExtension}`,
        });

        try {
            const response = await fetch('http://192.168.1.210:5000/analyze-image', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Upload success:', result);
                setAnalysisResult(result);  // Update the analysisResult state with the server response
                Alert.alert('Results', JSON.stringify(result));
            } else {
                console.error('Upload failed:', result.error);
                Alert.alert('Upload Failed', result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Could not upload the image');
        }
    };

    // JSX for rendering the component
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select your country:</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedCountry(value)}
                items={[
                    { label: 'Germany', value: 'germany' },
                    { label: 'South Korea', value: 'south_korea' },
                    { label: 'USA', value: 'usa' },
                    // Add other countries as needed...
                ]}
                style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputAndroid }}
                placeholder={{ label: "Select a country", value: null }}
            />
            <GradientButton title="Upload Image" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            {analysisResult && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Analysis Result: {JSON.stringify(analysisResult)}</Text>
                </View>
            )}
        </View>
    );
}
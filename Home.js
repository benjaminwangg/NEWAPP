import React, { useState } from 'react';
import { View, Text, TextInput, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import styles from './AppStyles';
import * as FileSystem from 'expo-file-system';
import GradientButton from './Button';
import MapView, { Marker } from 'react-native-maps';



export default function HomeScreen() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [town, setTown] = useState('');
    const [image, setImage] = useState(null);
    const [region, setRegion] = useState({
        latitude: 40.227352181093636,
        longitude: -74.91641223206882,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const mapStyle = StyleSheet.create({
        map: {
            width: '100%',
            height: 400,
        }
    });

    const [analysisResult, setAnalysisResult] = useState(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            setImage(imageUri);
            const savedImagePath = await saveImage(imageUri);
if (savedImagePath) {
    setImage(savedImagePath);  // Update the state to reflect the new image path
    await uploadImage(savedImagePath);
}

        }
    };

    const saveImage = async (imageUri) => {
        const fileName = imageUri.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;
        console.log('Attempting to save image:', imageUri);
    
        try {
            await FileSystem.moveAsync({ from: imageUri, to: newPath });
            console.log('Image saved to:', newPath);
            return newPath;
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Error', `Failed to save the image: ${error.message}`);
            return null;
        }
    };
    
    const uploadImage = async (imageUri) => {
        const formData = new FormData();
        const fileExtension = imageUri.split('.').pop();
        const mimeTypeMap = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif'
        };
        const mimeType = mimeTypeMap[fileExtension.toLowerCase()] || 'application/octet-stream';
        formData.append('file', { uri: imageUri, type: mimeType, name: `image.${fileExtension}` });
    
        console.log('Preparing to upload image:', imageUri);
    
        if (!selectedCountry) {
            Alert.alert('Error', 'Please select a country first');
            return;
        }
    
        try {
            const response = await fetch(`http://REPLACE_WITH_IP/predict?country=${selectedCountry}&town=${encodeURIComponent(town)}`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            const result = await response.json();
            if (response.ok) {
                setAnalysisResult(result);
                Alert.alert('Results', `Town: ${town}, Prediction: ${result.prediction}, Confidence: ${result.confidence}%, Where to recycle: ${result.centers}`);
            } else {
                console.error('Upload failed:', result.error);
                Alert.alert('Upload Failed', result.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            Alert.alert('Error', `Could not upload the image: ${error.message}`);
        }
    };
    
    console.log("Current image URI:", image);
    

    return (
        <ScrollView style={styles.scroll_container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Select your country:</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedCountry(value)}
                items={[
                    { label: 'Germany', value: 'Germany' },
                    { label: 'South Korea', value: 'South_Korea' },
                    { label: 'USA', value: 'USA' },
                    // Add other countries as needed...
                ]}
                style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputAndroid }}
                placeholder={{ label: "Select a country", value: null }}
            />
            <Text style={styles.label}>What town do you live in?</Text>  
            <TextInput
                style={styles.textInput}  // Define this style in your AppStyles
                onChangeText={setTown}
                value={town}
                placeholder="Enter your town"
            />
            <GradientButton title="Upload Image" onPress={pickImage} />
            {analysisResult && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Analysis Result: {JSON.stringify(analysisResult)}</Text>
                </View>
            )}
                        {image && <Image source={{ uri: image }} style={styles.image} onError={(e) => console.log('Image loading error:', e.nativeEvent.error)} />}

            <MapView
                style={mapStyle.map}
                initialRegion={region}
                onRegionChangeComplete={setRegion}
            >
                <Marker
                    coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                    title={"Pure Earth Solutions"}
                    description={"Description"}
                />
            </MapView>
        </ScrollView>
    );
    
}
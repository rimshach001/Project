import { View, Text, SafeAreaView, TouchableOpacity, Image, PermissionsAndroid, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { launchCamera,launchImageLibrary } from 'react-native-image-picker'
import * as ImagePicker from 'expo-image-picker';

const Camera = () => {
    const [selectImage, setSelectImage] = useState()
    const [takeImage, setTakeImage] = useState()

    const [imageUri, setImageUri] = useState(null);
    useEffect(() => {
        console.log(imageUri, "uri");
    }, [imageUri])
    const OpenCamera = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        console.log(granted, "-------");
        if (granted === true) {
            console.log("click")
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                console.log(result.assets[0].uri, "ooooo");
                setTakeImage(result.assets[0].uri);
            }
        }
    }
    const OpenGallery = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(granted, "-------");
        if (granted === true) {
          console.log("Gallery click");
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.cancelled) {
            console.log(result.assets[0].uri, "gallery ooooo");
            setImageUri(result.assets[0].uri);
          }
        }
      };
    return (
        <View style={{ marginTop: 100 }}>
            <ScrollView>
                <TouchableOpacity onPress={OpenGallery} style={{ height: 30, marginBottom: 10, backgroundColor: 'grey', width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 60 }} >
                    <Text>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={OpenCamera} style={{ height: 30, backgroundColor: 'grey', width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 60 }} >
                    <Text>cam</Text>
                </TouchableOpacity>
                
                    {imageUri ? (
                        <View>
                        <Image style={{ marginTop: 100, width: 200, height: 200 }} source={{ uri: imageUri }} />
                        <Text>Image from gallery</Text>
                        </View>
                    ) :
                        null
                    }
                     {takeImage ? (
                        <View>
                        <Image style={{ marginTop: 60, width: 200, height: 200 }} source={{ uri: takeImage }} />
                        <Text>Image from camera</Text>
                        </View>
                    ) :
                        null
                    }

            </ScrollView>
        </View>
    )
}

export default Camera
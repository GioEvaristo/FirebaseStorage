import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
 const [imageUri, setImageUri] = useState<string | null>(null);

 const escolherImagemDaGaleria = async () => {
   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
   if (status !== 'granted') {
     Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria.');
     return;
   }

   const result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
     allowsEditing: true, // pode editar a imagem selecionada
     aspect: [4, 3], //formato da imagem
     quality: 1, // entre 0 e 1, onde o 1 é melhor
   });

   if (!result.canceled) {
     setImageUri(result.assets[0].uri);
   }

 };

 const tirarFoto = async () => {
   const { status } = await ImagePicker.requestCameraPermissionsAsync();
   if (status !== 'granted') {
     Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a câmera.');
     return;
   }

   const result = await ImagePicker.launchCameraAsync({
     allowsEditing: true,
     aspect: [4, 3],
     quality: 1,
   });

   if (!result.canceled) {
     setImageUri(result.assets[0].uri);
   }
 };

 return (
   <View style={styles.container}>
    <Text>Brincando com Fotos</Text>
     <Button title="Escolher Imagem da Galeria" onPress={escolherImagemDaGaleria} />
     <View style={{ height: 10 }} />
     <Button title="Tirar Foto com a Câmera" onPress={tirarFoto} />
     {/* Exibe a imagem apenas se uma URI estiver definida */}
     {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
   padding: 20,
   backgroundColor: '#bbfdf2ff',
 },
 image: {
   width: 300,
   height: 300,
   marginTop: 20,
   borderRadius: 30,
 },
});
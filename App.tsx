import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from './src/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const escolherImagemDaGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
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

    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1, });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImagem = async () => {
    if (!imageUri) {
      Alert.alert("Nenhuma imagem selecionada", "Por favor, escolha uma imagem primeiro.");
      return;
    }
    setIsUploading(true);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const nomeArquivo = `${Date.now()}.jpg`;
      const storageRef = ref(storage, 'images/' + nomeArquivo);

      console.log("Tentando upload para:", `images/${nomeArquivo}`);
      console.log("Blob size:", blob.size, "type:", blob.type);

      // realiza o envio de fato para o storage
      await uploadBytes(storageRef, blob);
      Alert.alert("Upload concluído!", "Sua imagem foi enviada com sucesso!");
      console.log("deu certooo");

      const download = await getDownloadURL(storageRef);
      console.log("DOWNLOAD => " + download)
    } catch (error) {
        console.error("Erro no upload: ", error);
        Alert.alert("Erro no Upload", "Ocorreu um erro ao enviar sua imagem.");
    } finally {
      setIsUploading(false);
      setImageUri(null);
    }

  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26, color: "#00abc9ff", fontWeight: "bold" }}>✭ Brincando com Fotos ✭</Text>
      <Image style={{ width: 215, height: 250, margin: 10, marginBottom: 20 }} source={require('./assets/logo_miku.webp')}></Image>
      <Button title="Escolher Imagem da Galeria" onPress={escolherImagemDaGaleria} color="#e12885"/>
      <View style={{ height: 10 }} />
      <Button title="Tirar Foto com a Câmera" onPress={tirarFoto} color="#e12885"/>
      {/* Exibe a imagem apenas se uma URI estiver definida */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View>
          <Text style={{ fontSize: 15, color: "#00313aff", margin: 10 }}>Selecione uma imagem!!</Text>
        </View>
      )}
      <Button
        title={isUploading ? "Enviando..." : "Enviar para Storage"}
        onPress={uploadImagem} color="#e12885"
        disabled={!imageUri || isUploading} // Desabilita o botão se não houver imagem ou se estiver enviando
      />
      <Image style={{ margin: 10, marginBottom: 10 }} source={require('./assets/ursinho.gif')}></Image>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#efb5f5ff',
  },
  image: {
    width: 200,
    height: 100,
    margin: 20,
    borderRadius: 10,
    borderColor: '#37f586ff',
    borderWidth: 3,
  },
});
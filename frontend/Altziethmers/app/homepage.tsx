import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAccountContext } from '@/components/AccountContext';
import { Button } from 'react-native-paper';
import { Link, useRouter, Redirect } from 'expo-router'; // <-- Import useRouter here
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/utils/Image';

// Background Image
const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

export default function HomeScreen() {
  const { user, logout } = useAccountContext();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [image, setImage] = useState<any>(null);
  const router = useRouter(); 

  useEffect(() => {
    if (!user) {
        router.push('/');  // Redirect to homepage after user is logged out
    }
  }, [user]); 

  if (!user) {
      return <Redirect href="/" />;
    }
  
  // Get the router object to programmatically navigate

  // Logout Function
  const handleLogout = () => {
    logout();
    setTimeout(() => {
      router.push('/');  // Redirect to the homepage
    }, 0);  // Redirect to homepage using expo-router
  };

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      // console.log("RESULT: ", result.assets[0].uri);
      setImage(result.assets[0].uri); // This is the image URI
      let response = await uploadImage(result.assets[0].uri, user.id); // Upload the image to the server
      // console.log(response)
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      
      {/* Profile Section (Top Left) */}
      {user && (
        <TouchableOpacity 
          style={styles.profileContainer} 
          onPress={() => setShowProfileDetails(!showProfileDetails)}
        >
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
            </View>
            {showProfileDetails && <Text style={styles.username}>{user.username}</Text>}
          </View>
          {showProfileDetails && (
            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
              Logout
            </Button>
          )}
        </TouchableOpacity>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Link href="/" style={styles.tab}>
          <Text style={styles.tabText}>🏠 Homepage</Text>
        </Link>
        <Link href="/progress" style={styles.tab}>
          <Text style={styles.tabText}>📈 Progress</Text>
        </Link>
        <Link href="/chatbot" style={styles.tab}>
          <Text style={styles.tabText}>🗣️ Chatbot</Text>
        </Link>
        <Link href="/forum" style={styles.tab}>
          <Text style={styles.tabText}>forum</Text>
        </Link>
        {/* <Link href="/App" style={styles.tab}>
          <Text style={styles.tabText}>🗣️ App</Text>
        </Link> */}
      </View>

      {/* Card Content */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to My App</Text>
        <Text style={styles.subtitle}>Explore the amazing features</Text>
        <TouchableOpacity style={styles.button} onPress={handleAddImage}>
          <Text style={styles.buttonText}>Add Image</Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}
      </View>

    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  profileContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 242, 255, 0.8)', // Increased opacity
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6a11cb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoutButton: {
    marginLeft: 10,
    backgroundColor: '#6a11cb',
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensure the tabs wrap on smaller screens
    position: 'absolute',
    top: 125,
    width: '90%', // Keep it responsive for mobile screens
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 5, 65, 0.2)', // Background with opacity
    borderRadius: 30,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    margin: 5, // Adds space between tabs
    borderWidth: 1, // Adds a border width
    borderColor: '#fff', // Sets the border color to white
    borderStyle: 'solid', // Ensures a solid border style
  },
  
  tabText: {
    fontSize: 14, // Slightly smaller text size for better fit on mobile screens
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center', // Ensure the text is centered within each tab
  },  
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 40,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 230,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

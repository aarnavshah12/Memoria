import { StyleSheet, Text, View, Image, Animated, Easing, ImageBackground, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'expo-router';
import { useAccountContext } from '@/components/AccountContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);


// Assets
const logoPath = require('../assets/images/memoria_main-removebg-preview.png');
const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

// async function requestPermissions() {
//   if (Device.isDevice) {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       await Notifications.requestPermissionsAsync();
//     }
//   }
// }

// async function scheduleRepeatingAlarm() {
//   await Notifications.cancelAllScheduledNotificationsAsync();
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Alarm ⏰",
//       body: "Time to check your progress!",
//       sound: "default",
//     },
//     trigger: {
//       seconds: 10,
//       repeats: true,
//     },
//   });
// }

const LandingPage = () => {
  const { user } = useAccountContext();
  const [loading, setLoading] = useState(true);
  const progress = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 3000, // Loading animation lasts 3 seconds
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setLoading(false); // Hide loading bar when complete
    });

    // if (Platform.OS !== 'web') { 
    //   requestPermissions();
    //   scheduleRepeatingAlarm();
    // }
  }, []);

  if (user) {
    return <Redirect href="/homepage" />;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={logoPath} style={styles.logo} />

        {/* Loading Bar */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[styles.loadingBar, { width: progress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }) }]}
            />
          </View>
        ) : (
          <>
            {/* Sign-up Button */}
            <Link href="/signup" style={styles.signupButton}>
              <Text style={styles.signupText}>Sign Up</Text>
            </Link>

            {/* Learn More Button */}
            <Link href="/moreInfo" style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Link>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%', // Ensures the container takes up the full screen
    paddingHorizontal: 20,
  },
  logo: {
    width: '120%',
    height: '50%',
    resizeMode: 'contain',
    marginBottom: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loadingContainer: {
    width: '80%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#6a11cb',
    borderRadius: 5,
  },
  signupButton: {
    marginTop: 40,
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',  // This will center the text vertically
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Android shadow
    width: '80%', // Ensures button spans enough space on small screens
    position: 'absolute', // This makes sure the button is fixed
    bottom: 195, // Adjust this to position the button where you'd like
  },
  signupText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center', // This ensures horizontal centering of text
  },
  learnMoreButton: {
    marginTop: 15,
    backgroundColor: '#a787b4', // Change color for differentiation
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    width: '60%',
    height: '6%',
    position: 'absolute',
    bottom: 130, // Position it slightly lower than the Sign Up button
  },
  learnMoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
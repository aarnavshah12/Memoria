import { Link, Redirect } from 'expo-router';
import { View, Text, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { LoginScreen } from '@/components/login';
import { useAccountContext } from '@/components/AccountContext';

const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

export default function HomeScreen() {
  const { user } = useAccountContext();
  if (user) {
      return <Redirect href="/homepage" />;
    }
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>
        <LoginScreen/>
        <Link href="/signup" style={styles.link}>Don’t have an account? Sign up</Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque for better readability
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, // Shadow effect on Android
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginContainer: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#CCC',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  link: {
    marginTop: 20,
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

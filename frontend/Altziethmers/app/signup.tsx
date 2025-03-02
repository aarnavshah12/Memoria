import { Link, Redirect } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { SignupScreen } from '@/components/signup_form';
import { useAccountContext } from '@/components/AccountContext';

const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

export default function HomeScreen() {
  const { user, logout } = useAccountContext();
  if (user) {
      return <Redirect href="/homepage" />;
    }
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <SignupScreen/>

        <Link href="/login" style={styles.link}>Already have an account? Login</Link>
        {/* <Link href="/homepage">View homepage</Link> */}
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque for better contrast
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
  formContainer: {
    width: '100%',
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});


{/* <View style={styles.formContainer}>
          <TextInput placeholder="Full Name" placeholderTextColor="#888" style={styles.input} />
          <TextInput placeholder="Email" placeholderTextColor="#888" style={styles.input} />
          <TextInput placeholder="Password" placeholderTextColor="#888" secureTextEntry style={styles.input} />
          <TextInput placeholder="Confirm Password" placeholderTextColor="#888" secureTextEntry style={styles.input} />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View> */}
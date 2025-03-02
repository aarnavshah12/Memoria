import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Link } from "@react-navigation/native";
import { useAccountContext } from "./AccountContext";
import { useNavigation } from "@react-navigation/native";



export const SignupScreen = () => {
  const { signup } = useAccountContext();
  const { control, handleSubmit } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
      setIsClient(true)
    }, [])

  const onSignup = async (email: string, username: string, password: string) => {
    // console.log("Signup Data:", data);
    // try {
    //     const response = await fetch("http://192.168.2.66:5001/signup", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ email, username, password }),
    //         });
            
    //         const data = await response.json();
    //         console.log("Signup Response:", data);
    // } catch (error) {
    //     console.error("Signup Error:", error);
    // }
    const response = await signup(email, username, password);
    if (!response.ACCOUNT_ID) {
      setError(response);
      setVisible(true);
      console.log("Signup Error:", response);
    } else {
      navigation.navigate(`verification/[id]`, { id: response.ACCOUNT_ID });
    }
    // signup(email, username, password);
  };


  return (
    <View style={styles.formContainer}>
      {/* <Text variant="headlineMedium">Sign Up</Text> */}

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={e => onSignup(email, username, password)} style={styles.button}>
        Sign Up
      </Button>


      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "OK",
          onPress: () => setVisible(false),
        }}>
        {error}
      </Snackbar>

    </View>
  );
};


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
  }
});

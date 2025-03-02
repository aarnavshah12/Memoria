import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Link } from "@react-navigation/native";
import { useAccountContext } from "./AccountContext";
import { Redirect } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export const LoginScreen = () => {
  const { login } = useAccountContext();
  const { control, handleSubmit } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const navigation = useNavigation<any>();


  useEffect(() => {
    setIsClient(true)
  }, [])

  const onLogin = async (email: string, password: string) => {
  //   try {
  //     const response = await fetch("http://192.168.2.66:5001/login", {
  //         method: "POST",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, password }),
  //         });
          
  //         const data = await response.json();
  //         console.log("Signup Response:", data);
  // } catch (error) {
  //     console.error("Signup Error:", error);
  // }
    // login(email, password);
    const response = await login(email, password);
    if (response) {
      setError(response);
      setVisible(true);
    } else {
      navigation.navigate("index");
    }
  };


  return (
    <View style={styles.loginContainer}>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
        keyboardType="email-address"
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

      <Button mode="contained" onPress={e => onLogin(email, password)} style={styles.button}>
        Log In
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
  button: { marginTop: 10 }
});


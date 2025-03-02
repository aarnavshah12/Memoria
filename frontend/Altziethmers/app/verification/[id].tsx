// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
// import { useState, useRef } from 'react';
// import { useAccountContext } from '@/components/AccountContext';
// import { useLocalSearchParams } from "expo-router";
// import { useNavigation } from "@react-navigation/native";

// const backgroundImage = require('@/assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

// export default function VerificationScreen() {
//   const { id } = useLocalSearchParams();
//   const [code, setCode] = useState(['', '', '', '', '', '']);
//   const inputs = useRef([]);
//   const { user, verification } = useAccountContext();
//   const navigation = useNavigation<any>();

//   const handleChange = (text, index) => {
//     if (text.length > 1) return;
//     const newCode = [...code];
//     newCode[index] = text;
//     setCode(newCode);

//     if (text && index < inputs.current.length - 1) {
//       inputs.current[index + 1].focus();
//     }
//   };

//   const handleKeyPress = (e, index) => {
//     if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
//       inputs.current[index - 1].focus();
//     }
//   };

//   const handleVerification = async () => {
//     alert('Verification code entered: ' + code.join(''));
//     console.log(code.join(''));
//     if (id) {
//       console.log('ID:', id);
//       const response = await verification(id, code.join(''));
//       if (response) {
//         console.log("Signup Error:", response);
//       } else {
//         navigation.navigate("index");
//       }
//     } else {
//       console.error('No ID found', id);
//     }
//   };

//   return (
//     <ImageBackground source={backgroundImage} style={styles.background}>
//       <View style={styles.overlay}>
//         <Text style={styles.title}>Verification Code</Text>
//         <Text style={styles.label}>Enter The 6-Digit-Code</Text>
//         <View style={styles.codeContainer}>
//           {code.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={(el) => (inputs.current[index] = el)}
//               style={styles.inputBox}
//               keyboardType="numeric"
//               maxLength={1}
//               value={digit}
//               onChangeText={(text) => handleChange(text, index)}
//               onKeyPress={(e) => handleKeyPress(e, index)}
//             />
//           ))}
//         </View>
//         <TouchableOpacity style={styles.button} onPress={handleVerification}>
//           <Text style={styles.buttonText}>Verify</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slight opacity for overlay effect
//     padding: 30,
//     borderRadius: 20,
//     width: '85%',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5, // Shadow effect on Android
//   },
//   title: {
//     fontSize: 45,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 20,
//     marginBottom: 30,
//     color: '#555',
//   },
//   codeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   inputBox: {
//     width: 80,
//     height: 80,
//     borderWidth: 1,
//     borderColor: '#555',
//     textAlign: 'center',
//     fontSize: 23,
//     marginHorizontal: 5,
//     borderRadius: 5,
//   },
//   button: {
//     marginTop: 20,
//     width: 150,
//     height: 50,
//     backgroundColor: '#007BFF',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useState, useRef } from 'react';
import { useAccountContext } from '@/components/AccountContext';
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const backgroundImage = require('@/assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

export default function VerificationScreen() {
  const { id } = useLocalSearchParams();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const { user, verification } = useAccountContext();
  const navigation = useNavigation<any>();

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerification = async () => {
    alert('Verification code entered: ' + code.join(''));
    console.log(code.join(''));
    if (id) {
      console.log('ID:', id);
      const response = await verification(id, code.join(''));
      if (response) {
        console.log("Signup Error:", response);
      } else {
        navigation.navigate("index");
      }
    } else {
      console.error('No ID found', id);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.label}>Enter The 6-Digit Code</Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={styles.inputBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleVerification}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#555',
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  button: {
    marginTop: 20,
    width: 130,
    height: 45,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

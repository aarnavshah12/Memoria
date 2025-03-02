import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerURL } from "../utils/config";  // Adjusted import for different folder structure

interface User {
    id: number;
    username: string;
    email: string;
    loggedIn: boolean;
}


interface AccountContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void | string>;
    signup: (email: string, username: string, password: string) => Promise<void | string | {ACCOUNT_ID: number}>;
    verification: (account_id: string, input_code: string) => Promise<void | string>;
    logout: () => void;
  }

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // This is the login function thing
    useEffect(() => {
        // Check if a session exists when the app loads
        const loadUserFromStorage = async () => {
        if (Platform.OS !== 'web') {
            const userData = await SecureStore.getItemAsync("user");
            if (userData) {
                setUser(JSON.parse(userData));  // Set user state from stored data
            }
        } else {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData)); 
             } // Set user state from stored data
        }
        };
        loadUserFromStorage();
      }, []);
    const login = async (email: string, password: string) => {
        try {
            const serverURL = await getServerURL();
            const response = await fetch(`${serverURL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                });
                
                const data = await response.json();
                if (response.ok) {
                    const loggedInUser = {
                        id: data.id,
                        email: email,
                        username: data.username,
                        loggedIn: true,
                      };
                    setUser(loggedInUser);
                    if (Platform.OS !== 'web') {
                        await SecureStore.setItemAsync("user", JSON.stringify(loggedInUser));
                    } else {
                        await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
                    }
                }
                else {
                    console.error("Login failed:", data.message);
                    return data.message
                }
                console.log("Login Response:", data);
        } catch (error) {
            console.error("Login Error:", error);
        }
    }


    const signup = async (email: string, username: string, password: string) => {
        try {
            const serverURL = await getServerURL();
            const response = await fetch(`${serverURL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
                });
                
                const data = await response.json();
                if (response.ok) {
                    // const signedUpUser = {
                    //     id: data.id,
                    //     email: email,
                    //     username: username,
                    //     loggedIn: true,
                    //   };
                    // setUser(signedUpUser);
                    // if (Platform.OS !== 'web') {
                    //     await SecureStore.setItemAsync("user", JSON.stringify(signedUpUser));
                    // } else {
                    //     await AsyncStorage.setItem("user", JSON.stringify(signedUpUser));
                    // }
                    return {ACCOUNT_ID: data.id}
                        
                    } 
                else {
                    console.error("Sign up failed:", data.message);
                    return data.message
                }
                console.log("Signup Response:", data);
        } catch (error) {
            console.error("Signup Error:", error);
        }
    }

    const verification = async (account_id:string, input_code: string) => {
        try {
            const serverURL = await getServerURL();
            const response = await fetch(`${serverURL}/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ account_id, input_code }),
                });
                
                const data = await response.json();
                if (response.ok) {
                    const signedUpUser = {
                        id: data.id,
                        email: data.email,
                        username: data.username,
                        loggedIn: true,
                      };
                    setUser(signedUpUser);
                    if (Platform.OS !== 'web') {
                        await SecureStore.setItemAsync("user", JSON.stringify(signedUpUser));
                    } else {
                        await AsyncStorage.setItem("user", JSON.stringify(signedUpUser));
                    }
                        
                    } 
                else {
                    console.error("Sign up failed:", data.message);
                    return data.message
                }
                console.log("Signup Response:", data);
        } catch (error) {
            console.error("Signup Error:", error);
        }
    }

    const logout = async () => {
        setUser(null);
        if (Platform.OS !== 'web') {
            await SecureStore.deleteItemAsync("user");
        } else {
            await AsyncStorage.removeItem("user");
        }
    };
    return (
        <AccountContext.Provider value={{ user, login, signup, logout, verification }}>
          {children}
        </AccountContext.Provider>
    );
}


export const useAccountContext = () => {
    const context = useContext(AccountContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
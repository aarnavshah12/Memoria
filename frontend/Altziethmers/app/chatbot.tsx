import { 
  View, Text, StyleSheet, TouchableOpacity, ImageBackground, 
  TextInput, ScrollView, ActivityIndicator, Keyboard, Image
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Constants from 'expo-constants'; 
import { parse, format, isValid, addDays } from 'date-fns';
import { getImages } from "@/utils/Image";
import { useAccountContext } from "@/components/AccountContext";
import { Redirect } from 'expo-router';

const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');
export default function ChatBotScreen() {
  const [messages, setMessages] = useState([{ text: 'Hi! How can I help you?', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const { user } = useAccountContext();
  const API_URL = Constants.manifest?.extra?.GEMINI_API_URL || process.env.EXPO_PUBLIC_GEMINI_API_URL;
  const API_KEY = Constants.manifest?.extra?.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!user) {
    return <Redirect href="/" />;
  }
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const rephraseDateTime = async (text) => {
    try {
      console.log('Calling Gemini API with:', text);
      

  
      const requestBody = {
        contents: [{ 
          role: "user", 
          parts: [{ text: `Extract the exact date from this user query and REFORMAT it to "MMMM d, yyyy" (e.g., "February 18, 2025"). In the case that no year is provided use "2025". If a vague reference (e.g., "Last week") is provided, convert it to an exact date relative to the current date (Current date is: ${currentDate}), using the best of your abilities, reformat it to "MMMM d, yyyy" (e.g., "February 18, 2025"). The final output should be in the format "MMMM d, yyyy" with no other text. Query: "${text}"` }] 
        }]
      };
  
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log('Gemini API Response:', data);
  
      if (!response.ok || !data) throw new Error(data.error?.message || "API request failed");
  
      const reformattedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      console.log('Reformatted DateTime:', reformattedText);
  
      return reformattedText;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return null;
    }
  };
  
  const parseDate = (text) => {
    const lowerText = text.toLowerCase().trim();
  
    if (lowerText.includes("today")) return format(new Date(), "yyyy-MM-dd");
    if (lowerText.includes("yesterday")) return format(addDays(new Date(), -1), "yyyy-MM-dd");
    if (lowerText.includes("tomorrow")) return format(addDays(new Date(), 1), "yyyy-MM-dd");
  
    const parsed = parse(text, "MMMM d, yyyy", new Date());
    return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : null;
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;
  
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);
  
    try {
      // 🔥 Step 1: Rephrase user input into a structured date
      const rephrasedDate = await rephraseDateTime(input);
  
      if (!rephrasedDate) {
        // No date provided, answering general questions
        setMessages(prev => [
          ...prev,
          {
            text: "No specific date provided, I will answer your query using the current date and time.",
            sender: 'bot',
          },
        ]);
  
  
        if (!API_URL || !API_KEY) {
          throw new Error("API URL or API Key is missing.");
        }
  
        const requestBody = {
          contents: [{ role: "user", parts: [{ text: input }] }],
        };
  
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
        if (!response.ok || !data) throw new Error(data.error?.message || "API request failed");
  
        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't understand that.";
        setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
        setLoading(false);
        return;
      }
  
      // 🔥 Step 2: Parse the date and check if it's valid
      const formattedDate = parseDate(rephrasedDate);
  
      if (!formattedDate) {
        setMessages(prev => [...prev, { text: "I couldn't determine the date.", sender: 'bot' }]);
        setLoading(false);
        return;
      }
  
      console.log(`Fetching images for: ${formattedDate}`);
  
      if (!user || !user.id) {
        setMessages(prev => [...prev, { text: "Error: User not found.", sender: 'bot' }]);
        setLoading(false);
        return;
      }
  
      // 🔥 Step 3: Fetch images only for the parsed date
      const imagesResult = await getImages(user.id, formattedDate);
      setLoading(false);
  
      if (imagesResult?.images?.length > 0) {
        const imageMessages = imagesResult.images.map((img, index) => ({
          image: { uri: `data:image/png;base64,${img.image}` },
          caption: img.caption,
          sender: 'bot',
          id: index.toString(),
        }));
  
        setMessages(prev => [...prev, ...imageMessages]);
  
        // 🔥 Step 4: Extract Captions and Summarize Using Gemini API
        const captions = imagesResult.images.map(img => img.caption).join(" ");
          
        const requestBody = {
          contents: [{ role: "user", parts: [{ text: `Summarize these captions into an overview of my day: ${captions}` }] }]
        };
  
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
        if (!response.ok || !data) throw new Error(data.error?.message || "API request failed");
  
        const summaryText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't summarize your day.";
  
        // Display summary in the chat
        setMessages(prev => [...prev, { text: `📅 Your day summary:\n${summaryText}`, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, { text: "No images found for this date.", sender: 'bot' }]);
      }
    } catch (error) {
      console.error("Error:", error);
      // Display the error in the chatbot
      setMessages(prev => [...prev, { text: `An error occurred: ${error.message}`, sender: 'bot' }]);
    }
  
    setLoading(false);
    Keyboard.dismiss();
  };

  
  

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.chatContainer}>
        <ScrollView 
          ref={scrollViewRef} 
          contentContainerStyle={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            msg.image ? (
              <View key={index} style={[styles.messageBubble, styles.botBubble]}>
                <Image source={msg.image} style={styles.image} />
                <Text style={styles.botText}>{msg.caption}</Text>
              </View>
            ) : (
              <View key={index} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.botText]}>{msg.text}</Text>
              </View>
            )
          ))}
          {loading && <ActivityIndicator size="large" color="#6a11cb" style={{ marginTop: 10 }} />}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  chatContainer: { width: '85%', height: '70%', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, padding: 20, elevation: 10 },
  messagesContainer: { flexGrow: 1, justifyContent: 'flex-end' },
  messageBubble: { padding: 16, borderRadius: 25, marginBottom: 12, maxWidth: '75%' },
  userBubble: { backgroundColor: '#6a11cb', alignSelf: 'flex-end', borderTopRightRadius: 5 },
  botBubble: { backgroundColor: '#f1f1f1', alignSelf: 'flex-start', borderTopLeftRadius: 5 },
  messageText: { fontSize: 16 },
  userText: { color: '#fff' },
  botText: { color: '#333' },
  image: { width: 150, height: 150, borderRadius: 10, marginTop: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 30, backgroundColor: '#fff', padding: 10 },
  input: { flex: 1, backgroundColor: 'transparent', padding: 12, borderRadius: 30, fontSize: 16, color: '#333' },
  sendButton: { backgroundColor: '#6a11cb', padding: 14, borderRadius: 30, marginLeft: 10 },
  sendButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

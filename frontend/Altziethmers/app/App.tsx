
import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { requestPermissions, scheduleRepeatingNotification, setupNotificationListener } from "@/utils/notif";


export default function App() {
  useEffect(() => {
    async function setupNotifications() {
      if (Platform.OS !== "web") {
        await requestPermissions();
        await scheduleRepeatingNotification();
      }
    }

    setupNotifications();

    const subscription = setupNotificationListener();
    return () => subscription.remove(); // Cleanup
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Local Notifications Test</Text>
        <Button title="Trigger Notification" onPress={scheduleRepeatingNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
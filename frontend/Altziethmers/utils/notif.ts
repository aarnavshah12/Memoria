import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import { Platform } from "react-native";
import * as Device from "expo-device";

// Request permissions for notifications
export async function requestPermissions() {
  if (!Device.isDevice) return;
  
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    // if (newStatus !== "granted") {
    //   console.log("Notification permissions not granted");
    //   return;
    // }
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("alarm-channel", {
      name: "Alarm Channel",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default", 
      vibrationPattern: [500, 500, 500, 500],
      lightColor: "#FF231F7C",
    });
  }
}

// Function to play alarm sound
export async function playAlarm() {
  const sound = new Audio.Sound();
  try {
    await sound.loadAsync(require("../assets/sounds/loud_alarm_sound.mp3"));
    await sound.playAsync();
    setTimeout(async () => {
      await sound.stopAsync();
      await sound.unloadAsync();
    }, 2000); // Stop after 2 seconds
  } catch (error) {
    console.log("Error playing sound:", error);
  }
}

// Function to schedule repeating alarm
export async function scheduleRepeatingNotification() {
  const permissions = await Notifications.getPermissionsAsync();
  // if (!permissions.granted) {
  //   console.log("Notifications permission not granted");
  //   return;
  // }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Alarm! 🚨",
      body: "Time to wake up!",
      sound: "default",
    },
    trigger: {
      seconds: 10,
      repeats: true,
    },
  });
}

// Ensure notification listener is always set
export function setupNotificationListener() {
  return Notifications.addNotificationReceivedListener(() => {
    playAlarm();
  });
}

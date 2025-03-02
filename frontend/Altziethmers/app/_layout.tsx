// import { AccountProvider, useAccountContext } from '@/components/AccountContext';
// import { Stack } from 'expo-router';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// import { SafeAreaView, Text, View, Platform } from 'react-native';
// import * as Notifications from "expo-notifications";
// import { Button } from 'react-native-paper';
// import { useEffect } from 'react';

// export default function RootLayout() {
//   useEffect(() => {
//   console.log("useEffect is running");

//   async function setupNotifications() {
//     try {
//       if (Platform.OS !== "web") {
//         console.log("Requesting permissions...");

//         const { status } = await Notifications.requestPermissionsAsync();

//         console.log("Permission status:", status);

//         // if (status !== "granted") {
//         //   console.log("Notification permissions not granted");
//         //   return;
//         // }

//         console.log("Scheduling notification...");
//         await Notifications.cancelAllScheduledNotificationsAsync();

//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: "Reminder!",
//             body: "This is your periodic notification.",
//           },
//           trigger: {
//             seconds: 10,
//             repeats: true,
//           },
//         });

//         console.log("Notification scheduled!");
//       }
//     } catch (error) {
//       console.error("Error setting up notifications:", error);
//     }
//   }

//   setupNotifications();
// }, []);

//   return (
//     <AccountProvider>
//       <LayoutContent />
//     </AccountProvider>
//   );
// }


// function LayoutContent() {
//   const { user, logout } = useAccountContext();
//   return (
//       // <SafeAreaView>
//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#f4511e',
//           },
//           headerTintColor: '#fff',
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}>
//         {user? 
//         <Stack.Screen name="homepage" />: 
//         <><Stack.Screen name="signup" />
//         <Stack.Screen name="login" /></>
//         }
        
//       </Stack>
//       // </SafeAreaView>
//   );
// }

import { AccountProvider, useAccountContext } from '@/components/AccountContext';
import { Stack } from 'expo-router';
import { SafeAreaView, Text, View, Platform } from 'react-native';
import * as Notifications from "expo-notifications";
import { Button } from 'react-native-paper';
import * as Location from "expo-location";
import { useEffect, useState } from 'react';
import { getPlaceFromOSM, checkPlace, create_place } from '@/utils/geocode';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setupNotifications() {
  try {
    if (Platform.OS !== "web") {
      console.log("Checking notification permissions...");

      let { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          console.log("Notification permissions not granted");
          return;
        }
      }

      console.log("Canceling previous notifications...");
      await Notifications.cancelAllScheduledNotificationsAsync();

      console.log("Scheduling notification every 10 seconds...");
      
      // Instead of "seconds: 10", use interval-based workaround for Android
      setInterval(async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Reminder!",
            body: "This is your periodic notification.",
          },
          trigger: null, // Immediate notification
        });
        console.log("Notification sent!");
      }, 10000); // 10 seconds in milliseconds

      console.log(await Notifications.getAllScheduledNotificationsAsync());
    }
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
}

export default function RootLayout() {

  // Request location permission and get current position
  // useEffect(() => {
    
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMessage('Permission to access location was denied');
  //       return;
  //     }

  //     // Start watching the location when tracking is enabled
  //     if (isTracking) {
  //       const locationSubscription = await Location.watchPositionAsync(
  //         {
  //           accuracy: Location.Accuracy.High,
  //           timeInterval: 10000, // Get location updates every 10 seconds
  //           distanceInterval: 0, // Get location updates even if the user doesn't move
  //         },
  //         (newLocation) => {
  //           setLocation({
  //             lat: newLocation.coords.latitude,
  //             lon: newLocation.coords.longitude,
  //           });
  //         }
  //       );

  //       // Cleanup subscription when the component is unmounted or tracking is disabled
  //       return () => {
  //         locationSubscription.remove();
  //       };
  //     }
  //   })();
  // }, [isTracking]);

  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <AccountProvider>
      <LayoutContent />
    </AccountProvider>
  );
}

function LayoutContent() {
  const { user, logout } = useAccountContext();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  useEffect(() => {(async () => {
    // const { user, logout } = useAccountContext();
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Permission to access location was denied');
      return;
    }

    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      },
      (newLocation) => {
        // console.log("New location:", newLocation);
        setLocation({
          lat: newLocation.coords.latitude,
          lon: newLocation.coords.longitude,
        });
        getPlaceFromOSM(newLocation.coords.latitude, newLocation.coords.longitude).then(place => {
          console.log("new_Place:", place);
          if (place && user) {
            // console.log("Checking place...");
            // console.log("ADDRESS", place.address);
            checkPlace(user?.id, place.name, place.address).then(data => {
              // console.log('Check Place Response:', data);
              if (data == "Place does not exist") {
                // console.log("Creating place...");
                create_place(user.id, place.name, place.address).then(data => {
                  if (Platform.OS !== "web") {
                  Notifications.scheduleNotificationAsync({
                    content: {
                      title: "New Location Reminder!",
                      body: `Welcome to ${place.name}! Take some photos and create new memories.`,
                    },
                    trigger: null, // Immediate notification
                  });
                  // console.log(`Welcome to ${place.name}! Take some photos and create new memories.`);
                }
                });
              } 
              // else {
              //   console.log(`| ${data} |`);
              // }
            });
          } 
          // else { 
          //   console.log('USER', user); 
          // }
        });
      }
    );

    // Cleanup function
    return () => {
      locationSubscription.remove();
    };
  })();
}, []);
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {user ? (
        <Stack.Screen name="homepage" />
      ) : (
        <>
          <Stack.Screen name="signup" />
          <Stack.Screen name="login" />
        </>
      )}
    </Stack>
  );
}
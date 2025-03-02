// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Share,
//   Modal,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { Calendar } from "react-native-calendars";
// import { Ionicons } from "@expo/vector-icons";
// import { ImageBackground } from "react-native";
// import { getImages } from "@/utils/Image";
// import { useAccountContext } from "@/components/AccountContext";
// import { Redirect } from "expo-router";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import { getServerURL } from "@/utils/config";

// const backgroundImage = require("../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg");

// export default function DailyProgressTab() {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const { user } = useAccountContext();
//   const [images, setImages] = useState<any>(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedCaption, setSelectedCaption] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedImageId, setSelectedImageId] = useState<any>(null);

//   if (!user) {
//     return <Redirect href="/" />;
//   }

//   const shareDay = async (selectedImage: string, selectedCaption: string) => {
//     if (!selectedDate || !selectedImage || !selectedCaption) {
//       alert("No images to share for this date.");
//       return;
//     }
  
//     try {
//       // Save the image as a file
//       const fileUri = `${FileSystem.cacheDirectory}shared-image.png`;
//       await FileSystem.writeAsStringAsync(fileUri, selectedImage.split(",")[1], {
//         encoding: FileSystem.EncodingType.Base64,
//       });
  
//       // Share the image and caption together using Share.share
//       await Share.share({
//         title: "Shared Image with Caption", // Title for the shared content
//         message: `Caption: ${selectedCaption}`, // The message (caption)
//         url: fileUri, // The image file URI (make sure it’s a file URL)
//       });
  
//     } catch (error) {
//       console.log("Error sharing:", error);
//     }
//   };
  
//   const deleteImage = async (imageId: number) => {
//     if (!imageId) {
//       console.log('Hello', imageId)
//       alert("No image ID provided");
//       return;
//     }
  
//     try {
//       const serverURL = await getServerURL();
//       const response = await fetch(`${serverURL}/delete_image`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ image_id: imageId }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         alert("Image deleted successfully");
//       } else {
//         alert(data.error || "Failed to delete image");
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       alert("An error occurred while deleting the image");
//     }
//   };

  
  

//   return (
//     <ImageBackground source={backgroundImage} style={styles.background}>
//       <View style={styles.overlay}>
//         <Text style={styles.title}>Daily Progress</Text>
//         <View style={styles.calendarContainer}>
//           <Calendar
//             onDayPress={async (day) => {
//               setLoading(true);
//               setSelectedDate(day.dateString);
//               setSelectedImage(null);
//               setTimeout(async () => {
//                 const imagesResult = await getImages(user.id, day.dateString);

//                 if (!imagesResult || !imagesResult.images || imagesResult.images.length === 0) {
//                   setImages(null);
//                   setLoading(false);
//                   return;
//                 }

//                 const formattedImages: Record<string, { id: string; uri: string; caption: string, image_id: number }[]> = {};
//                 imagesResult.images.forEach((img: any, index: number) => {
//                   const dateKey = img.date || day.dateString;
//                   if (!formattedImages[dateKey]) {
//                     formattedImages[dateKey] = [];
//                   }
//                   formattedImages[dateKey].push({
//                     id: index.toString(),
//                     uri: `data:image/png;base64,${img.image}`,
//                     caption: img.caption,
//                     image_id: img.id
//                   });
//                 });
//                 setImages(formattedImages);
//                 setLoading(false);
//               }, 2000);
//             }}
//             markedDates={{
//               [selectedDate]: { selected: true, selectedColor: "#007BFF" },
//             }}
//             theme={{
//               todayTextColor: "#007BFF",
//               selectedDayBackgroundColor: "#007BFF",
//               arrowColor: "#007BFF",
//             }}
//           />
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
//         ) : (
//           <ScrollView contentContainerStyle={{ alignItems: "center" }}>
//             <View style={styles.imagesContainer}>
//               {selectedDate && images ? (
//                 <FlatList
//                   data={images[selectedDate]}
//                   keyExtractor={(item) => item.id}
//                   numColumns={1000}
//                   nestedScrollEnabled={true}
//                   renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.imageWrapper}
//                   onPress={() => {
//                     console.log("Selected Image ID:", item.id); // Debugging
//                     setSelectedImage(item.uri);
//                     setSelectedCaption(item.caption);
//                     setSelectedImageId(item.image_id);  // Store the image ID
//                     console.log('uhsd', selectedImageId)
//                     setModalVisible(true);
//                   }}
//                 >
//                   <Image source={{ uri: item.uri }} style={styles.image} />
//                 </TouchableOpacity>

//                   )}
//                 />
//               ) : (
//                 <Text style={styles.noImagesText}>
//                   {selectedDate ? "No images for this date" : "Select a date to view images"}
//                 </Text>
//               )}
//             </View>
//           </ScrollView>
//         )}
//       </View>

//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Image source={{ uri: selectedImage }} style={styles.modalImage} />
//             <Text style={styles.caption}>{selectedCaption}</Text>
//             <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.deleteButton} onPress={async() => {
//               console.log(selectedImageId)
//               await deleteImage(selectedImageId)}}>
//               <Ionicons name="trash" size={20} color="white" />
//               <Text style={styles.deleteButtonText}>Delete Image</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.shareButton} onPress={() => shareDay(selectedImage, selectedCaption)}>
//               <Ionicons name="share-social" size={20} color="white" />
//               <Text style={styles.shareButtonText}>Share Image</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteButton: {
//     flexDirection: "row",
//     backgroundColor: "red",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   deleteButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//     marginLeft: 8,
//   }, 
  
//   overlay: {
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     padding: 30,
//     borderRadius: 20,
//     width: "90%",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#333",
//     marginBottom: 15,
//   },
//   calendarContainer: {
//     backgroundColor: "white",
//     borderRadius: 15,
//     padding: 10,
//     width: "100%",
//   },
//   imagesContainer: {
//     flex: 1,
//     marginTop: 20,
//     alignItems: "center",
//     width: "100%",
//   },
//   imageWrapper: {
//     backgroundColor: "#D3D3D3",
//     borderRadius: 10,
//     padding: 5,
//     margin: 10,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     borderRadius: 10,
//   },
//   noImagesText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#666",
//     marginTop: 20,
//   },
//   shareButton: {
//     flexDirection: "row",
//     backgroundColor: "#007BFF",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   shareButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//     marginLeft: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.7)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   modalImage: {
//     width: 300,
//     height: 300,
//     borderRadius: 10,
//   },
//   caption: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   closeButton: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#007BFF",
//     borderRadius: 10,
//   },
//   closeButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { getImages } from "@/utils/Image";
import { useAccountContext } from "@/components/AccountContext";
import { Redirect } from "expo-router";
import * as FileSystem from "expo-file-system";
import { getServerURL } from "@/utils/config";

const backgroundImage = require("../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg");

export default function DailyProgressTab() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useAccountContext();
  const [images, setImages] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<any>(null);

  if (!user) {
    return <Redirect href="/" />;
  }

  const shareDay = async (selectedImage: string, selectedCaption: string) => {
    if (!selectedDate || !selectedImage || !selectedCaption) {
      alert("No images to share for this date.");
      return;
    }

    try {
      const fileUri = `${FileSystem.cacheDirectory}shared-image.png`;
      await FileSystem.writeAsStringAsync(fileUri, selectedImage.split(",")[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Share.share({
        title: "Shared Image with Caption",
        message: `Caption: ${selectedCaption}`,
        url: fileUri,
      });

    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const deleteImage = async (imageId: number) => {
    if (!imageId) {
      alert("No image ID provided");
      return;
    }

    try {
      const serverURL = await getServerURL();
      const response = await fetch(`${serverURL}/delete_image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_id: imageId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Image deleted successfully");
      } else {
        alert(data.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("An error occurred while deleting the image");
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Daily Progress</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={async (day) => {
              setLoading(true);
              setSelectedDate(day.dateString);
              setSelectedImage(null);
              setTimeout(async () => {
                const imagesResult = await getImages(user.id, day.dateString);

                if (!imagesResult || !imagesResult.images || imagesResult.images.length === 0) {
                  setImages(null);
                  setLoading(false);
                  return;
                }

                const formattedImages: Record<string, { id: string; uri: string; caption: string, image_id: number }[]> = {};
                imagesResult.images.forEach((img: any, index: number) => {
                  const dateKey = img.date || day.dateString;
                  if (!formattedImages[dateKey]) {
                    formattedImages[dateKey] = [];
                  }
                  formattedImages[dateKey].push({
                    id: index.toString(),
                    uri: `data:image/png;base64,${img.image}`,
                    caption: img.caption,
                    image_id: img.id
                  });
                });
                setImages(formattedImages);
                setLoading(false);
              }, 2000);
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#007BFF" },
            }}
            theme={{
              todayTextColor: "#007BFF",
              selectedDayBackgroundColor: "#007BFF",
              arrowColor: "#007BFF",
            }}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <View style={styles.imagesContainer}>
              {selectedDate && images ? (
                <ScrollView horizontal={true} contentContainerStyle={styles.horizontalScroll}>
                  {images[selectedDate].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.imageWrapper}
                      onPress={() => {
                        setSelectedImage(item.uri);
                        setSelectedCaption(item.caption);
                        setSelectedImageId(item.image_id);
                        setModalVisible(true);
                      }}
                    >
                      <Image source={{ uri: item.uri }} style={styles.image} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noImagesText}>
                  {selectedDate ? "No images for this date" : "Select a date to view images"}
                </Text>
              )}
            </View>
          </ScrollView>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <Text style={styles.caption}>{selectedCaption}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={async () => await deleteImage(selectedImageId)}>
              <Ionicons name="trash" size={20} color="white" />
              <Text style={styles.deleteButtonText}>Delete Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={() => shareDay(selectedImage, selectedCaption)}>
              <Ionicons name="share-social" size={20} color="white" />
              <Text style={styles.shareButtonText}>Share Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 30,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    width: "100%",
  },
  imagesContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  horizontalScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageWrapper: {
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    padding: 5,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  noImagesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  caption: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

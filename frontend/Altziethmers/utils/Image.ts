import { getServerURL } from './config';
import * as FileSystem from 'expo-file-system';
export const uploadImage = async (uri:any, id:Number) => {
    let fileUri = uri;

    if (uri.startsWith("data:image")) {
        const base64Code = uri.split("base64,")[1]; // Extract the base64 data
        const filePath = FileSystem.documentDirectory + "photo.jpg"; // Create a file path
        await FileSystem.writeAsStringAsync(filePath, base64Code, { encoding: FileSystem.EncodingType.Base64 });
        fileUri = filePath; // Use the newly created file's path
    }
    const localUri = fileUri;
    const filename = localUri.split('/').pop();
    let formData = new FormData();
    formData.append("account_id", id.toString());
    // console.log("URI:", fileUri, id);
    formData.append("image", {
      uri: fileUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    // console.log("Form Data:", formData);
    // console.log("IMAGE:", formData.get("image"));
    // console.log("ACCOUNT ID:", formData.get("account_id"));

    try {
      const serverURL = await getServerURL();
      let response = await fetch(`${serverURL}/make_image`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let jsonResponse = await response.json();
      if (!(response.ok)) {
        return jsonResponse.message
      }
    //   else {
    //     // setCaption("Error: " + jsonResponse.error);

    //   }
    } catch (error) {
      console.error("Upload error:", error);
      return error
    }
  };


  export const getImages = async (id:Number, date:string) => {
    try {
        const serverURL = await getServerURL();
        const response = await fetch(`${serverURL}/get_images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, date }),
            });
            
            const data = await response.json();
            // console.log("Get Images Response:", data);
            if (response.ok) {
                return data 
            }
            else {
                // console.error("Get Images failed:", data.message);
                return data.message
            }
    } catch (error) {
        // console.error("Get Images Error:", error);
    }
  };



  export const getImagesAll = async (id:Number) => {
    try {
        const serverURL = await getServerURL();
        const response = await fetch(`${serverURL}/get_images_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
            });
            
            const data = await response.json();
            // console.log("Get Images Response:", data);
            if (response.ok) {
                return data 
            }
            else {
                console.error("Get Images failed:", data.message);
                return data.message
            }
    } catch (error) {
        console.error("Get Images Error:", error);
    }
  };


// export const getSummary = async (imagesResult: any) => {
//   const captions = imagesResult.images.map(img => img.caption).join(" ");
          
//   const requestBody = {
//     contents: [{ role: "user", parts: [{ text: `Summarize these captions into an overview of my day: ${captions}` }] }]
//   };

//   const response = await fetch(`${API_URL}?key=${API_KEY}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(requestBody),
//   });

//   const data = await response.json();
//   if (!response.ok || !data) throw new Error(data.error?.message || "API request failed");

//   const summaryText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't summarize your day.";
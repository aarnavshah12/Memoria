import axios from 'axios';
import { getServerURL } from './config';

// Function to get place information from Nominatim API
export async function getPlaceFromOSM(lat: number, lon: number) {
  const proxyUrl = "https://corsproxy.io/?";
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  try {
    const response = await axios.get(proxyUrl + url);
    const place = response.data;

    // Check if place and address data are available
    if (place && place.address) {
        // console.log(place)
      return {
        name: place.address.road || 'Unnamed Place', // Address info like road, city, etc.
        address: `${place.address.city || 'Unknown city'}, ${place.address.country}`,
      };
    } else {
    //   console.error('No place found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching place:', error);
    return null;
  }
}

// Usage example: reverse geocode coordinates
// const test = async () => {getPlaceFromOSM(37.7749, -122.4194).then(place => {
//   if (place) {
//     console.log('Place name:', place.name);
//     console.log('Place address:', place.address);
//   }
// });
// }

export const checkPlace = async (account_id:Number, place_name:string, address: string) => {
    try {
      const serverURL = await getServerURL();
      const response = await fetch(`${serverURL}/check_place`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ account_id, place_name, address }),
            });
            
            const data = await response.json();
            // console.log("Get Images Response:", data);
            if (response.ok && data.message == "Place exists") {
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


  export const create_place = async (account_id:Number, place_name:string, address: string) => {
    try {
      const serverURL = await getServerURL();
      const response = await fetch(`${serverURL}/create_place`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ account_id, place_name, address }),
            });
            
            const data = await response.json();
            // console.log("Get create place response:", data);
            if (response.ok) {
                return data.message
            }
            else {
                // console.error("Get Images failed:", data.message);
                return data.message
            }
    } catch (error) {
        // console.error("Get Images Error:", error);
    }
  };

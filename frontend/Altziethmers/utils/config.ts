// import * as Network from "expo-network";
// import { Platform } from "react-native";

// export const getServerURL = async (port: number = 5001): Promise<string> => {
//     try {
//         let ip: string | null = null;

//         if (Platform.OS === "web") {
//             // Use the actual hostname for web or fallback to localhost
//             ip = window.location.hostname !== "localhost" ? window.location.hostname : "192.168.2.16";
//         } else {
//             // Get device's IP address on mobile
//             ip = await Network.getIpAddressAsync();
//         }

//         if (!ip) throw new Error("Failed to fetch IP address");

//         const url = `http://${ip}:${port}`;
//         console.log("Resolved Server URL:", url);
//         return url;
//     } catch (error) {
//         console.error("Error fetching server URL:", error);
//         return "";
//     }
// };

export const getServerURL = async (): Promise<string> => {
    const ip = "IP ADRESS";
    const port = 5001;
    return `http://${ip}:${port}`;
};
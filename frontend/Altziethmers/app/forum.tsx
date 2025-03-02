import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator, 
    ImageBackground, 
    StyleSheet,
    Dimensions
} from "react-native";
import axios from "axios";
import { useAccountContext } from '@/components/AccountContext';
import { getServerURL } from "@/utils/config";

const backgroundImage = require("../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg");

const { width, height } = Dimensions.get("window");

const Forum = () => {
    const { user } = useAccountContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [expandedPostId, setExpandedPostId] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const serverURL = await getServerURL();
            const response = await axios.get(`${serverURL}/get_posts`);
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) return;
        try {
            const serverURL = await getServerURL();
            await axios.post(`${serverURL}/create_post`, {
                account_id: user?.id,
                title: newPostTitle,
                content: newPostContent,
            });
            setNewPostTitle("");
            setNewPostContent("");
            fetchPosts();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Enter post title..."
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Write your post..."
                    value={newPostContent}
                    onChangeText={setNewPostContent}
                    multiline
                    style={styles.textarea}
                />
                <TouchableOpacity style={styles.button} onPress={createPost}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.postContainer}
                                onPress={() => setExpandedPostId(expandedPostId === item.id ? null : item.id)}
                            >
                                <Text style={styles.postTitle}>{item.title}</Text>
                                <Text style={styles.postDate}>Posted at: {item.date_created}</Text>
                                {expandedPostId === item.id && (
                                    <Text style={styles.postContent}>{item.content}</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: width,
        height: height,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    input: {
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        color: "#fff",
    },
    textarea: {
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        height: 100,
        color: "#fff",
    },
    button: {
        backgroundColor: "#ff7f50",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    postContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    postDate: {
        fontSize: 12,
        color: "gray",
    },
    postContent: {
        marginTop: 5,
        fontSize: 16,
        color: "#333",
    },
});

export default Forum;
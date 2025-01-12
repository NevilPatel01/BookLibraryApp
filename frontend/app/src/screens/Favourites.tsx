import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for icon usage

const FavouritesScreen = ({ navigation }) => {
    const [userId, setUserId] = useState();

    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        };
        fetchUserId();
    }, []);

    const [favouriteBooks, setFavouriteBooks] = useState([]);

    useEffect(() => {
        fetchFavouriteBooks();
    }, [userId]);

    const fetchFavouriteBooks = async () => {
        try {
            const response = await axios.get(`http://192.168.2.35:3001/favourites/${userId}`);
            setFavouriteBooks(response.data);
        } catch (error) {
            console.error("Error fetching favourite books", error);
        }
    };

    const removeFromFavourites = async (bookId) => {
        try {
            await axios.delete('http://192.168.2.35:3001/remove-from-favourites', {
                data: { userId, bookId }
            });
            fetchFavouriteBooks();
            Alert.alert('Success', 'Book removed from favourites');
        } catch (error) {
            console.error('Error removing from favourites:', error);
            Alert.alert('Error', 'Failed to remove the book.');
        }
    };

    const renderBook = ({ item }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id })} // Open BookDetail page on press
        >
            <Image source={{ uri: item.cover_image }} style={styles.bookImage} />
            <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeFromFavourites(item.id)} // Remove from favourites when button pressed
            >
                <Icon name="trash" size={25} color="#d9534f" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Favourites</Text>
            <FlatList
                data={favouriteBooks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBook}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', 
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ffffff',
    },
    cardContainer: {
        backgroundColor: '#1E1E1E', 
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.5,
        borderWidth: 1,
        borderColor: 'white',
    },
    bookImage: {
        width: 60,
        height: 90,
        marginRight: 15,
        borderRadius: 5,
    },
    bookDetails: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff', 
        marginBottom: 5,
    },
    bookAuthor: {
        fontSize: 14,
        color: 'gray',
    },
    deleteButton: {
        backgroundColor: '#1E1E1E',
        padding: 5,
        borderRadius: 5,
    },
    listContainer: {
        paddingBottom: 100,
    },
});

export default FavouritesScreen;

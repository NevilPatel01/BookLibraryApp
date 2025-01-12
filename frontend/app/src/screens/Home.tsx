import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const HomeScreen = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [userId, setUserId] = useState();
  const [favourites, setFavourites] = useState([]); // store list of favourites
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };

    fetchUserId();
    fetchPopularBooks();
    fetchFavourites();
  }, [userId]);

  const fetchPopularBooks = async () => {
    try {
      const response = await axios.get('http://192.168.2.35:3001/books/popular');
      setPopularBooks(response.data);
    } catch (error) {
      console.error('Error fetching popular books:', error);
    }
  };

  const fetchFavourites = async () => {
    try {
      const response = await axios.get(`http://192.168.2.35:3001/favourites/${userId}`);
      setFavourites(response.data);  // set favourite books in state
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const addToFavorites = async (bookId) => {
    try {
      const response = await axios.post('http://192.168.2.35:3001/add-to-favourites', {
        userId,
        bookId,
      });
      if (response.status === 200) {
        fetchFavourites(); // update the list after adding to favourites
        alert('Book added to favourites');
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  const removeFromFavourites = async (bookId) => {
    try {
      const response = await axios.delete('http://192.168.2.35:3001/remove-from-favourites', {
        data: { userId, bookId }
      });
      if (response.status === 200) {
        fetchFavourites(); // update the list after removing from favourites
        alert('Book removed from favourites');
      }
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };

  const renderBook = ({ item }) => {
    const isFavourite = favourites.some((book) => book.id === item.id);
  
    return (
      <Animatable.View style={styles.bookCard} animation="fadeInUp" duration={500}>
        <TouchableOpacity
          onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
          style={styles.bookContent}
        >
          <Image source={{ uri: item.cover_image }} style={styles.bookImage} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>By: {item.author}</Text>
            <View style={styles.heartContainer}>
              <TouchableOpacity
                onPress={() => isFavourite ? removeFromFavourites(item.id) : addToFavorites(item.id)}
                style={styles.favouriteButton}
              >
              <Icon 
                  name={isFavourite ? 'heart' : 'heart-o'} 
                  size={30} 
                  color={isFavourite ? '#d9534f' : 'lightgrey'} 
              />
              </TouchableOpacity>
            </View>
            <Text style={styles.bookGenre}>{item.genre}</Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => navigation.navigate('UserDetail')}
        >
          <Icon name="user" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rightButton}
          onPress={() => navigation.navigate('Favourites')}
        >
          <Icon name="star" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Popular Books</Text>
      <FlatList
        data={popularBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.verticalList}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  leftButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 50,
  },
  rightButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 50,
  },
  verticalList: {
    paddingBottom: 60,
  },
  row: {
    justifyContent: 'space-between',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  logoutButtonTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  bookCard: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
  },
  bookImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookDetails: {
    alignItems: 'flex-start',
  },
  bookTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  heartContainer: {
    alignItems: 'center',
    marginVertical: 10, // add space between author name and heart icon
  },
  favouriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookGenre: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default HomeScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';


const BookDetailScreen = ({ route }) => {
  const { bookId } = route.params;
  const [bookDetails, setBookDetails] = useState(null);
  const [learning, setLearning] = useState('');
  const [editingLearning, setEditingLearning] = useState(null);
  const [userId, setUserId] = useState(1);
  const [learningsList, setLearningsList] = useState([]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.2.35:3001/books/${bookId}`);
        setBookDetails(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    const fetchLearnings = async () => {
      try {
        const response = await axios.get('http://192.168.2.35:3001/learnings', {
          params: { userId, bookId },
        });
        setLearningsList(response.data);
      } catch (error) {
        console.error('Error fetching learnings:', error);
      }
    };

    fetchBookDetails();
    fetchLearnings();
  }, [bookId, userId]);

  const saveLearning = async () => {
    if (!learning) {
      Alert.alert('Please write something about the book!');
      return;
    }
  
    try {
      const endpoint = editingLearning
        ? 'http://192.168.2.35:3001/update-learning'
        : 'http://192.168.2.35:3001/save-learnings';
  
      const method = editingLearning ? 'put' : 'post';
      const response = await axios[method](endpoint, {
        id: editingLearning ? editingLearning.id : null,
        userId,
        bookId,
        learning,
      });
  
      if (response.status === 200) {
        Alert.alert(editingLearning ? 'Learning updated successfully!' : 'Learning saved successfully!');
        setLearning('');
        setEditingLearning(null);
        setLearningsList((prev) => {
          if (editingLearning) {
            return prev.map((item) => (item.id === editingLearning.id ? response.data : item));
          } else {
            return [...prev, response.data];
          }
        });
      } else {
        Alert.alert('Error', 'Could not save your learning.');
      }
    } catch (error) {
      console.error('Error saving learning:', error);
      Alert.alert('Error', 'Could not save your learning.');
    }
  };
  

  const editLearning = (item) => {
    setEditingLearning(item);
    setLearning(item.learning);
  };

  const renderLearning = ({ item }) => (
    <View style={styles.learningCard}>
      <Text style={styles.learningText}>{item.learning}</Text>
      <TouchableOpacity onPress={() => editLearning(item)} style={styles.iconButton}>
        <Icon name="edit" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {bookDetails ? (
        <>
          <Image source={{ uri: bookDetails.cover_image }} style={styles.bookImage} />
          <Text style={styles.bookTitle}>{bookDetails.title}</Text>
          <Text style={styles.bookAuthor}>By: {bookDetails.author}</Text>
          <Text style={styles.bookSummary}>{bookDetails.summary}</Text>

          <TextInput
            style={styles.learningInput}
            placeholder="Write what you've learned"
            value={learning}
            placeholderTextColor="#ffffff"
            onChangeText={setLearning}
            multiline
          />

          <TouchableOpacity onPress={saveLearning} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              {editingLearning ? 'Update Learning' : 'Save Learning'}
            </Text>
          </TouchableOpacity>

          {learningsList && (
            <FlatList
                data={learningsList}
                renderItem={renderLearning}
                keyExtractor={(item) => item.id.toString()}
                style={styles.learningList}
            />
        )}

        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  bookImage: {
    width: '100%',
    height: 550,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#ff0000', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,       
  },
  bookTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookAuthor: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 10,
  },
  bookSummary: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  learningInput: {
    backgroundColor: '#333',
    color: '#fff',              
    fontSize: 18,                
    padding: 12,           
    borderRadius: 8,         
    marginBottom: 20,
    textAlignVertical: 'top',   
    height: 150,    
    minHeight: 150,
  },
  saveButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 5,
    transform: [{ scale: 1.05 }], // Add slight animation on hover (scale effect)
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  learningItem: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  learningText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    width: 80,
    height: '85%',
    marginVertical: 5,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  learningCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  learningList: {
    marginTop: 20,
    marginBottom: 50,
  },
});

export default BookDetailScreen;

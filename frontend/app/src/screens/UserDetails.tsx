import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // Ensure axios is installed
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDetailScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    userId: '',
  });
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    const getUserIdFromAsyncStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          fetchUserData(userId);
        }
      } catch (error) {
        console.error('Error fetching user_id from AsyncStorage:', error);
      }
    };
    getUserIdFromAsyncStorage();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://192.168.2.35:3001/user/${userId}`);
      console.log('User data:', response.data);  // Log to inspect the response
      setUser({ ...response.data, userId });
      setEditedName(response.data.username);
      setEditedEmail(response.data.email);    // Similarly, ensure email is set safely
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user details');
      console.error('API Error:', error);  // Log error if the API fails
    }
  };
  
  const handleSave = async () => {
    // Only proceed if there are changes
    if (editedName === user.username && editedEmail === user.email) {
      Alert.alert('No Changes', 'You did not make any changes');
      return;
    }
  
    try {
      const response = await axios.put(`http://192.168.2.35:3001/user/${user.userId}`, {
        username: editedName,
        email: editedEmail,
      });
      console.log('response', response);
      setUser((prevState) => ({ ...prevState, username: editedName, email: editedEmail }));
      setIsEditing(false);
      Alert.alert('Success', 'Your details have been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user details');
      console.error('API Error:', error);
    }
  };
  

  const handleLogout = () => {
    AsyncStorage.removeItem('user_id'); // Clear user_id from AsyncStorage
    Alert.alert('Logged Out', 'You have been logged out successfully!');
    navigation.navigate('Login');
  };

const handleDeleteUser = () => {
  Alert.alert(
    'Delete User',
    'Are you sure you want to delete your account?',
    [
      { text: 'Cancel' },
      { 
        text: 'Delete', 
        onPress: async () => {
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
              const response = await axios.delete(`http://192.168.2.35:3001/user/${userId}`);
              console.log(response.data); 
              Alert.alert('Deleted', 'Your account has been deleted successfully');
              AsyncStorage.removeItem('userId');  // Clear user_id from AsyncStorage
              navigation.navigate('Login');  // Redirect to login screen
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to delete account');
            console.error('API Error:', error); // Log error if the API call fails
          }
        }
      }
    ]
  );
};

  const handleCancel = () => {
    setEditedName(user.username);
    setEditedEmail(user.email);
    setIsEditing(false);
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImage}>
          <Text style={styles.initials}>{user.username ? user.username[0].toUpperCase() : 'U'}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.label}>Username</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={editedName}
              onChangeText={setEditedName}
            />
          ) : (
            <Text style={styles.text}>{user.username}</Text>
          )}
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={editedEmail}
              onChangeText={setEditedEmail}
            />
          ) : (
            <Text style={styles.text}>{user.email}</Text>
          )}
        </View>
      </View>
  
      {isEditing ? (
        <View style={styles.editingButtons}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
          <Icon name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      )}
  
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteUser} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    backgroundColor: '#3b3b3b',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  initials: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  userDetails: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    color: '#aaaaaa',
    fontSize: 14,
    marginBottom: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 15,
  },
  textInput: {
    color: '#ffffff',
    backgroundColor: '#333333',
    padding: 10,
    fontSize: 18,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444444',
    width: '80%',
  },
  editButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomButtons: {
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 200,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  editingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },  
});

export default UserDetailScreen;

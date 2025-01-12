import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Regular expression for validating an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!username || !email || !password || !confirmPassword) {
      return Alert.alert("Error", "All fields are required.");
    }
  
    if (!emailRegex.test(email)) {
      return Alert.alert("Error", "Please enter a valid email address.");
    }
  
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }
  
    try {
      const response = await fetch('http://192.168.2.35:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        navigation.replace('Login');
      } else {
        let errorMessage = "Something went wrong.";
        if (data.error) {
          errorMessage = data.error;
        }
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      Alert.alert("Error", `Network error: ${error.message}`);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false} 
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} color="#1E88E5" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} >
             <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212', // Dark theme background
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 30, // Adding space between the header and inputs
  },
  input: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFF',
    backgroundColor: '#333', // Dark background for input fields
  },
  buttonContainer: {
    marginTop: 20, // Space between the button and the last input
    borderRadius: 8,
    overflow: 'hidden',
  },
  link: {
    color: '#1E88E5',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;

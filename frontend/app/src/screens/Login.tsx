import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return Alert.alert("Please fill in all fields");
    }

    try {
      const response = await fetch('http://192.168.2.35:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('userId', data.userId.toString());
        Alert.alert("Success", "Login successful!");
        navigation.replace('Home');
      } else {
        Alert.alert("Error", data.error || "Unknown error occurred");
      }
    } catch (error) {
      Alert.alert("Error", `Something went wrong: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        placeholderTextColor="#888"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity onPress={handleLogin} style={styles.LoginButton}>
        <Text style={styles.linkLogin}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} >
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
    marginTop: -140,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 30,
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
    backgroundColor: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  LoginButton: {
    backgroundColor: '#1E88E5',
    marginHorizontal: 20,
    height: 50,
    textAlign: 'center',
    borderRadius: 10,
  },
  link: {
    color: '#1E88E5',
    textAlign: 'center',
    marginTop: 20,
  },
  linkLogin: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
  },
});

export default LoginScreen;

import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import HomeScreen from './src/screens/Home';
import Favourites from './src/screens/Favourites';
import BookDetailScreen from './src/screens/BookDetail';
import UserDetailScreen from './src/screens/UserDetails';


const Stack = createStackNavigator();


export default function Index() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Favourites" component={Favourites} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="UserDetail" component={UserDetailScreen} />
          </>
      </Stack.Navigator>
      </NavigationContainer>

    </NavigationIndependentTree>
  );
};


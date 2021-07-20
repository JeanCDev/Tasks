import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';

export default class AuthOrApp extends React.Component {
  componentDidMount = async () => {
    const userDataJson = await AsyncStorage.getItem('user');
    const userData = JSON.parse(userDataJson) || null;

    if (userData && userData.token) {
      axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`;
      this.props.navigation.navigate('Home', userData);
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#000"
  }
});
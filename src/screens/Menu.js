import React from 'react';
import { Platform, ScrollView, View, Text, StyleSheet, TouchableOpacity, Touchable } from 'react-native';
import  { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Gravatar } from 'react-native-gravatar';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../commonStyles';

export default function Menu(props) {

  const logOut = () => {
    delete axios.defaults.headers.common['Authorization'];

    AsyncStorage.removeItem('user');
    
    props.navigation.navigate("AuthOrApp");
  }

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Gravatar style={styles.avatar} options={{
          email: props.navigation.getParam('email'),
          secure: true
        }}/>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{props.navigation.getParam('name')}</Text>
          <Text style={styles.email}>{props.navigation.getParam('email')}</Text>
        </View>

        <TouchableOpacity onPress={logOut}>
          <View style={styles.logOut}>
            <Icon name="sign-out" size={30} color="#800" />
          </View>
        </TouchableOpacity>
      </View>
      <DrawerNavigatorItems {...props} />
    </ScrollView>
  )

}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  title: {
    color: "#000",
    fontFamily: commonStyles.fontFamily,
    fontSize: 30,
    paddingTop: Platform.OS === 'ios' ? 70 : 30,
    padding: 10
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderRadius: 35,
    margin: 10
  },
  userInfo: {
    marginLeft: 10
  },
  name: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginBottom: 5,
    color: commonStyles.colors.mainText
  },
  email: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    marginBottom: 10,
    color: commonStyles.colors.subText
  },
  logOut: {
    marginLeft: 10,
    marginBottom: 10
  }
});
import React from "react";
import { ImageBackground, Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import Login from "../../assets/imgs/login.jpg";
import commonStyles from '../commonStyles';
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';

import AuthInput from '../components/AuthInput';
import { server, showError, showSuccess } from '../common';

const initialState = {
  email: 'jeangames15@gamil.com',
  password: '123456',
  name: '',
  confirmPassword: '',
  stageNew: false
}

export default class Auth extends React.Component {
  state = {
    ...initialState
  }

  signInOrSignUp = () => {
    if (this.state.stageNew) {
      this.signUp()
    } else {
      this.signIn();
    }
  }

  signUp = async () => {

    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      });

      showSuccess("Usuário cadastrado");

      this.setState({...initialState });
    } catch (err) {
      showError(err);
    }

  }

  signIn = async () => {
    try {

      const response = await axios.post(`${server}/signin`, {
        email: this.state.email,
        password: this.state.password
      });

      axios.defaults.headers.common['Authorization'] = `bearer ${response.data.token}`;

      await AsyncStorage.setItem("user", JSON.stringify(response.data));

      this.props.navigation.navigate('Home', response.data);
    } catch (err) {
      showError(err);
    }
  }

  render() {

    const validations = [];
    validations.push(this.state.email && this.state.email.includes('@'));
    validations.push(this.state.password && this.state.password.length >= 6);

    if (this.state.stageNew) {
      validations.push(this.state.name && this.state.name.trim().length >= 3);
      validations.push(this.state.password === this.state.confirmPassword);
    }

    const validForm = validations.reduce((total, actual) => total && actual);

    return (
      <ImageBackground source={Login} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.formContainer}>

          <Text style={styles.subTitle}>
            {this.state.stageNew ? "Crie sua conta" : "Informe seus dados"}
          </Text>

          {
            this.state.stageNew &&
            <AuthInput
              placeholder="Nome"
              icon="user"
              value={this.state.name}
              style={styles.input}
              onChangeText={name => this.setState({name})}
            />
          }

          <AuthInput
            icon="at"
            placeholder="Email"
            value={this.state.email}
            style={styles.input}
            onChangeText={email => this.setState({email})}
          />
          <AuthInput
            icon="lock"
            placeholder="Senha"
            value={this.state.password}
            style={styles.input}
            onChangeText={password => this.setState({password})}
            secureTextEntry
          />

          {
            this.state.stageNew &&
            <AuthInput
              icon="lock"
              placeholder="Confirmar senha"
              value={this.state.confirmPassword}
              style={styles.input}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
              secureTextEntry
            />
          }

          <TouchableOpacity onPress={this.signInOrSignUp} disabled={!validForm}>
            <View style={[styles.button, validForm ? {} : {backgroundColor: "#aaa"}]}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Registrar' : "Entrar"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ padding: 10 }} onPress={
          () => this.setState({ stageNew: !this.state.stageNew})
        }>
          <Text style={[styles.buttonText, {textDecorationLine: 'underline'}]}>
            {this.state.stageNew ? 'Já possui conta? ' : "Ainda não possui conta?"}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#000"
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 70,
    marginBottom: 10
  },
  subTitle: {
    fontFamily: commonStyles.fontFamily,
    color: "#fff",
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  formContainer: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    width: '90%'
  },
  input: {
    marginTop: 10,
    backgroundColor: "#fff"
  },
  button: {
    backgroundColor: "#080",
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 50
  },
  buttonText: {
    color: "#fff",
    fontFamily: commonStyles.fontFamily,
    fontSize: 20
  }
});
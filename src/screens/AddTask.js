import React from 'react';
import {View, Modal, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Platform} from 'react-native';
import moment from 'moment';

import commonStyles from '../commonStyles';
import DateTimePicker from "@react-native-community/datetimepicker";

const initialState = {
  desc: "",
  date: new Date(),
  showDatePicker: false
}

export default class AddTask extends React.Component {
  state = {...initialState};

  getDatePicker = () => {
    let datePicker = <DateTimePicker
              value={this.state.date}
              onChange={(_, date)=> this.setState({date: date || new Date(), showDatePicker: false})}
              mode="date"
            />

    const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY');

    if (Platform.OS === "android") {
      datePicker = (
        <View>
          <TouchableOpacity onPress={() => this.setState({showDatePicker: true})}>
            <Text style={styles.date}>{dateString}</Text>
          </TouchableOpacity>
          {this.state.showDatePicker && datePicker}
        </View>
      );
    }

    return datePicker;
  }

  save = () => {
    const newTask = {
      date: this.state.date,
      desc: this.state.desc
    }

    if (this.props.onSave) {
      this.props.onSave(newTask);
      this.setState({...initialState});
    }
  }

  render() {
    return (
      <Modal transparent visible={this.props.isVisible} onRequestClose={this.props.onCancel} animationType="slide">
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>

        <View style={styles.container}>
          <Text style={styles.header}>Nova tarefa</Text>

          <TextInput style={styles.input} placeholder="Digite a tarefa" value={this.state.desc} onChangeText={desc => this.setState({desc})}/>
          {this.getDatePicker()}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles} onPress={this.props.onCancel}>
              <Text style={styles.button}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles} onPress={this.save}>
              <Text style={styles.button}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  container: {
    backgroundColor: "#fff"
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secondary,
    textAlign: "center",
    padding: 15,
    fontSize: 18
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.today,
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    height: 40,
    margin: 15,
    backgroundColor: commonStyles.colors.secondary,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 6
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginLeft: 15
  }
});
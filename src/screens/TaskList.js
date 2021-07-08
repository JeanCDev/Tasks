import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import commonStyles from '../commonStyles';
import TodayImg from '../../assets/imgs/today.jpg';
import Task from '../components/Task';
import AddTask from './AddTask';

const initialState = {
  showDoneTasks: false,
  showModal: false,
  visibleTasks: [],
  tasks: []
}
export default class TaskList extends Component {

  state = {
    ...initialState
  }

  toggleTask = (id) => {
    const tasks = [...this.state.tasks];

    tasks.forEach(task => {
      if (task.id === id) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });

    this.setState({tasks}, this.filterTasks);
  }

  toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
  }

  filterTasks = () => {
    let visibleTasks = null;

    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending = task => task.doneAt === null;

      visibleTasks = this.state.tasks.filter(pending);
    }

    this.setState({ visibleTasks });

    AsyncStorage.setItem('state', JSON.stringify(this.state));
  }

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('state');
    const state = JSON.parse(stateString) || initialState;

    this.setState(state, this.filterTasks);
  }

  openModal = () => {
    this.setState({showModal: true});
  }

  addTask = (newTask) => {

    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert("Dados inválidos", "Descrição não informada");
      return
    }

    const tasks = [...this.state.tasks];

    tasks.push({
      id: Math.random(), desc: newTask.desc, estimatedAt: newTask.date, doneAt: null
    });

    this.setState({tasks, showModal: false}, this.filterTasks);
  }

  deleteTask = (id) => {
    const tasks = this.state.tasks.filter(task => task.id !== id);

    this.setState({tasks}, this.filterTasks);
  }

  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM');

    return (
      <View style={styles.container}>
        <AddTask isVisible={this.state.showModal} onCancel={() => this.setState({showModal: false})} onSave={this.addTask}/>

        <ImageBackground source={TodayImg} style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon name={this.state.showDoneTasks ? "eye" : 'eye-slash'} size={25} color={commonStyles.colors.secondary}/>
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subTitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList
            data={this.state.visibleTasks}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => <Task {...item} onDelete={this.deleteTask} onToggleTask={this.toggleTask}/>}/>
        </View>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={this.openModal}>
          <Icon name="plus" size={20} color={commonStyles.colors.secondary}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 3
  },
  taskList: {
    flex: 7
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20
  },
  subTitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 40 : 10
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: commonStyles.colors.today,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
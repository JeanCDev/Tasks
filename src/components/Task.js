import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import commonStyles from '../commonStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';

export default function Task(props) {
  function getCheckView(doneAt) {
    if (doneAt != null) {
      return (
        <View style={styles.done}>
          <Icon name="check" size={20} color={commonStyles.colors.secondary}/>
        </View>
      );
    }

    return (
      <View style={styles.pending}/>
    );
  }

  const doneOrNotStyle = props.doneAt != null ? {textDecorationLine: 'line-through'} : {}
  const date = moment(props.doneAt ? props.doneAt : props.estimateAt).locale('pt-br').format('ddd, D [de] MMMM');

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => props.toggleTask(props.id)}>
        <View style={styles.checkContainer}>
          {getCheckView(props.doneAt)}
        </View>
      </TouchableWithoutFeedback>
      <View>
        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
        <Text style={[styles.date, doneOrNotStyle]}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: "#aaa",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingVertical: 10
  },
  checkContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pending: {
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 25
  },
  done: {
    height: 25,
    width: 25,
    backgroundColor: '#4d7031',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  desc: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 15
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 12
  }
});
import React from 'react';
import {View, Text} from 'react-native';

export default function Task(props) {
  return (
    <View>
      <Text>{props.desc}</Text>
      <Text>{String(props.estimateAt)}</Text>
      <Text>{String(props.doneAt)}</Text>
    </View>
  );
}
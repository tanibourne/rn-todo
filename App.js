import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import { theme } from './color';

const STORAGE_KEY="@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    const s =JSON.stringify(toSave)
    await AsyncStorage.setItem(STORAGE_KEY ,s)

  }
  const loadToDos = async() => {
   const s = await AsyncStorage.getItem(STORAGE_KEY)
   console.log(s);
   s !== null ? setToDos(JSON.parse(s)) : null;
  };
  useEffect(() => {
    loadToDos();
  }, [])
  const addToDo = async () => {
    if(text === ""){
      return
    }
    const newToDos = Object.assign({}, toDos,{
      [Date.now()]: {text, working }, 
    });
    setToDos(newToDos);
    await saveToDos(newToDos)
    setText("")
  };



  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
        <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>  
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
        <Text style={{...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
        returnKeyType='done'
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        value={text} 
        style= {styles.input} 
        placeholder={working ? "Add a To Do list": "where do you wanna go?"}></TextInput>
      </View>
      <ScrollView>{
        Object.keys(toDos).map(key =>  (
          toDos[key].working  === working ? (
        <View style={styles.toDo} key={key}>
          <Text style={styles.toDoText}>{toDos[key].text}</Text>
        </View> ): null
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText:{
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    marginBottom:10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor:theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,

  },
  toDoText: {
    color: "white",
    fontSize:16,
    fontWeight: "500",
  }
});

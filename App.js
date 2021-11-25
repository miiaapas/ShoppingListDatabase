import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('product.db');

export default function App() {
  const [food, setFood] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists product (id integer primary key not null, amount text, food text);');
    });
    updateList();    
  }, []);

  
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into product (amount, food) values (?, ?);', [amount, food]);    
      }, null, updateList
    )
  }

  
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) =>
        setProducts(rows._array)
      ); 
    });
  }

  
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from product where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => setFood(text)}
        value={food}/>  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => setAmount(text)}
        value={amount}/>      
      <Button onPress={saveItem} title="Add" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.food}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Bought</Text></View>} 
        data={products} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});
import { View, Text, FlatList, Image, ScrollView, SafeAreaView, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
export default function Home() {
    const [db, setdb] = useState(SQLite.openDatabase('rimsha.db'))

    const [importedData, setImportedData] = useState([]);
    const [data, setdata] = useState()
    const info = async () => {
        try {
            fetch('https://dummyjson.com/products/1')
                .then(res => res.json())
                .then(json => setdata(json))
            storeDataInDatabase(res)
            console.log(data, "dataaa");

        } catch (error) {
            console.error(error, "errorrrrrrrrr");
        }
    };

    const storeDataInDatabase = (dataToStore) => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, category TEXT, price REAL, title TEXT)'
            );
            tx.executeSql(
                'INSERT INTO products (brand, category, price, title) VALUES (?, ?, ?, ?)',
                [dataToStore.brand, dataToStore.category, dataToStore.price, dataToStore.title],
                (_, result) => {
                    console.log('Data inserted into the database', result);
                },
                (_, error) => {
                    // Handle error
                    console.error('Insert error', error);
                }
            );
        });
    }
    const importDb = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
            const uri = result.assets[0].uri;;

            console.log(uri, "resulttt");
            const copyUri = `${FileSystem.documentDirectory}rimsha.db`;
            await FileSystem.copyAsync({ from: uri, to: copyUri });

            const importedDb = SQLite.openDatabase('rimsha.db');

            importedDb.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM products',
                    [],
                    (_, resultSet) => {
                        const importedDataArray = [];
                        for (let i = 0; i < resultSet.rows.length; i++) {
                            const row = resultSet.rows.item(i);
                            importedDataArray.push(row);
                        }
                        setImportedData(importedDataArray);
                    },
                    (_, error) => {
                        console.error('Select error', error);
                    }
                );
            });

            console.log('Database imported successfully');
            //   }
            //   console.log("is thereee dataaaa");
        } catch (error) {
            console.error(error, "errorrr");
        }
    };
    const exportDb = async () => {
        await Sharing.shareAsync(FileSystem.documentDirectory + 'rimsha.db')
    }

    const renderItem = ({ item }) => {
        return (
            <Image source={{ uri: item }}
                style={{
                    width: 150,
                    height: 150,
                    borderWidth: 2,
                    borderColor: 'grey',
                    margin: 8
                }} />
        )
    }

    useEffect(() => {
        info();
    }, []);

    return (
        <SafeAreaView style={{ marginTop: 70 }}>
            {/* <Text style={{ fontSize: 20 }}>Export API data to the db</Text>
            <Button title='export db' onPress={exportDb} />
            <Text style={{ fontSize: 20,marginTop:40 }}>Import API data from the db</Text>
            <Button title='import db' onPress={importDb} /> */}
            {
                importedData.length > 0 ? (
                    <View >

                        <Text style={{ fontSize: 20 }}>{data?.brand}</Text>
                        <Text style={{ fontSize: 20 }}>{data?.category}</Text>
                        <Text style={{ fontSize: 20 }}>{data?.price}</Text>
                        <Text style={{ fontSize: 20 }}>{data?.title}</Text>
                        {data ?
                            <FlatList
                                data={data.images}
                                renderItem={renderItem}
                            /> :
                            null
                        }
                    </View>
                ) :
                
                <View>
                <Text style={{ fontSize: 20 }}>Export API data to the db</Text>
                <Button title='export db' onPress={exportDb} />
                <Text style={{ fontSize: 20,marginTop:40 }}>Import API data from the db</Text>
                <Button title='import db' onPress={importDb} />
                </View>
            }
        </SafeAreaView>
    )
}
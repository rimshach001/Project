import { View, Text, FlatList, Image, ScrollView, SafeAreaView, Button, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
export default function Home() {
    const [db, setdb] = useState(SQLite.openDatabase('rimsha.db'))
    const [Tempval, setTempVal] = useState("")
    const [importedData, setImportedData] = useState([]);
    const [importedDataProduct, setImportedDataProduct] = useState([]);
    const [data, setdata] = useState()
    const info = async () => {
        try {
            fetch('https://dummyjson.com/products/1')
                .then(res => res.json())
                .then(json => setdata(json))
            StoreApiData(data)
            console.log(data, "dataaa");

        } catch (error) {
            console.error(error, "errorr");
        }
    };

    const StoreApiData = (dataToStore) => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMshaARY KEY AUTOINCREMENT, brand TEXT, category TEXT, price REAL, title TEXT)`
            );
            tx.executeSql(
                'INSERT INTO products (brand, category, price, title) VALUES (?, ?, ?, ?)',
                [dataToStore.brand, dataToStore.category, dataToStore.price, dataToStore.title],
                (_, result) => {
                    console.log('Data inserted into the database product table', result);
                },
                (_, error) => {
                    console.error('Insert error', error);
                }
            );

        });
    }
    const storeNameData = (dataToStore) => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMshaARY KEY AUTOINCREMENT, name TEXT)`
            );
            tx.executeSql(
                `INSERT INTO names (name) VALUES (?)`,
                [dataToStore],
                (_, result) => {
                    console.log('Data inserted into the database table name', dataToStore);
                },
                (_, error) => {
                    // Handle error
                    console.error('Insert error', error);
                }
            );
        });
    }
    const clearTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM names',
                [],
                (_, result) => {
                    console.log('Table names data cleared successfully.');
                },
                (_, error) => {
                    console.error('Error clearing table data:', error);
                }
            );
            tx.executeSql(
                'DELETE FROM products',
                [],
                (_, result) => {
                    console.log('Table products data cleared successfully.');
                },
                (_, error) => {
                    console.error('Error clearing table data:', error);
                }
            );
        });
    };
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
                        setImportedDataProduct(importedDataArray);
                        console.log(importedDataArray, "this is name table data");
                    },
                    (_, error) => {
                        console.error('Select error', error);
                    }
                );
                tx.executeSql(
                    'SELECT * FROM names',
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

            console.log('Database imported successfully', importedData);
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
    const handlePress = () => {
        if (Tempval.trim() !== "") { // Check if the input is not empty
            storeNameData(Tempval);
        }
    }
    useEffect(() => {
        info();
    }, [data]);

    return (
        <SafeAreaView style={{ marginTop: 140 }}>
            {/* <Text style={{ fontSize: 20 }}>Export API data to the db</Text>
            <Button title='export db' onPress={exportDb} />
            <Text style={{ fontSize: 20,marginTop:40 }}>Import API data from the db</Text>
            <Button title='import db' onPress={importDb} /> */}
            <View>
                <Button title='clear db table' onPress={clearTable} />
                <Text style={{ fontSize: 20 }}>Export API data to the db</Text>
                <Button title='export db' onPress={exportDb} />
                <Text style={{ fontSize: 20, marginTop: 40 }}>Import API data from the db</Text>
                <Button title='import db' onPress={importDb} />
                <View >
                    <TextInput
                        style={styles.input}
                        onChangeText={setTempVal}
                        value={Tempval}
                        placeholder="enter name"
                    />
                    <Button title='press' onPress={handlePress} />
                </View>
            </View>
            {
                (importedData.length > 0 || importedDataProduct.length > 0) ? (
                    <ScrollView>
                        {importedData.map((item) => (
                            <Text key={item.id} style={{ fontSize: 20 }}>
                                {item.name}
                            </Text>
                        ))}
                        {/* <Text style={{backgroundColor:'red'}}>{importedData?.name}</Text> */}
                        <Text style={{ fontSize: 20 }}>{importedDataProduct?.brand}</Text>
                        <Text style={{ fontSize: 20 }}>{importedDataProduct?.category}</Text>
                        <Text style={{ fontSize: 20 }}>{importedDataProduct?.price}</Text>
                        <Text style={{ fontSize: 20 }}>{importedDataProduct?.title}</Text>
                        {data ?
                            <FlatList
                                data={data.images}
                                renderItem={renderItem}
                            /> :
                            null
                        }
                    </ScrollView>
                ) :

                    null
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});
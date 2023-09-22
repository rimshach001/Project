import { View, Text, FlatList, Image, ScrollView, SafeAreaView, Button, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { StyleSheet } from 'react-native'
export default function databaseSqlite() {
    const [db, setdb] = useState(SQLite.openDatabase('rimsha.db'))
    const [Tempval, setTempVal] = useState("")
    const [importedData, setImportedData] = useState([]);
    const [data, setdata] = useState()
    const [NameData, setNameData] = useState([])
    const info = async () => {
        try {
            // fetch('https://dummyjson.com/products/1')
            //     .then(res => res.json())
            //     .then(json => setdata(json))
            // storeDataInDatabase(data)
            // console.log(data, "dataaa");

        } catch (error) {
            console.error(error, "errorrrrrrrrr");
        }
    };
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editItem, setEditItem] = useState({});
    const handleEdit = (item) => {
        setEditItem(item);
        setTempVal(item.name)
        setEditModalVisible(true);
        console.log(item, "item");
    };

    const handleCancelEdit = () => {
        setEditModalVisible(false);
    };
    // const storeDataInDatabase = (dataToStore) => {
    //     db.transaction((tx) => {
    //         tx.executeSql(
    //             'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, category TEXT, price REAL, title TEXT)'
    //         );
    //         tx.executeSql(
    //             `CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMshaARY KEY AUTOINCREMENT, name TEXT)`
    //         );
    //         tx.executeSql(
    //             'INSERT INTO products (brand, category, price, title) VALUES (?, ?, ?, ?)',
    //             [dataToStore.brand, dataToStore.category, dataToStore.price, dataToStore.title],
    //             (_, result) => {
    //                 console.log('Data inserted into the database', result);
    //             },
    //             (_, error) => {
    //                 // Handle error
    //                 console.error('Insert error', error);
    //             }
    //         );
    //         tx.executeSql(
    //             `INSERT INTO names (name) VALUES (?)`,
    //             [dataToStore],
    //             (_, result) => {
    //                 console.log('Data inserted into the database table name', dataToStore);
    //             },
    //             (_, error) => {
    //                 // Handle error
    //                 console.error('Insert error', error);
    //             }
    //         );
    //     });
    // }
    const resetDatabase = (dataToStore) => {
        db.transaction((tx) => {
            // ---------code to drop
            //   tx.executeSql(
            //     'DROP TABLE IF EXISTS products',
            //     [],
            //     () => {
            //       // Table dropped successfully
            //       console.log('Table "names" dropped.');
            //     },
            //     (_, error) => {
            //       // Handle error if the table drop fails
            //       console.error('Error dropping table "names":', error);
            //     }
            //   );

            // Recreate the "names" table
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',
                [],
                () => {
                    console.log('Table "names" created.');
                },
                (_, error) => {
                    // Handle error if table creation fails
                    console.error('Error creating table "names":', error);
                }
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
        setTempVal('')
        exportDb()
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
                // tx.executeSql(
                //     'SELECT * FROM products',
                //     [],
                //     (_, resultSet) => {
                //         const importedDataArray = [];
                //         for (let i = 0; i < resultSet.rows.length; i++) {
                //             const row = resultSet.rows.item(i);
                //             importedDataArray.push(row);
                //         }
                //         setImportedData(importedDataArray);
                //     },
                //     (_, error) => {
                //         console.error('Select error', error);
                //     }
                // );
                tx.executeSql(
                    'SELECT * FROM names',
                    [],
                    (_, resultSet) => {
                        const importedDataArray = [];
                        for (let i = 0; i < resultSet.rows.length; i++) {
                            const row = resultSet.rows.item(i);
                            importedDataArray.push(row);
                        }
                        setNameData(importedDataArray);
                        console.log('Names retrieved from the database:', importedDataArray);
                    },
                    (_, error) => {
                        console.error('Select error for names table:', error);
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

    // const renderItem = ({ item }) => {
    //     return (
    //         <Image source={{ uri: item }}
    //             style={{
    //                 width: 150,
    //                 height: 150,
    //                 borderWidth: 2,
    //                 borderColor: 'grey',
    //                 margin: 8
    //             }} />
    //     )
    // }
    const handlePress = () => {
        if (typeof Tempval === 'string' && Tempval.trim() !== "") {
            resetDatabase(Tempval);
          }
    }
    const handleDelete = (id) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM names WHERE id = ?',
                [id],
                () => {
                    console.log(`Name with id ${id} deleted.`);

                },
                (_, error) => {
                    console.error(`Error deleting name with id ${id}:`, error);
                }
            );
        });
    };
    const handleSaveEdit = (editedValue, editItem) => {
        if (Tempval.trim() !== "") {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE names SET name = ? WHERE id = ?',
                    [editedValue, editItem.id],
                    (_, result) => {
                        console.log('Name updated successfully', result);
                    },
                    (_, error) => {
                        // Handle error
                        console.error('Update error', error);
                    }
                );
            });
            setTempVal('')
            setEditModalVisible(false);
        }
    };

    useEffect(() => {
        info();
    }, [data]);

    return (
        <View style={{ flex: 1, paddingTop: 30 }}>
            <View style={{ flex: 0.2 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setTempVal}
                        value={Tempval}
                        placeholder="enter name"
                    />
                    <View style={styles.btn}>
                        <Button title='save' onPress={handlePress} />
                    </View>
                </View>
                <Button title='Show table from file' onPress={importDb} />
            </View>
            {NameData.length > 0 ? (
                <View style={{ borderWidth: 0, flex: 0.8 }}>
                    <Text style={{ fontSize: 30, marginLeft: '25%' }}>List of Names</Text>
                    {NameData.map((item) => (
                        <View style={{ flexDirection: 'row', borderWidth: 0.5, height: 40, justifyContent: 'center' }}>
                            <View style={{ flex: 0.7, paddingLeft: 20 }}>
                                <Text key={item.id} style={{ fontSize: 20 }}>
                                    Name {item.id} : {item.name}
                                </Text>
                            </View>
                            <View style={{ flex: 0.15 }}>
                                <TouchableOpacity onPress={() => handleEdit(item)}>
                                    <Text style={{ color: 'red' }}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 0.15 }}>
                                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                    <Text style={{ color: 'red' }}>Del</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                </View>

            ) :

                <View style={{ flex: 0.8 }}>

                </View>
            }
            <Modal
                visible={editModalVisible}
                animationType='slide'
            >
                <View style={{ height: '100%', paddingTop: 100 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTempVal}
                            value={Tempval}
                        />
                        <View style={styles.btn}>
                            <Button title='save' onPress={()=>handleSaveEdit(Tempval, editItem)} />
                        </View>
                        <View style={styles.btn}>
                            <Button title='close' onPress={()=>handleCancelEdit()} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 250
    },
    btn: {
        marginTop: 10
    }
});




    {/* <Text style={{ fontSize: 20 }}>{data?.brand}</Text>
        <Text style={{ fontSize: 20 }}>{data?.category}</Text>
        <Text style={{ fontSize: 20 }}>{data?.price}</Text>
        <Text style={{ fontSize: 20 }}>{data?.title}</Text>
        {data ?
            <FlatList
                data={data.images}
                renderItem={renderItem}
            /> :
            null
        } */}
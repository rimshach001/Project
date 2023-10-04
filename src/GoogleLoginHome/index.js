import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from '@firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const GoogleLoginHome = () => {
    const [userName, setUserName] = useState("");
    const [date, setdate] = useState('');
    const [time, setTime] = useState('');
    const [docData, setDocData] = useState([]);

    const navigation = useNavigation()
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '889678013137-c6opqf0t922ca231fi0j0lf782t50qs8.apps.googleusercontent.com',
        });
        const fetchData = async () => {
            try {
                const collect = collection(db, 'email');
                const querySnapshot = await getDocs(collect);

                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                });

                setDocData(data);
                console.log('Total users: ', data.length);
            } catch (error) {
                console.error('Error fetching users:', error);
            }

            const user = auth().currentUser;
           
            if (user) {
                const email = user.displayName;
                setUserName(email);
                const datee = user.metadata.lastSignInTime
                const lastSignInTime = new Date(datee);
                const date2 = lastSignInTime.toLocaleDateString(); // Get the date part
                const time2 = lastSignInTime.toLocaleTimeString(); 
                setdate(date2)
                setTime(time2)
                console.log(datee, "date");
                console.log('User email:', user);
            } else {
                console.log('User not signed in.');
            }
        };

        fetchData();
    }, []);
    const onLogoutPress = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await auth().signOut();
            navigation.navigate('Signin');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'flex-end', width: '100%', marginRight: 30 }}>
                <Button title='logout' onPress={onLogoutPress} />
            </View>
            <Text style={{ fontSize: 40, marginTop: 100 }}>Logged-in</Text>
            <Text style={{ fontSize: 20 }}>Full Name: {userName}</Text>
            <Text style={{ fontSize: 20 }}>Last time Login: {time.toString()}</Text>
            <Text style={{ fontSize: 30, marginTop: 150 }}>Data from Firestore</Text>
            {docData.map((item, index) => 
            (
                <View key={index} style={{ justifyContent: 'center',borderWidth:1, width:300, marginVertical:5, paddingLeft:5}}>
                    <Text style={{ fontSize: 15 }}>Person: {index}</Text>
                    <Text style={{ fontSize: 15 }}>Email: {item.email}</Text>
                    <Text style={{ fontSize: 15 }}>Roll No: {item.rollNo}</Text>
                </View>
            ))}
        </View>
    );
};

export default GoogleLoginHome;

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        paddingTop: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        backgroundColor:'#CBCBCC'
    },
});

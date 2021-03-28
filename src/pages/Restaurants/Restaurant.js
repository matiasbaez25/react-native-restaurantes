
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Rating } from 'react-native-elements';

import Loading from '../../components/Loading';
import CarouselImages from '../../components/Carousel';
import Map from '../../components/Map';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);
const widthScreen = Dimensions.get('window').width;

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;

    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0)

    navigation.setOptions({ title: name });

    useEffect(() => {
        db.collection('restaurans')
        .doc(id)
        .get()
        .then((response) => {
            const data = response.data();
            data.id = response.id;
            setRestaurant(data);
            setRating(data.rating)
        })
    }, [])

    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />
    
    return (
        <ScrollView vertical style={styles.viewBody}>
            <CarouselImages
                imagesArray={restaurant.images}
                height={250}
                width={widthScreen} />

            <RestaurantTitle
                name={restaurant.name}
                description={restaurant.description}
                rating={restaurant.rating} />

            <RestaurantInfo
                name={restaurant.name}
                address={restaurant.address}
                location={restaurant.location} />
        </ScrollView>
    )
}

function RestaurantTitle(props) {
    const { name, description, rating } = props;

    return (
        <View style={styles.restaurantViewTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.restaurantName}>{name}</Text>
                <Rating
                    style={styles.rating}
                    startingValue={parseFloat(rating)}
                    imageSize={20}
                    readonly />
            </View>
            <Text style={styles.restaurantDescription}>{description}</Text>
        </View>
    )
}

function RestaurantInfo(props) {
    const { name, address, location } = props;

    return (
        <View style={styles.restaurantViewInfo}>
            <Text style={styles.restaurantInfoTitle}></Text>
            <Map
                height={100}
                name={restaurant.name}
                location={restaurant.location} />
        </View>
    )
}


const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgoundColor: "#fff"
    },
    restaurantViewTitle: {
        padding: 15
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: "bold"
    },
    restaurantDescription: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0,
    },
    restaurantViewInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    }
})

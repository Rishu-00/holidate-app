import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function StartNewTripCard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.iconBox}>
                <Text style={styles.iconEmoji}>🗺️</Text>
            </View>
            <Text style={styles.title}>No Trips Planned Yet</Text>
            <Text style={styles.subTitle}>
                It's time to set your travel dreams in motion! 
                Start crafting your unforgettable journey.
            </Text>
            <TouchableOpacity
                onPress={() => router.push("/create-trip/search-place")}
                style={styles.button}>
                <FontAwesome name="plus" size={16} color="#0D0D0F" />
                <Text style={styles.buttonText}>Start a New Trip</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        paddingHorizontal: 24,
        backgroundColor: '#0D0D0F',
    },
    iconBox: {
        width: 100, height: 100,
        borderRadius: 50,
        backgroundColor: '#1E1E23',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#C9A84C',
        marginBottom: 8,
    },
    iconEmoji: { fontSize: 48 },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#F0EEE8',
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 14,
        color: '#6A6865',
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#C9A84C',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 50,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0D0D0F',
    },
})
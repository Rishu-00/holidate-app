import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { CreateTripContext } from '@/context/CreateTripContext';
import ReviewCard from '@/components/CreateTrip/ReviewCard';

export default function ReviewTrip() {
    const navigation = useNavigation();
    const router = useRouter();
    const { tripData } = useContext(CreateTripContext) ?? {};

    if (!tripData) {
        throw new Error('CreateTripContext must be used within a CreateTripProvider');
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Review Your Trip',
            headerStyle: { backgroundColor: '#0D0D0F' },
            headerTintColor: '#F0EEE8',
            headerTitleStyle: { color: '#F0EEE8', fontWeight: '700' },
        });
    }, []);

    // Extract and format trip data — handle both location and locationinfo
    const location = tripData?.locationinfo || tripData?.location;
    const travelDuration = tripData?.travelDuration;
    const travelers = tripData?.travelers;
    const budget = tripData?.budget;

    const startDate = travelDuration?.startDate ? new Date(travelDuration.startDate) : null;
    const endDate = travelDuration?.endDate ? new Date(travelDuration.endDate) : null;
    
    const travelDates = startDate && endDate
        ? `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} to ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })} (${travelDuration.totalTravelDays} days)`
        : 'Dates not selected';
    
    const travelPartners = travelers
        ? `${travelers.title} (${travelers.people} members)`
        : 'Partners not selected';
    
    const travelBudget = budget
        ? `${budget.title} Spending`
        : 'Budget not selected';

    const locationName = location?.name || 'Destination not selected';

    const buildTrip = () => {
        router.push("/create-trip/generate-trip");
    };

    return (
        <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Review Your Trip ✈️</Text>
                <Text style={styles.subtitle}>
                    Before we generate your itinerary, please review your selections.
                </Text>
            </View>

            {/* Cards */}
            <View style={styles.cardsContainer}>
                <ReviewCard 
                    icon="📍" 
                    heading="Destination" 
                    desc={locationName} 
                />
                
                <View style={styles.divider}></View>
                
                <ReviewCard 
                    icon="🗓️" 
                    heading="Travel Dates" 
                    desc={travelDates} 
                />
                
                <View style={styles.divider}></View>
                
                <ReviewCard 
                    icon="👥" 
                    heading="Travelers" 
                    desc={travelPartners} 
                />
                
                <View style={styles.divider}></View>
                
                <ReviewCard 
                    icon="💰" 
                    heading="Budget" 
                    desc={travelBudget} 
                />
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
                <Text style={styles.infoEmoji}>🤖</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.infoTitle}>AI-Powered Itinerary</Text>
                    <Text style={styles.infoText}>
                        We'll generate a complete trip plan with flights, hotels, and activities tailored to your preferences.
                    </Text>
                </View>
            </View>

            {/* Build Button */}
            <TouchableOpacity onPress={buildTrip} style={styles.button}>
                <Text style={styles.buttonText}>Build My Trip ⚙️</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#0D0D0F',
        paddingHorizontal: 24,
        paddingTop: 110,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#F0EEE8',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6A6865',
        lineHeight: 20,
    },
    cardsContainer: {
        backgroundColor: '#1E1E23',
        borderRadius: 18,
        padding: 20,
        borderWidth: 0.5,
        borderColor: '#2A2A30',
        marginBottom: 20,
    },
    divider: {
        height: 0.5,
        backgroundColor: '#2A2A30',
        marginVertical: 14,
    },
    infoBox: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#1C1A10',
        borderRadius: 14,
        padding: 16,
        borderWidth: 0.5,
        borderColor: '#C9A84C',
        marginBottom: 20,
    },
    infoEmoji: {
        fontSize: 24,
    },
    infoTitle: {
        color: '#E8C97A',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 2,
    },
    infoText: {
        color: '#6A6865',
        fontSize: 12,
        lineHeight: 16,
    },
    button: {
        backgroundColor: '#C9A84C',
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0D0D0F',
    },
});
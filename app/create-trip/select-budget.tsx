import { FlatList, StyleSheet, Text, Alert, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { CreateTripContext } from '@/context/CreateTripContext';
import { useNavigation, useRouter } from 'expo-router';
import { BudgetOptions } from '@/constants/Options';
import OptionCard from '@/components/CreateTrip/OptionCard';

export default function SelectBudget() {
    const navigation = useNavigation();
    const router = useRouter();

    const context = useContext(CreateTripContext);
    if (!context) {
        throw new Error('CreateTripContext must be used within a CreateTripProvider');
    }
    const { tripData, setTripData } = context;

    const [selectedBudget, setSelectedBudget] = useState<any>(tripData?.budget);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Select Budget',
            headerStyle: { backgroundColor: '#0D0D0F' },
            headerTintColor: '#F0EEE8',
            headerTitleStyle: { color: '#F0EEE8', fontWeight: '700' },
        });
    }, []);

    const setTripDetails = () => {
        if (!selectedBudget) {
            Alert.alert('Please select a budget category!');
            return;
        }

        setTripData({
            ...tripData,
            budget: selectedBudget,
        })

        router.push("/create-trip/review-trip");
    };

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>What's Your Budget? 💰</Text>
                <Text style={styles.subtitle}>
                    Choose your spending preferences for the trip
                </Text>
            </View>

            <FlatList
                data={BudgetOptions}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedBudget(item)}
                        style={[
                            styles.optionWrapper,
                            selectedBudget?.id === item.id && styles.optionWrapperActive
                        ]}>
                        <OptionCard option={item} selectedOption={selectedBudget} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ gap: 12 }}
            />

            <TouchableOpacity
                onPress={setTripDetails}
                disabled={!selectedBudget}
                style={[
                    styles.button,
                    !selectedBudget && { opacity: 0.5 }
                ]}
            >
                <Text style={styles.buttonText}>
                    Continue →
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 24,
        paddingTop: 110,
        backgroundColor: '#0D0D0F',
    },
    header: {
        marginBottom: 20,
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
    optionWrapper: {
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: '#2A2A30',
        overflow: 'hidden',
    },
    optionWrapperActive: {
        borderColor: '#C9A84C',
        backgroundColor: '#C9A84C11',
    },
    button: {
        backgroundColor: '#C9A84C',
        padding: 16,
        borderRadius: 50,
        marginTop: 24,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0D0D0F',
    },
});
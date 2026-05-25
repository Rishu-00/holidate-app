import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router';
import { CreateTripContext } from '@/context/CreateTripContext';
import { AI_PROMPT } from '@/constants/Options';
import { chatSession } from '@/configs/AIModelConfig';
import { auth, db } from '@/configs/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

export default function GenerateTrip() {
    const navigation = useNavigation();
    const router = useRouter();
    const user = auth.currentUser;
    const [status, setStatus] = useState('Preparing your trip...')
    const { tripData } = useContext(CreateTripContext) ?? {};

    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [])

    useEffect(() => {
        if (tripData) GenerateAiTrip()
    }, [])

    const GenerateAiTrip = async () => {
        try {
            setStatus('Analyzing your preferences... 🧠')

            // Fix — locationinfo ya location dono handle karo
            const locationName = tripData?.locationinfo?.name 
                || tripData?.location?.name 
                || 'Unknown'
            const totalDays = tripData?.travelDuration?.totalTravelDays 
                || tripData?.totalDays 
                || 3
            const traveler = tripData?.travelers?.title 
                || tripData?.traveler 
                || 'Solo'
            const budget = tripData?.budget?.title 
                || tripData?.budget 
                || 'Moderate'

            const FINAL_PROMPT = AI_PROMPT
                .replaceAll('{location}', locationName)
                .replaceAll('{totalDays}', totalDays)
                .replaceAll('{totalNights}', (totalDays - 1).toString())
                .replaceAll('{traveler}', traveler)
                .replaceAll('{budget}', budget)

            console.log('Generating trip for:', locationName)
            setStatus('Generating your itinerary... ✈️')

            const result = await chatSession.sendMessage(FINAL_PROMPT)
            const responseText = result.response.text()

            let tripResponse
            try {
                // Remove markdown if present
                const cleaned = responseText
                    .replace(/```json/g, '')
                    .replace(/```/g, '')
                    .trim()
                tripResponse = JSON.parse(cleaned)
            } catch (e) {
                console.log('Parse error:', e)
                tripResponse = { raw: responseText }
            }

            setStatus('Saving your trip... 💾')

            const docId = Date.now().toString()
            await setDoc(doc(db, 'UserTrips', docId), {
                docId,
                userEmail: user?.email || '',
                tripPlan: tripResponse,
                tripData: {
                    location: locationName,
                    totalDays,
                    traveler,
                    budget,
                    startDate: tripData?.startDate || '',
                    endDate: tripData?.endDate || '',
                },
                createdAt: new Date().toISOString(),
            })

            setStatus('Done! Redirecting... 🎉')
            router.push('/(tabs)/myTrip')

        } catch (err) {
            console.log('Generation error:', err)
            setStatus('Something went wrong. Going back...')
            setTimeout(() => router.back(), 2000)
        }
    }

    return (
        <View style={styles.page}>
            <Text style={styles.planeEmoji}>✈️</Text>

            <View style={styles.card}>
                <ActivityIndicator size="large" color="#C9A84C" />
                <Text style={styles.title}>Generating Your Trip</Text>
                <Text style={styles.status}>{status}</Text>
            </View>

            <Text style={styles.subtitle}>
                Our AI is crafting your perfect itinerary 🧳
            </Text>
            <Text style={styles.warning}>
                ⚠️ Please don't go back
            </Text>

            <View style={styles.stepsBox}>
                {[
                    '🔍 Analyzing destination',
                    '🏨 Finding best hotels',
                    '🗺️ Planning itinerary',
                    '💰 Optimizing budget',
                    '✅ Finalizing trip',
                ].map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                        <Text style={styles.stepText}>{step}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#0D0D0F',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
    },
    planeEmoji: {
        fontSize: 64,
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#1C1A10',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#C9A84C',
        width: '100%',
        gap: 12,
    },
    title: {
        color: '#F0EEE8',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    status: {
        color: '#C9A84C',
        fontSize: 14,
        textAlign: 'center',
    },
    subtitle: {
        color: '#A8A6A0',
        fontSize: 13,
        textAlign: 'center',
    },
    warning: {
        color: '#E85454',
        fontSize: 12,
        textAlign: 'center',
    },
    stepsBox: {
        width: '100%',
        backgroundColor: '#1E1E23',
        borderRadius: 16,
        padding: 16,
        gap: 10,
        borderWidth: 0.5,
        borderColor: '#2A2A30',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepText: {
        color: '#6A6865',
        fontSize: 13,
    },
})
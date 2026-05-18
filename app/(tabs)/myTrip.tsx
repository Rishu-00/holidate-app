import { View, Text, StyleSheet, ActivityIndicator, 
TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import StartNewTripCard from '@/components/StartNewTripCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/configs/firebaseConfig';
import { useRouter } from 'expo-router';

export default function MyTrip() {
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const user = auth.currentUser;
    const router = useRouter();

    useEffect(() => {
        user && GetMyTrips();
    }, [user])

    const GetMyTrips = async () => {
        setLoading(true);
        setUserTrips([]);
        const q = query(
            collection(db, 'UserTrips'),
            where('userEmail', "==", user?.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            setUserTrips(prev => [...prev, doc.data()])
        });
        setLoading(false);
    }

    const tabs = ['Upcoming', 'Ongoing', 'Completed'];

    return (
        <View style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSub}>Your Adventures</Text>
                    <Text style={styles.headerText}>My Trips ✈️</Text>
                </View>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/create-trip/search-place')}
                >
                    <FontAwesome6 name="circle-plus" size={28} color="#C9A84C" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText,
                            activeTab === tab && styles.tabTextActive]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Loading */}
            {loading && (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#C9A84C" />
                    <Text style={styles.loadingText}>Loading your trips...</Text>
                </View>
            )}

            {/* Content */}
            {!loading && (
                userTrips?.length === 0
                    ? <StartNewTripCard />
                    : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {userTrips.map((trip: any, idx: number) => (
                                <TouchableOpacity key={idx} style={styles.tripCard}>
                                    {/* Card Header */}
                                    <View style={styles.tripCardHeader}>
                                        <View style={styles.tripEmoji}>
                                            <Text style={{ fontSize: 28 }}>🌍</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.tripName}>
                                                {trip?.tripData?.location || 'My Trip'}
                                            </Text>
                                            <Text style={styles.tripDates}>
                                                {trip?.tripData?.startDate || 'Date TBD'}
                                                {trip?.tripData?.endDate
                                                    ? ` – ${trip.tripData.endDate}` : ''}
                                            </Text>
                                        </View>
                                        <View style={styles.tripBadge}>
                                            <Text style={styles.tripBadgeText}>
                                                {activeTab}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Trip Details Row */}
                                    <View style={styles.tripDetails}>
                                        <View style={styles.tripDetail}>
                                            <FontAwesome name="users"
                                                size={12} color="#6A6865" />
                                            <Text style={styles.tripDetailText}>
                                                {trip?.tripData?.traveler || '1'} Traveler(s)
                                            </Text>
                                        </View>
                                        <View style={styles.tripDetail}>
                                            <FontAwesome name="money"
                                                size={12} color="#6A6865" />
                                            <Text style={styles.tripDetailText}>
                                                {trip?.tripData?.budget || 'Budget TBD'}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Progress Bar */}
                                    <View style={styles.progressBg}>
                                        <View style={[styles.progressFill,
                                            { width: '60%' }]} />
                                    </View>
                                    <View style={styles.progressLabels}>
                                        <Text style={styles.progressLeft}>
                                            60% planned
                                        </Text>
                                        <Text style={styles.progressRight}>
                                            View Details →
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <View style={{ height: 20 }} />
                        </ScrollView>
                    )
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#0D0D0F',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerSub: {
        color: '#6A6865',
        fontSize: 12,
    },
    headerText: {
        color: '#F0EEE8',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 2,
    },
    addBtn: {
        width: 44, height: 44,
        borderRadius: 22,
        backgroundColor: '#1E1E23',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#2A2A30',
    },
    tabRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        backgroundColor: '#1E1E23',
        borderWidth: 0.5,
        borderColor: '#2A2A30',
    },
    tabActive: {
        backgroundColor: '#C9A84C',
        borderColor: '#C9A84C',
    },
    tabText: {
        color: '#6A6865',
        fontSize: 12,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#0D0D0F',
    },
    loadingBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#6A6865',
        fontSize: 14,
    },
    tripCard: {
        backgroundColor: '#1E1E23',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderWidth: 0.5,
        borderColor: '#2A2A30',
    },
    tripCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
    },
    tripEmoji: {
        width: 52, height: 52,
        borderRadius: 14,
        backgroundColor: '#26262D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tripName: {
        color: '#F0EEE8',
        fontSize: 15,
        fontWeight: '700',
    },
    tripDates: {
        color: '#6A6865',
        fontSize: 11,
        marginTop: 3,
    },
    tripBadge: {
        backgroundColor: '#C9A84C22',
        borderWidth: 0.5,
        borderColor: '#C9A84C',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 50,
    },
    tripBadgeText: {
        color: '#E8C97A',
        fontSize: 10,
        fontWeight: '600',
    },
    tripDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 14,
    },
    tripDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tripDetailText: {
        color: '#6A6865',
        fontSize: 12,
    },
    progressBg: {
        height: 4,
        backgroundColor: '#26262D',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#C9A84C',
        borderRadius: 2,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    progressLeft: {
        color: '#6A6865',
        fontSize: 11,
    },
    progressRight: {
        color: '#C9A84C',
        fontSize: 11,
        fontWeight: '600',
    },
})
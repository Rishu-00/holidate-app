import { View, Text, StyleSheet, ActivityIndicator,
TouchableOpacity, ScrollView, Alert } from 'react-native'
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
            setUserTrips((prev: any) => [...prev, doc.data()])
        });
        setLoading(false);
    }

    const getFilteredTrips = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return userTrips.filter((trip: any) => {
            const rawStart = trip?.tripData?.startDate
            const rawEnd = trip?.tripData?.endDate

            if (!rawStart || !rawEnd) {
                return activeTab === 'Upcoming'
            }

            // Parse Indian date format (e.g. "20/5/2026")
            const parseDate = (str: string) => {
                const parts = str.split('/')
                if (parts.length === 3) {
                    return new Date(
                        parseInt(parts[2]),
                        parseInt(parts[1]) - 1,
                        parseInt(parts[0])
                    )
                }
                return new Date(str)
            }

            const startDate = parseDate(rawStart)
            const endDate = parseDate(rawEnd)

            if (activeTab === 'Upcoming') {
                return startDate > today
            } else if (activeTab === 'Ongoing') {
                return startDate <= today && endDate >= today
            } else if (activeTab === 'Completed') {
                return endDate < today
            }
            return false
        })
    }

    const getTripEmoji = (location: string) => {
        if (!location) return '🌍'
        if (location.includes('Bali')) return '🌴'
        if (location.includes('Paris')) return '🗼'
        if (location.includes('Kerala')) return '🌿'
        if (location.includes('Dubai')) return '🏙️'
        if (location.includes('Tokyo')) return '🗾'
        if (location.includes('Delhi')) return '🕌'
        if (location.includes('Goa')) return '🏖️'
        if (location.includes('Singapore')) return '🦁'
        if (location.includes('Bangkok')) return '🛕'
        return '🌍'
    }

    const getBadgeColor = () => {
        if (activeTab === 'Ongoing') return { bg: '#1D9E7522', border: '#1D9E75', text: '#1D9E75' }
        if (activeTab === 'Completed') return { bg: '#378ADD22', border: '#378ADD', text: '#378ADD' }
        return { bg: '#C9A84C22', border: '#C9A84C', text: '#E8C97A' }
    }

    const getProgress = () => {
        if (activeTab === 'Completed') return '100%'
        if (activeTab === 'Ongoing') return '50%'
        return '20%'
    }

    const tabs = ['Upcoming', 'Ongoing', 'Completed'];
    const filteredTrips = getFilteredTrips()
    const badge = getBadgeColor()

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
                    <Text style={styles.loadingText}>Please wait... ✈️</Text>
                    <Text style={styles.loadingSubText}>Loading your trips</Text>
                </View>
            )}

            {/* Content */}
            {!loading && (
                userTrips?.length === 0
                    ? <StartNewTripCard />
                    : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            {filteredTrips.length === 0 ? (
                                <View style={styles.emptyTab}>
                                    <Text style={styles.emptyTabEmoji}>
                                        {activeTab === 'Upcoming' ? '📅'
                                            : activeTab === 'Ongoing' ? '✈️'
                                            : '✅'}
                                    </Text>
                                    <Text style={styles.emptyTabText}>
                                        No {activeTab} Trips!
                                    </Text>
                                    <Text style={styles.emptyTabSub}>
                                        {activeTab === 'Upcoming'
                                            ? 'Plan a new trip!'
                                            : activeTab === 'Ongoing'
                                            ? 'No trips happening right now'
                                            : 'No completed trips yet'}
                                    </Text>
                                    {activeTab === 'Upcoming' && (
                                        <TouchableOpacity
                                            style={styles.newTripBtn}
                                            onPress={() => router.push('/create-trip/search-place')}
                                        >
                                            <Text style={styles.newTripBtnText}>
                                                + Plan New Trip
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                filteredTrips.map((trip: any, idx: number) => (
                                    <TouchableOpacity
    key={idx}
    style={styles.tripCard}
    onPress={() => Alert.alert(
        trip?.tripData?.location || 'My Trip',
        `📅 ${trip?.tripData?.startDate} – ${trip?.tripData?.endDate}\n👥 ${trip?.tripData?.traveler || 'N/A'}\n💰 ${trip?.tripData?.budget || 'N/A'}`
    )}
>
                                        {/* Card Header */}
                                        <View style={styles.tripCardHeader}>
                                            <View style={styles.tripEmoji}>
                                                <Text style={{ fontSize: 28 }}>
                                                    {getTripEmoji(trip?.tripData?.location || '')}
                                                </Text>
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
                                            <View style={[styles.tripBadge, {
                                                backgroundColor: badge.bg,
                                                borderColor: badge.border
                                            }]}>
                                                <Text style={[styles.tripBadgeText,
                                                    { color: badge.text }]}>
                                                    {activeTab}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Trip Details */}
                                        <View style={styles.tripDetails}>
                                            {trip?.tripData?.traveler && (
                                                <View style={styles.tripDetail}>
                                                    <FontAwesome name="users"
                                                        size={12} color="#6A6865" />
                                                    <Text style={styles.tripDetailText}>
                                                        {trip.tripData.traveler}
                                                    </Text>
                                                </View>
                                            )}
                                            {trip?.tripData?.budget && (
                                                <View style={styles.tripDetail}>
                                                    <FontAwesome name="money"
                                                        size={12} color="#6A6865" />
                                                    <Text style={styles.tripDetailText}>
                                                        {trip.tripData.budget}
                                                    </Text>
                                                </View>
                                            )}
                                            {trip?.tripData?.totalDays && (
                                                <View style={styles.tripDetail}>
                                                    <FontAwesome name="calendar"
                                                        size={12} color="#6A6865" />
                                                    <Text style={styles.tripDetailText}>
                                                        {trip.tripData.totalDays} Days
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Progress Bar */}
                                        <View style={styles.progressBg}>
                                            <View style={[styles.progressFill,
                                                { width: getProgress() as any }]} />
                                        </View>
                                        <View style={styles.progressLabels}>
                                            <Text style={styles.progressLeft}>
                                                {getProgress()} planned
                                            </Text>
                                            <Text style={styles.progressRight}>
                                                View Details →
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
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
    headerSub: { color: '#6A6865', fontSize: 12 },
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
    tabText: { color: '#6A6865', fontSize: 12, fontWeight: '600' },
    tabTextActive: { color: '#0D0D0F' },
    loadingBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#F0EEE8',
        fontSize: 18,
        fontWeight: '700',
    },
    loadingSubText: {
        color: '#6A6865',
        fontSize: 14,
    },
    emptyTab: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyTabEmoji: { fontSize: 52 },
    emptyTabText: {
        color: '#F0EEE8',
        fontSize: 18,
        fontWeight: '700',
    },
    emptyTabSub: {
        color: '#6A6865',
        fontSize: 13,
        textAlign: 'center',
    },
    newTripBtn: {
        backgroundColor: '#C9A84C',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
        marginTop: 8,
    },
    newTripBtnText: {
        color: '#0D0D0F',
        fontSize: 14,
        fontWeight: '700',
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
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 50,
        borderWidth: 0.5,
    },
    tripBadgeText: {
        fontSize: 10,
        fontWeight: '600',
    },
    tripDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 14,
        flexWrap: 'wrap',
    },
    tripDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tripDetailText: { color: '#6A6865', fontSize: 12 },
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
    progressLeft: { color: '#6A6865', fontSize: 11 },
    progressRight: {
        color: '#C9A84C',
        fontSize: 11,
        fontWeight: '600',
    },
})
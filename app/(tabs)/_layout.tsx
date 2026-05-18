import { View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#C9A84C',
            tabBarInactiveTintColor: '#6A6865',
            tabBarStyle: {
                backgroundColor: '#161619',
                borderTopColor: '#2A2A30',
                borderTopWidth: 0.5,
                height: 65,
                paddingBottom: 10,
                paddingTop: 8,
            },
            tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '600',
            }
        }}>
            <Tabs.Screen name="discover"
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => 
                        <FontAwesome name="home" size={22} color={color} />
                }}
            />
            <Tabs.Screen name="myTrip"
                options={{
                    tabBarLabel: 'My Trips',
                    tabBarIcon: ({ color }) => 
                        <FontAwesome6 name="location-dot" size={22} color={color} />
                }}
            />
            <Tabs.Screen name="chat"
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color }) => 
                        <FontAwesome name="comment" size={22} color={color} />
                }}
            />
            <Tabs.Screen name="social"
                options={{
                    tabBarLabel: 'Social',
                    tabBarIcon: ({ color }) => 
                        <FontAwesome name="users" size={22} color={color} />
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => 
                        <FontAwesome name="user" size={22} color={color} />
                }}
            />
            <Tabs.Screen name="results"
                options={{
                   href: null,  // ← yeh tab bar se hide kar dega
                }}
            />
            <Tabs.Screen name="weather"
                options={{
                    tabBarLabel: 'Weather',
                    tabBarIcon: ({ color }) =>
                        <FontAwesome name="cloud" size={22} color={color} />
                }}
            />
            <Tabs.Screen name="budget"
                options={{
                    tabBarLabel: 'Budget',
                    tabBarIcon: ({ color }) =>
                        <FontAwesome name="rupee" size={22} color={color} />
                }}
            />
            <Tabs.Screen name="map"
                options={{
                    tabBarLabel: 'Map',
                    tabBarIcon: ({ color }) =>
                        <FontAwesome name="map" size={22} color={color} />
                }}
            />
        </Tabs>
    )
}
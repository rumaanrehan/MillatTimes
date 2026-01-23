import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNav } from '../../components/BottomNav';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <BottomNav {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="podcast"
                options={{
                    title: 'Podcast',
                }}
            />
            <Tabs.Screen
                name="videos"
                options={{
                    title: 'Videos',
                }}
            />
            <Tabs.Screen
                name="live"
                options={{
                    title: 'Live',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}

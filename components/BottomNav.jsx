import { Home, Mic, PlayCircle, Radio, User } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS = {
    index: Home,
    podcast: Mic,
    videos: PlayCircle,
    live: Radio,
    profile: User,
};

const TAB_LABELS = {
    index: 'Home',
    podcast: 'Podcast',
    videos: 'Videos',
    live: 'Live',
    profile: 'Profile',
};

export function BottomNav({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();

    if (!state) return null;

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 15) }]}>
            <View style={styles.navInner}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = TAB_LABELS[route.name] || route.name;
                    const Icon = TAB_ICONS[route.name] || Home;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <Pressable
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.navItem}
                            android_ripple={{ color: '#f3f4f6' }}
                        >
                            <Icon
                                size={24}
                                color={isFocused ? '#008351ff' : '#6b7280'}
                            />
                            <Text style={[
                                styles.label,
                                { color: isFocused ? '#008351ff' : '#6b7280' }
                            ]}>
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    navItem: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 12,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        fontFamily: 'NotoSans_500Medium',
    },
});
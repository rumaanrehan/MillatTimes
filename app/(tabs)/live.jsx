import { Image } from 'expo-image';
import { Youtube } from 'lucide-react-native';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export default function LiveScreen() {
    const handlePress = () => {
        Linking.openURL('https://www.youtube.com/@MillatTimesTV');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/live.png')}
                    style={styles.image}
                    contentFit="contain"
                />
                <Text style={styles.title}>No Live Stream Active</Text>
                <Text style={styles.subtitle}>
                    Subscribe to our YouTube channel to never miss a live stream, breaking news, and exclusive reports.
                </Text>

                <Pressable style={styles.button} onPress={handlePress}>
                    <Youtube size={24} color="#ffffff" />
                    <Text style={styles.buttonText}>Visit Millat Times TV</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 150,
        marginBottom: 32,
    },
    title: {
        fontSize: 22,
        fontFamily: 'NotoSans_700Bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'NotoSans_400Regular',
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef4444',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 50,
        gap: 12,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'NotoSans_600SemiBold',
    },
});

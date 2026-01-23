import { StyleSheet, Text, View } from 'react-native';

export default function LiveScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Currently No Live Stream Going On</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    text: {
        fontSize: 18,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#6b7280',
    },
});

import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "../components/SearchBar";

const POPULAR_SEARCHES = [
    "Sensex",
    "Tamil Nadu",
    "T20 World Cup",
    "Donald Trump",
    "Nitin Nabin",
    "Stray Dogs",
    "PM Modi",
    "Davos 2026",
    "Play Time!",
];

export default function SearchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");

    const handleSearch = (q) => {
        const cleaned = q.trim();
        if (cleaned) {
            setSubmittedQuery(cleaned);
            setQuery(cleaned);
            Keyboard.dismiss();
            console.log("Searching for:", cleaned);
            // Here you would typically integrate with your news search service
        }
    };

    const handleClear = () => {
        setQuery("");
        setSubmittedQuery("");
    };

    const isEmpty = submittedQuery.trim().length === 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Top Search Bar */}
            <SearchBar
                value={query}
                onChangeText={setQuery}
                onSubmit={() => handleSearch(query)}
                onClear={handleClear}
                onBack={() => router.back()}
                placeholder="Search Millat Times..."
            />

            {/* Content Area */}
            {isEmpty ? (
                <Suggestions
                    data={POPULAR_SEARCHES}
                    onPressChip={handleSearch}
                />
            ) : (
                <View style={styles.resultsContainer}>
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsTitle}>Results for &quot;{submittedQuery}&quot;</Text>
                        <Pressable onPress={() => setSubmittedQuery("")}>
                            <Text style={styles.clearResultsText}>Clear</Text>
                        </Pressable>
                    </View>
                    {/* Results list would go here */}
                    <Text style={styles.placeholderText}>Search results coming soon...</Text>
                </View>
            )}
        </View>
    );
}

function Suggestions({ data, onPressChip }) {
    return (
        <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Popular Searches</Text>
            <View style={styles.chipGrid}>
                {data.map((item) => (
                    <Pressable
                        key={item}
                        onPress={() => onPressChip(item)}
                        style={styles.chip}
                    >
                        <Text style={styles.chipText}>{item}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    suggestionsContainer: {
        flex: 1,
        padding: 20,
    },
    suggestionsTitle: {
        fontSize: 20,
        fontFamily: 'NotoSans_700Bold',
        color: '#111827',
        marginBottom: 20,
    },
    chipGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    chip: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    chipText: {
        fontSize: 15,
        fontFamily: 'NotoSans_500Medium',
        color: '#374151',
    },
    resultsContainer: {
        flex: 1,
        padding: 20,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    resultsTitle: {
        fontSize: 16,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#4b5563',
    },
    clearResultsText: {
        color: '#008351ff',
        fontFamily: 'NotoSans_600SemiBold',
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#9ca3af',
        fontFamily: 'NotoSans_400Regular',
    }
});

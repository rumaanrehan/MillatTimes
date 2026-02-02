import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewsCard } from "../components/NewsCard";
import { SearchBar } from "../components/SearchBar";
import { getPopularKeywords } from "../services/keywordService";
import { searchPosts } from "../services/wordpress";
import { transformPost } from "../utils/wpTransform";

export default function SearchScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dynamic popular searches
    useEffect(() => {
        async function fetchPopular() {
            try {
                const keywords = await getPopularKeywords();
                if (keywords.length > 0) {
                    setSuggestions(keywords);
                }
            } catch (err) {
                console.error("Failed to load popular searches:", err);
            } finally {
                setLoadingSuggestions(false);
            }
        }
        fetchPopular();
    }, []);

    // Handle initial search from URL params (e.g. ?s=bareilly)
    useEffect(() => {
        if (params.s) {
            const initialQuery = params.s;
            setQuery(initialQuery);
            handleSearch(initialQuery);
        }
    }, [params.s]);

    const handleSearch = async (q) => {
        const cleaned = q.trim();
        if (cleaned) {
            setSubmittedQuery(cleaned);
            setQuery(cleaned);
            Keyboard.dismiss();
            setLoading(true);
            setError(null);
            setResults([]);

            try {
                const rawPosts = await searchPosts(cleaned);
                const transformed = rawPosts.map(transformPost);
                setResults(transformed);
            } catch (err) {
                console.error("Search failed:", err);
                setError("Failed to fetch search results. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClear = () => {
        setQuery("");
        setSubmittedQuery("");
        setResults([]);
        setError(null);
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
                loadingSuggestions ? (
                    <View style={styles.center}>
                        <ActivityIndicator color="#008351ff" />
                    </View>
                ) : (
                    <Suggestions
                        data={suggestions}
                        onPressChip={handleSearch}
                    />
                )
            ) : (
                <View style={styles.resultsContainer}>
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsTitle}>Results for &quot;{submittedQuery}&quot;</Text>
                        <Pressable onPress={handleClear}>
                            <Text style={styles.clearResultsText}>Clear</Text>
                        </Pressable>
                    </View>

                    {loading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color="#008351ff" />
                        </View>
                    ) : error ? (
                        <View style={styles.center}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <NewsCard news={item} language="en" />
                            )}
                            ListEmptyComponent={
                                <Text style={styles.placeholderText}>No results found.</Text>
                            }
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}
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
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontFamily: 'NotoSans_500Medium',
    }
});

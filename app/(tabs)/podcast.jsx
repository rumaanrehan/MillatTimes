import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from "../../components/AppText";
import { PrimaryNavbar } from "../../components/Navbar";

// 1) Extract videoId from a YouTube URL (handles watch?v=, youtu.be/, shorts/)
function getYouTubeVideoId(url) {
  try {
    const u = new URL(url);

    // https://www.youtube.com/watch?v=VIDEO_ID
    const v = u.searchParams.get("v");
    if (v) return v;

    // https://youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "").trim();
      return id || null;
    }

    // https://www.youtube.com/shorts/VIDEO_ID
    if (u.pathname.startsWith("/shorts/")) {
      return u.pathname.split("/shorts/")[1]?.split("?")[0] ?? null;
    }

    // https://www.youtube.com/embed/VIDEO_ID
    if (u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/embed/")[1]?.split("?")[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

// 2) Build oEmbed URL dynamically from any YouTube URL
function buildOEmbedUrlFromYouTubeUrl(youtubeUrl) {
  const videoId = getYouTubeVideoId(youtubeUrl);
  if (!videoId) return null;

  const cleanWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  return `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanWatchUrl)}&format=json`;
}

export default function PodcastScreen() {
  const insets = useSafeAreaInsets();
  const [language] = useState('en');
  const youtubeUrl =
    "https://www.youtube.com/watch?v=_qKh1ye3kRw&pp=ygUUbWlsbGF0IHRpbWVzIHBvZGNhc3Q%3D";

  const oEmbedUrl = useMemo(() => buildOEmbedUrlFromYouTubeUrl(youtubeUrl), [youtubeUrl]);

  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPodcast = async () => {
    try {
      setLoading(true);
      setErr(null);

      if (!oEmbedUrl) throw new Error("Invalid YouTube URL (could not find video id).");

      const res = await fetch(oEmbedUrl);
      if (!res.ok) throw new Error(`oEmbed failed: HTTP ${res.status}`);
      const json = await res.json();

      // json contains: title, thumbnail_url, author_name, provider_name, ...
      setData(json);
    } catch (e) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErr(null);

        if (!oEmbedUrl) throw new Error("Invalid YouTube URL (could not find video id).");

        const res = await fetch(oEmbedUrl);
        if (!res.ok) throw new Error(`oEmbed failed: HTTP ${res.status}`);
        const json = await res.json();

        // json contains: title, thumbnail_url, author_name, provider_name, ...
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) setErr(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [oEmbedUrl]);

  const onPress = async () => {
    const supported = await Linking.canOpenURL(youtubeUrl);
    if (supported) Linking.openURL(youtubeUrl);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PrimaryNavbar
        language={language}
        onMenuClick={() => {}}
        onLogoClick={() => {}}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.header}>
          <AppText size={28} weight="700" style={styles.title}>Podcast</AppText>
          <AppText size={16} weight="400" style={styles.subtitle}>
            Listen to our latest episodes
          </AppText>
        </View> */}

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#008351ff" />
            <AppText size={16} weight="500" style={styles.loadingText}>
              Loading podcast...
            </AppText>
          </View>
        ) : err ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <AppText size={18} weight="600" style={styles.errorText}>
              {err}
            </AppText>
            <Pressable onPress={loadPodcast} style={styles.retryButton}>
              <AppText size={16} weight="600" style={styles.retryButtonText}>
                Retry
              </AppText>
            </Pressable>
          </View>
        ) : (
          <Pressable 
            onPress={onPress} 
            style={styles.podcastCard}
            android_ripple={{ color: '#e5e7eb' }}
          >
            <View style={styles.thumbnailContainer}>
              <ExpoImage
                source={{ uri: data?.thumbnail_url }}
                style={styles.thumbnail}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.overlay}>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={32} color="#ffffff" />
                </View>
              </View>
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={14} color="#ffffff" />
                <Text style={styles.durationText}>Watch Now</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <AppText size={20} weight="700" style={styles.podcastTitle} numberOfLines={2}>
                {data?.title}
              </AppText>
              
              {/* <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={16} color="#6b7280" />
                  <AppText size={14} weight="500" style={styles.metaText}>
                    {data?.author_name || 'Millat Times'}
                  </AppText>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="logo-youtube" size={16} color="#ef4444" />
                  <AppText size={14} weight="500" style={styles.metaText}>
                    {data?.provider_name || 'YouTube'}
                  </AppText>
                </View>
              </View> */}

              {/* <View style={styles.actionButton}>
                <Ionicons name="play-circle" size={20} color="#ffffff" />
                <AppText size={16} weight="600" style={styles.actionButtonText}>
                  Play Episode
                </AppText>
              </View> */}
            </View>
          </Pressable>
        )}

        {/* Additional space for future episodes */}
        <View style={styles.footer}>
          <AppText size={14} weight="400" style={styles.footerText}>
            More episodes coming soon
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    color: "#0a0a0a",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6b7280",
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: "#6b7280",
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: "#008351ff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
  },
  podcastCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnailContainer: {
    position: 'relative',
    width: "100%",
    height: 220,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 131, 81, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  durationText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: 'NotoSans_600SemiBold',
  },
  cardContent: {
    padding: 20,
  },
  podcastTitle: {
    color: "#0a0a0a",
    marginBottom: 12,
    lineHeight: 26,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: "#6b7280",
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#008351ff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: "#ffffff",
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    color: "#9ca3af",
  },
});

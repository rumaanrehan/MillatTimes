import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from "react-native-youtube-iframe";
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

const YOUTUBE_URLS = [
  "https://youtu.be/WmvZ8ShlAXc?si=ZPTZhxKbhS2Dvz2b",
  "https://youtu.be/_qKh1ye3kRw?si=djIWv3LSYvCgM0qh"
];

export default function PodcastScreen() {
  const insets = useSafeAreaInsets();
  const [language] = useState('en');
  const youtubeUrls = YOUTUBE_URLS;

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const loadPodcast = async (url, index) => {
    try {
      const oEmbedUrl = buildOEmbedUrlFromYouTubeUrl(url);
      if (!oEmbedUrl) {
        throw new Error("Invalid YouTube URL (could not find video id).");
      }

      const res = await fetch(oEmbedUrl);
      if (!res.ok) throw new Error(`oEmbed failed: HTTP ${res.status}`);
      const json = await res.json();

      return { url, data: json, index };
    } catch (e) {
      return { url, data: null, index, error: String(e?.message ?? e) };
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        setLoading(true);
        setErrors({});

        const promises = youtubeUrls.map((url, index) => loadPodcast(url, index));
        const results = await Promise.all(promises);

        if (!mounted) return;

        const loadedPodcasts = [];
        const newErrors = {};

        results.forEach((result) => {
          if (result.error) {
            newErrors[result.index] = result.error;
          } else if (result.data) {
            loadedPodcasts.push({
              url: result.url,
              videoId: getYouTubeVideoId(result.url),
              ...result.data,
            });
          }
        });

        setPodcasts(loadedPodcasts);
        setErrors(newErrors);
      } catch (e) {
        if (mounted) {
          setErrors({ general: String(e?.message ?? e) });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoPress = (videoId) => {
    setPlayingVideoId(videoId);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PrimaryNavbar
        language={language}
        onMenuClick={() => { }}
        onLogoClick={() => { }}
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
              Loading podcasts...
            </AppText>
          </View>
        ) : podcasts.length === 0 && Object.keys(errors).length > 0 ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <AppText size={18} weight="600" style={styles.errorText}>
              {errors.general || "Failed to load podcasts"}
            </AppText>
          </View>
        ) : (
          <>
            {podcasts.map((podcast, index) => (
              <View
                key={index}
                style={[styles.podcastCard, index > 0 && styles.podcastCardSpacing]}
              >
                <View style={styles.thumbnailContainer}>
                  {playingVideoId === podcast.videoId ? (
                    <YoutubePlayer
                      height={220}
                      play={true}
                      videoId={podcast.videoId}
                    />
                  ) : (
                    <Pressable
                      onPress={() => handleVideoPress(podcast.videoId)}
                      style={{ flex: 1 }}
                    >
                      <ExpoImage
                        source={{ uri: podcast.thumbnail_url }}
                        style={styles.thumbnail}
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={styles.overlay}>
                        <View style={styles.playButton}>
                          <Ionicons name="play" size={32} color="#ffffff" />
                        </View>
                      </View>
                    </Pressable>
                  )}
                  {playingVideoId !== podcast.videoId && (
                    <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={14} color="#ffffff" />
                      <Text style={styles.durationText}>Watch Now</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardContent}>
                  <AppText size={20} weight="700" style={styles.podcastTitle} numberOfLines={2}>
                    {podcast.title}
                  </AppText>
                </View>
              </View>
            ))}
          </>
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
  podcastCardSpacing: {
    marginTop: 16,
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

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchCategories, resolveCategoryIds } from '../services/categoryService';

const TABS_CONFIG = [
  { key: "millat_times", label: "Millat Times", slug: null }, // null fetches all categories
  { key: "national", label: "National", slug: "national" },
  { key: "muslim_world", label: "Muslim World", slug: "islami-dunya" },
  { key: "world", label: "World", slug: "world" },
  { key: "special_column", label: "Special Column", slug: "special-column" },
  { key: "opinion", label: "Opinion", slug: "opinion" },
  { key: "state_news", label: "State News", slug: "state-news" },
  { key: "sport", label: "Sport", slug: "sport" },
  { key: "khabar_dar_khabar", label: "Khabar Dar Khabar", slug: "news-and-analyses" },
];

export function SecondaryNavbar({ onTabChange, language }) {
  const [activeTab, setActiveTab] = useState(TABS_CONFIG[0].key);
  const [tabs, setTabs] = useState(TABS_CONFIG.map(t => ({ ...t, categoryId: null })));
  const isRTL = language === 'ur';
  const styles = getStyles(isRTL);

  useEffect(() => {
    async function initCategories() {
      const categories = await fetchCategories();
      const slugs = TABS_CONFIG.map(t => t.slug).filter(s => s !== null);
      const mapping = resolveCategoryIds(categories, slugs);

      const updatedTabs = TABS_CONFIG.map(tab => ({
        ...tab,
        categoryId: tab.slug ? mapping[tab.slug] : null
      }));

      setTabs(updatedTabs);
    }

    initCategories();
  }, []);

  const handleTabPress = (tab) => {
    setActiveTab(tab.key);
    onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => handleTabPress(tab)}
            style={[
              styles.tab,
              activeTab === tab.key ? styles.tabActive : styles.tabInactive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(isRTL) {
  return StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingTop: 0,
      paddingBottom: 5,
    },
    scrollContent: {
      paddingHorizontal: 16,
      gap: 12,
    },
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 5,
      borderRadius: 8,
      marginRight: 4,
    },
    tabActive: {
      backgroundColor: '#eaf9f3ff',
    },
    tabInactive: {
      backgroundColor: 'transparent',
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'NotoSans_700Bold',
    },
    tabTextActive: {
      color: '#008351ff',
    },
    tabTextInactive: {
      color: '#1c1e20',
    },
  });
}

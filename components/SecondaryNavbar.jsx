import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const TABS = ['Top News', 'Global', 'Health', 'Science', 'Entertainment', 'Technology'];

export function SecondaryNavbar({ onTabChange, language }) {
  const [activeTab, setActiveTab] = useState('Top News');
  const isRTL = language === 'ur';
  const styles = getStyles(isRTL);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => handleTabPress(tab)}
            style={[
              styles.tab,
              activeTab === tab ? styles.tabActive : styles.tabInactive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              {tab}
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

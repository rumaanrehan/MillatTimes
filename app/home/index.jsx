import { categories, newsData } from '@/app/data/news-data';
import { PrimaryNavbar } from '@/components/Navbar';
import { NewsCard } from '@/components/NewsCard';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [language, setLanguage] = useState('en');
  const [activeCategory, setActiveCategory] = useState(categories.en[0]);

  const isRTL = language === 'ur';

  // Get the index of the active category
  const categoryIndex = categories[language].indexOf(activeCategory);
  const englishCategory = categories.en[categoryIndex];

  // Filter news by category (match with English category for consistency)
  const filteredNews = activeCategory === categories[language][0]
    ? newsData // "Top News" shows all
    : newsData.filter(news => news.category === englishCategory);

  const handleNewsClick = (news) => {
    // Handle news click - navigate to detail page
    console.log('Clicked news:', news.id);
  };

  return (
    <View style={styles.container}>
      <PrimaryNavbar
        language={language}
        onMenuClick={() => {}}
        onSearchClick={() => {}}
        onLogoClick={() => setActiveCategory(categories[language][0])}
      />

      <View
        style={[
          styles.content,
          { direction: isRTL ? 'rtl' : 'ltr' }
        ]}
      >
        {filteredNews.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
            language={language}
            onClick={() => handleNewsClick(news)}
          />
        ))}

        {filteredNews.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No news available in this category
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

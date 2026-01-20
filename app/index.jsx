import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { PrimaryNavbar } from "../components/Navbar";
import { NewsCard } from "../components/NewsCard";
import { NewsCardSecondary } from "../components/NewsCardSecondary";
import { SearchBar } from "../components/SearchBar";
import { SecondaryNavbar } from "../components/SecondaryNavbar";
import { SearchProvider, useSearch } from "../context/SearchPageToggle";
import { newsData } from "../data/news-data";

function HomeContent() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const { isSearchOpen } = useSearch();
  const [activeTab, setActiveTab] = useState('Top News');

  const secondaryIds = ['4', '5', '7'];

  return (
    <View style={styles.container}>
      {isSearchOpen ? <SearchBar /> : <>
        <PrimaryNavbar
          language={language}
          onMenuClick={() => { }}
          onLogoClick={() => router.push('/')}
        />
        <SecondaryNavbar
          onTabChange={setActiveTab}
          language={language}
        />
      </>}
      {!isSearchOpen && (
        <FlatList
          data={newsData}
          renderItem={({ item }) => {
            if (secondaryIds.includes(item.id)) {
              return (
                <NewsCardSecondary
                  news={item}
                  language={language}
                />
              );
            }
            return (
              <NewsCard
                news={item}
                language={language}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

export default function Home() {
  return (
    <SearchProvider>
      <HomeContent />
    </SearchProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  listContent: { paddingBottom: 20 },
});

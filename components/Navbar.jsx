import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { Search } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import MillatTimesLogo from '../assets/MillatTimesLogo.avif';
import { translations } from '../data/news-data';

export function PrimaryNavbar({ language, onMenuClick, onLogoClick }) {
  const router = useRouter();
  const t = translations[language];
  const isRTL = language === 'ur';
  const styles = getStyles(isRTL);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {/* Left: Logo */}
        <Pressable
          onPress={onLogoClick}
          style={styles.logoContainer}
        >
          <Image
            source={MillatTimesLogo}
            style={styles.logo}
            contentFit="contain"
          />
        </Pressable>

        {/* Left: Menu Icon */}
        <Pressable
          onPress={onMenuClick}
          style={styles.iconButton}
        >
          {/* <Ionicons name="menu" size={24} color="#0a0a0a" /> */}
        </Pressable>

        {/* Right: Search + Live Button */}
        <View style={styles.rightContainer}>
          <Pressable
            onPress={() => router.push('/search')}
            style={styles.iconButton}
          >
            <Search size={27} style={styles.searchIcon} />
          </Pressable>

          {/* <Pressable
            onPress={() => router.push('/live')}
            style={styles.liveButton}
          >
            <Image
              source={LiveIcon}
              style={styles.liveIcon}
              contentFit="contain"
            />
            <Text style={styles.liveText}>{t.live}</Text>
          </Pressable> */}
        </View>
      </View>
    </View>
  );
}

function getStyles(isRTL) {
  return StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      // borderBottomWidth: 1,
      // borderBottomColor: '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    navBar: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      paddingHorizontal: 2,
    },
    iconButton: {
      padding: 2,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      justifyContent: 'left',
      alignItems: 'end',
    },
    logo: {
      width: 200,
      height: 150,
    },
    rightContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 8,
    },
    searchIcon: {
      color: '#808080',
      marginHorizontal: 5
    },
    liveButton: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
      paddingHorizontal: 8,
      paddingVertical: 0,
    },
    liveIcon: {
      width: 20,
      height: 20,
      transform: [{ translateY: 2 }],
    },
    liveText: {
      color: '#ef4444',
      fontSize: 8,
      fontFamily: 'LibreBodoni_500Medium',
      transform: [{ translateY: -2 }],
    },
  });
}

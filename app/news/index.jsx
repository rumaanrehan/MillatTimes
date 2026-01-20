import { StyleSheet, View } from "react-native";
import AppText from "../../components/AppText";

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <AppText size={22} weight="700">News</AppText>
      <AppText>This is /news route</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
});

import { Text } from "react-native";

// Map weight to Libre Bodoni font family
const getFontFamily = (weight) => {
  const numWeight = typeof weight === 'string' ? parseInt(weight) : weight;

  if (numWeight >= 700 || weight === 'bold' || weight === '700') {
    return 'LibreBodoni_700Bold';
  } else if (numWeight >= 600 || weight === '600') {
    return 'LibreBodoni_600SemiBold';
  } else if (numWeight >= 500 || weight === '500') {
    return 'LibreBodoni_500Medium';
  }
  return 'LibreBodoni_400Regular';
};

export default function AppText({ children, size = 16, weight = "400", style }) {
  const fontFamily = getFontFamily(weight);

  return (
    <Text style={[{ fontSize: size, fontFamily }, style]}>
      {children}
    </Text>
  );
}

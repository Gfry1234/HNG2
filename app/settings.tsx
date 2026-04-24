import { SettingsScreen } from '@/screens/SettingsScreen';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation() as any;
  return <SettingsScreen navigation={navigation} />;
}

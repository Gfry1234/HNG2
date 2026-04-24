import { DashboardScreen } from '@/screens/DashboardScreen';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation() as any;
  return <DashboardScreen navigation={navigation} />;
}

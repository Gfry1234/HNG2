import { AnalyticsScreen } from '@/screens/AnalyticsScreen';
import { useNavigation } from '@react-navigation/native';

export default function Analytics() {
  const navigation = useNavigation() as any;
  return <AnalyticsScreen navigation={navigation} />;
}

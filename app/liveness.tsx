import { LivenessScreen } from '@/screens/LivenessScreen';
import { useNavigation } from '@react-navigation/native';

export default function Liveness() {
  const navigation = useNavigation() as any;
  return <LivenessScreen navigation={navigation} />;
}

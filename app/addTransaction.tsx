import { AddTransactionScreen } from '@/screens/AddTransactionScreen';
import { useNavigation } from '@react-navigation/native';

export default function AddTransaction() {
  const navigation = useNavigation() as any;
  return <AddTransactionScreen navigation={navigation} />;
}

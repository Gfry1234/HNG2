import { TransactionsScreen } from '@/screens/TransactionsScreen';
import { useNavigation } from '@react-navigation/native';

export default function Transactions() {
  const navigation = useNavigation() as any;
  return <TransactionsScreen navigation={navigation} />;
}

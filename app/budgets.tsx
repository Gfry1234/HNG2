import { BudgetsScreen } from '@/screens/BudgetsScreen';
import { useNavigation } from '@react-navigation/native';

export default function Budgets() {
  const navigation = useNavigation() as any;
  return <BudgetsScreen navigation={navigation} />;
}

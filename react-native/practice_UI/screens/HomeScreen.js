import { useNavigation } from '@react-navigation/native';
import { Button, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Button title="Go to Store" onPress={() => navigation.navigate('Store')} />
    </SafeAreaView>
  );
}
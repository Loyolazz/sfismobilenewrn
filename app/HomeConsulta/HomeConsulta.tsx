import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeConsulta() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold">SFISMobile</Text>
            <Link href="/Login">Ir para Login</Link>
        </View>
    );
}
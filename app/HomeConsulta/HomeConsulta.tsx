import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import styles from './styles';

export default function HomeConsulta() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SFISMobile</Text>
            <Link href="/Login">Ir para Login</Link>
        </View>
    );
}


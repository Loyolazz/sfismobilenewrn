import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {MaterialIcons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {loadSession, clearSession} from '@/src/services/session';
import type {Servidor} from '@/src/api/usuarioAutenticar';
import styles from './styles';


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
    const router = useRouter();
    const [user, setUser] = useState<Servidor | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const session = await loadSession();
                setUser(session?.usuario ?? null);
            } catch {
                setUser(null);
            }
        })();
    }, []);

    async function handleLogout() {
        await clearSession();
        router.replace('/Login');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
                <View style={styles.userSection}>
                    {user?.Foto ? (
                        <Image
                            source={{uri: `data:image/png;base64,${user.Foto}`}}
                            style={styles.userAvatar}
                        />
                    ) : (
                        <MaterialIcons name="person" size={64} color="#fff"/>
                    )}
                    <Text style={styles.userName}>
                        {user?.NOUsuario || user?.NOLoginUsuario || ''}
                    </Text>
                    <Text style={styles.userInfo}>
                        {user?.NOUnidadeOrganizacional || user?.SGUnidade || ''}
                    </Text>
                    <Text style={styles.userInfo}>
                        {user?.NOCargo || ''}
                    </Text>
                </View>
                <DrawerItemList {...props} />
                <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={24} color="#fff"/>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
}

function HomeScreen({navigation}: any) {
    const items = [
        {key: 'minhas', title: 'Minhas Fiscalizações', icon: 'assignment'},
        {key: 'rotina', title: 'Fiscalizações de Rotina', icon: 'sync'},
        {key: 'consultar', title: 'Consultar Autorizadas', icon: 'search'},
        {key: 'andamento', title: 'Em Andamento', icon: 'hourglass-empty'},
        {key: 'empresas', title: 'Painel de Empresas', icon: 'business'},
        {key: 'esquemas', title: 'Esquemas Operacionais', icon: 'schema'},
        {key: 'servicos', title: 'Serviços Não Autorizados', icon: 'report'},
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MaterialIcons name="menu" size={28} color="#fff"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SFISMobile</Text>
                <MaterialIcons name="notifications" size={24} color="#fff"/>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                <Text style={styles.question}>O que deseja fazer hoje?</Text>

                {items.map((item) => (
                    <TouchableOpacity key={item.key} style={styles.card}>
                        <MaterialIcons name={item.icon as any} size={24} color="#0F3C52"/>
                        <Text style={styles.cardText}>{item.title}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#0F3C52"/>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default function HomeFiscalizacao() {
    // ✅ Sem NavigationContainer aqui
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: '#0F3C52',
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="home" color={color} size={size}/>
                    ),
                    drawerLabel: 'Início',
                }}
            />
        </Drawer.Navigator>
    );
}


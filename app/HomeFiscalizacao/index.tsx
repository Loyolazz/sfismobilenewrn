import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { loadSession } from '@/src/services/session';
import type { Servidor } from '@/src/api/usuarioAutenticar';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
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

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.drawerContent}
        >
            <View style={styles.userSection}>
                <MaterialIcons name="person" size={64} color="#fff" />
                <Text style={styles.userName}>
                    {user?.NOUsuario || user?.NOLoginUsuario || ''}
                </Text>
                <Text style={styles.userEmail}>{user?.EEFuncionario || ''}</Text>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

function HomeScreen({ navigation }: any) {
    const items = [
        { key: 'minhas', title: 'Minhas Fiscalizações', icon: 'assignment' },
        { key: 'rotina', title: 'Fiscalizações de Rotina', icon: 'sync' },
        { key: 'consultar', title: 'Consultar Autorizadas', icon: 'search' },
        { key: 'andamento', title: 'Em Andamento', icon: 'hourglass-empty' },
        { key: 'empresas', title: 'Painel de Empresas', icon: 'business' },
        { key: 'esquemas', title: 'Esquemas Operacionais', icon: 'schema' },
        { key: 'servicos', title: 'Serviços Não Autorizados', icon: 'report' },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MaterialIcons name="menu" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SFISMobile</Text>
                <MaterialIcons name="notifications" size={24} color="#fff" />
            </View>
            <Text style={styles.question}>O que deseja fazer hoje?</Text>
            {items.map((item) => (
                <TouchableOpacity key={item.key} style={styles.card}>
                    <MaterialIcons name={item.icon} size={24} color="#0F3C52" />
                    <Text style={styles.cardText}>{item.title}</Text>
                    <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color="#0F3C52"
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

export default function HomeFiscalizacao() {
    return (
        <NavigationContainer independent>
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
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="home" color={color} size={size} />
                        ),
                        drawerLabel: 'Início',
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0F3C52',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    question: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 20,
        color: '#0F3C52',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F1F5',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
    },
    cardText: {
        flex: 1,
        marginLeft: 10,
        color: '#0F3C52',
        fontSize: 16,
        fontWeight: '500',
    },
    drawerContent: {
        flex: 1,
        paddingTop: 0,
    },
    userSection: {
        backgroundColor: '#0F3C52',
        paddingVertical: 20,
        alignItems: 'center',
    },
    userName: {
        marginTop: 10,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userEmail: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
});


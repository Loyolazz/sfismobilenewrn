import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps, DrawerNavigationOptions,
} from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { loadSession, clearSession } from '@/src/services/session';
import type { Servidor } from '@/src/api/usuarioAutenticar';
import styles from './styles';
import MinhasFiscalizacoes from './MinhasFiscalizacoes';
import FiscalizacaoRotina from './FiscalizacaoRotina';
import ConsultarAutorizadas from './ConsultarAutorizadas';
import EmAndamento from './EmAndamento';
import PainelEmpresas from './PainelEmpresas';
import EsquemasOperacionais from './EsquemasOperacionais';
import ServicosNaoAutorizados from './ServicosNaoAutorizados';
import RelatorioUsuario from './RelatorioUsuario';
import Antaq from './Antaq';
import Tutorial from './Tutorial';
import NovidadesVersao from './NovidadesVersao';
import SituacaoServico from './SituacaoServico';
import Notificacoes from './Notificacoes';


const Drawer = createDrawerNavigator();

const defaultScreenOptions = ({ navigation }: any): DrawerNavigationOptions => ({
    headerStyle: { backgroundColor: '#0F3C52' },
    headerTintColor: '#fff',
    headerTitleAlign: 'center' as const,
    drawerActiveTintColor: '#0F3C52',
    headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
    ),
    swipeEnabled: false,
});

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
        <SafeAreaView style={styles.drawerSafe}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
                <View style={styles.userSection}>
                    {user?.Foto ? (
                        <Image
                            source={{ uri: `data:image/png;base64,${user.Foto}` }}
                            style={styles.userAvatar}
                        />
                    ) : (
                        <MaterialIcons name="person" size={48} color="#0F3C52" />
                    )}
                    <Text style={styles.userName}>
                        {user?.NOUsuario || ''}
                    </Text>
                    <Text style={styles.userInfo}>
                        {user?.NOLoginUsuario || ''}
                    </Text>
                </View>
                <DrawerItemList {...props} />
                <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={24} color="#0F3C52"/>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
}

function HomeScreen({navigation}: any) {
    const items = [
        {key: 'MinhasFiscalizacoes', title: 'Minhas Fiscalizações', icon: 'assignment'},
        {key: 'FiscalizacaoRotina', title: 'Fiscalizações de Rotina', icon: 'sync'},
        {key: 'ConsultarAutorizadas', title: 'Consultar Autorizadas', icon: 'search'},
        {key: 'EmAndamento', title: 'Em Andamento', icon: 'hourglass-empty'},
        {key: 'PainelEmpresas', title: 'Painel de Empresas', icon: 'business'},
        {key: 'EsquemasOperacionais', title: 'Esquemas Operacionais', icon: 'schema'},
        {key: 'ServicosNaoAutorizados', title: 'Serviços Não Autorizados', icon: 'report'},
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MaterialIcons name="menu" size={28} color="#fff"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SFISMobile</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
                    <MaterialIcons name="notifications" size={24} color="#fff"/>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                <Text style={styles.question}>O que deseja fazer hoje?</Text>

                {items.map((item) => (
                    <TouchableOpacity key={item.key} style={styles.card} onPress={() => navigation.navigate(item.key)}>
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
            screenOptions={defaultScreenOptions}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    swipeEnabled: true,
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="home" color={color} size={size}/>
                    ),
                    drawerLabel: 'Início',
                }}
            />
            <Drawer.Screen
                name="MinhasFiscalizacoes"
                component={MinhasFiscalizacoes}
                options={{
                    title: 'Minhas Fiscalizações',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="assignment" color={color} size={size} />
                    ),
                    drawerLabel: 'Minhas Fiscalizações',
                }}
            />
            <Drawer.Screen
                name="FiscalizacaoRotina"
                component={FiscalizacaoRotina}
                options={{
                    title: 'Fiscalizações de Rotina',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="sync" color={color} size={size} />
                    ),
                    drawerLabel: 'Rotina',
                }}
            />
            <Drawer.Screen
                name="ConsultarAutorizadas"
                component={ConsultarAutorizadas}
                options={{
                    title: 'Consultar Autorizadas',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="search" color={color} size={size} />
                    ),
                    drawerLabel: 'Consultar Autorizadas',
                }}
            />
            <Drawer.Screen
                name="RelatorioUsuario"
                component={RelatorioUsuario}
                options={{
                    title: 'Relatório do Usuário',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="description" color={color} size={size} />
                    ),
                    drawerLabel: 'Relatório do Usuário',
                }}
            />
            <Drawer.Screen
                name="Antaq"
                component={Antaq}
                options={{
                    title: 'A ANTAQ',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="info" color={color} size={size} />
                    ),
                    drawerLabel: 'A ANTAQ',
                }}
            />
            <Drawer.Screen
                name="Tutorial"
                component={Tutorial}
                options={{
                    title: 'Tutorial',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="menu-book" color={color} size={size} />
                    ),
                    drawerLabel: 'Tutorial',
                }}
            />
            <Drawer.Screen
                name="NovidadesVersao"
                component={NovidadesVersao}
                options={{
                    title: 'Novidades da Versão',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="new-releases" color={color} size={size} />
                    ),
                    drawerLabel: 'Novidades da Versão',
                }}
            />
            <Drawer.Screen
                name="SituacaoServico"
                component={SituacaoServico}
                options={{
                    title: 'Situação do Serviço',
                    drawerIcon: ({color, size}) => (
                        <MaterialIcons name="wifi" color={color} size={size} />
                    ),
                    drawerLabel: 'Situação do Serviço',
                }}
            />
            <Drawer.Screen
                name="EmAndamento"
                component={EmAndamento}
                options={{ title: 'Em Andamento', drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="PainelEmpresas"
                component={PainelEmpresas}
                options={{ title: 'Painel de Empresas', drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="EsquemasOperacionais"
                component={EsquemasOperacionais}
                options={{ title: 'Esquemas Operacionais', drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="ServicosNaoAutorizados"
                component={ServicosNaoAutorizados}
                options={{ title: 'Serviços Não Autorizados', drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen
                name="Notificacoes"
                component={Notificacoes}
                options={{ title: 'Notificações', drawerItemStyle: { display: 'none' } }}
            />
        </Drawer.Navigator>
    );
}


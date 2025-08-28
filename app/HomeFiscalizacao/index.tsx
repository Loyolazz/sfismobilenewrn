// ./app/HomeFiscalizacao/index.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    DrawerContentComponentProps,
    DrawerNavigationOptions,
    DrawerNavigationProp,
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

/** -----------------------------
 *  Tipos
 *  ----------------------------- */
export type DrawerParamList = {
    Home: undefined;
    MinhasFiscalizacoes: undefined;
    FiscalizacaoRotina: undefined;
    ConsultarAutorizadas: undefined;
    RelatorioUsuario: undefined;
    Antaq: undefined;
    Tutorial: undefined;
    NovidadesVersao: undefined;
    SituacaoServico: undefined;
    EmAndamento: undefined;
    PainelEmpresas: undefined;
    EsquemasOperacionais: undefined;
    ServicosNaoAutorizados: undefined;
    Notificacoes: undefined;
};

type HomeScreenNav = DrawerNavigationProp<DrawerParamList, 'Home'>;

const Drawer = createDrawerNavigator<DrawerParamList>();

/** -----------------------------
 *  Helpers
 *  ----------------------------- */
const makeDrawerIcon =
    (name: React.ComponentProps<typeof MaterialIcons>['name']) =>
        ({ color, size }: { color: string; size: number }) =>
            <MaterialIcons name={name} color={color} size={size} />;

const defaultScreenOptions = ({
                                  navigation,
                              }: {
    navigation: DrawerNavigationProp<DrawerParamList>;
}): DrawerNavigationOptions => ({
    headerStyle: { backgroundColor: '#0F3C52' },
    headerTintColor: '#fff',
    headerTitleAlign: 'center',
    drawerActiveTintColor: '#0F3C52',
    headerLeft: () => (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={{ paddingHorizontal: 8 }}
        >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
    ),
    swipeEnabled: false,
});

/** -----------------------------
 *  Drawer Content
 *  ----------------------------- */
function UserAvatar({ user }: { user: Servidor | null }) {
    if (user?.Foto) {
        return (
            <Image
                source={{ uri: `data:image/png;base64,${user.Foto}` }}
                style={styles.userAvatar}
            />
        );
    }
    return <MaterialIcons name="person" size={48} color="#0F3C52" />;
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
    const router = useRouter();
    const [user, setUser] = useState<Servidor | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const session = await loadSession();
                if (mounted) setUser(session?.usuario ?? null);
            } catch {
                if (mounted) setUser(null);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const handleLogout = useCallback(async () => {
        await clearSession();
        router.replace('/Login');
    }, [router]);

    return (
        <SafeAreaView style={styles.drawerSafe}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
                <View style={styles.userSection}>
                    <UserAvatar user={user} />
                    <Text style={styles.userName}>{user?.NOUsuario ?? ''}</Text>
                    <Text style={styles.userInfo}>{user?.NOLoginUsuario ?? ''}</Text>
                </View>

                <DrawerItemList {...props} />

                <TouchableOpacity
                    style={styles.logout}
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel="Sair da conta"
                >
                    <MaterialIcons name="logout" size={24} color="#0F3C52" />
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
}

/** -----------------------------
 *  Home
 *  ----------------------------- */
function HomeScreen({ navigation }: { navigation: HomeScreenNav }) {
    const items = useMemo(
        () =>
            ([
                { key: 'MinhasFiscalizacoes', title: 'Minhas Fiscalizações', icon: 'assignment' },
                { key: 'FiscalizacaoRotina', title: 'Fiscalizações de Rotina', icon: 'sync' },
                { key: 'ConsultarAutorizadas', title: 'Consultar Autorizadas', icon: 'search' },
                { key: 'EmAndamento', title: 'Em Andamento', icon: 'hourglass-empty' },
                { key: 'PainelEmpresas', title: 'Painel de Empresas', icon: 'business' },
                { key: 'EsquemasOperacionais', title: 'Esquemas Operacionais', icon: 'schema' },
                { key: 'ServicosNaoAutorizados', title: 'Serviços Não Autorizados', icon: 'report' },
            ] as const),
        []
    );

    const openDrawer = useCallback(() => navigation.openDrawer(), [navigation]);
    const goToNotificacoes = useCallback(
        () => navigation.navigate('Notificacoes'),
        [navigation]
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>

                <TouchableOpacity onPress={openDrawer} accessibilityLabel="Abrir menu">
                    <MaterialIcons name="menu" size={28} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>SFISMobile</Text>

                <TouchableOpacity onPress={goToNotificacoes} accessibilityLabel="Notificações">
                    <MaterialIcons name="notifications" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                <Text style={styles.question}>O que deseja fazer hoje?</Text>

                {items.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        style={styles.card}
                        onPress={() => navigation.navigate(item.key as keyof DrawerParamList)}
                        accessibilityRole="button"
                        accessibilityLabel={item.title}
                    >
                        <MaterialIcons name={item.icon as any} size={24} color="#0F3C52" />
                        <Text style={styles.cardText}>{item.title}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#0F3C52" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

/** -----------------------------
 *  Navigator
 *  ----------------------------- */
export default function HomeFiscalizacao() {
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
                    drawerIcon: makeDrawerIcon('home'),
                    drawerLabel: 'Início',
                }}
            />

            <Drawer.Screen
                name="MinhasFiscalizacoes"
                component={MinhasFiscalizacoes}
                options={{
                    title: 'Minhas Fiscalizações',
                    drawerIcon: makeDrawerIcon('assignment'),
                    drawerLabel: 'Minhas Fiscalizações',
                }}
            />
            <Drawer.Screen
                name="FiscalizacaoRotina"
                component={FiscalizacaoRotina}
                options={{
                    title: 'Fiscalizações de Rotina',
                    drawerIcon: makeDrawerIcon('sync'),
                    drawerLabel: 'Rotina',
                }}
            />
            <Drawer.Screen
                name="ConsultarAutorizadas"
                component={ConsultarAutorizadas}
                options={{
                    title: 'Consultar Autorizadas',
                    drawerIcon: makeDrawerIcon('search'),
                    drawerLabel: 'Consultar Autorizadas',
                }}
            />
            <Drawer.Screen
                name="RelatorioUsuario"
                component={RelatorioUsuario}
                options={{
                    title: 'Relatório do Usuário',
                    drawerIcon: makeDrawerIcon('description'),
                    drawerLabel: 'Relatório do Usuário',
                }}
            />
            <Drawer.Screen
                name="Antaq"
                component={Antaq}
                options={{
                    title: 'A ANTAQ',
                    drawerIcon: makeDrawerIcon('info'),
                    drawerLabel: 'A ANTAQ',
                }}
            />
            <Drawer.Screen
                name="Tutorial"
                component={Tutorial}
                options={{
                    title: 'Tutorial',
                    drawerIcon: makeDrawerIcon('menu-book'),
                    drawerLabel: 'Tutorial',
                }}
            />
            <Drawer.Screen
                name="NovidadesVersao"
                component={NovidadesVersao}
                options={{
                    title: 'Novidades da Versão',
                    drawerIcon: makeDrawerIcon('new-releases'),
                    drawerLabel: 'Novidades da Versão',
                }}
            />
            <Drawer.Screen
                name="SituacaoServico"
                component={SituacaoServico}
                options={{
                    title: 'Situação do Serviço',
                    drawerIcon: makeDrawerIcon('wifi'),
                    drawerLabel: 'Situação do Serviço',
                }}
            />

            {/* Rotas “ocultas” no Drawer */}
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

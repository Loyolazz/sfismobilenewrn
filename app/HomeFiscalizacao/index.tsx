import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
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
import Icon from '@/src/components/Icon';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadSession, clearSession } from '@/src/services/session';
import { listarMensagensPush } from '@/src/api/notificacoes';
import type { Servidor } from '@/src/api/usuarioAutenticar';
import styles from './styles';
import { getUltimaVersao } from '@/src/utils/releases';

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
    Home: { showReleases?: string | string[] } | undefined;
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
    (name: React.ComponentProps<typeof Icon>['name']) =>
        ({ color, size }: { color: string; size: number }) => (
            <Icon name={name} color={color} size={size} />
        );

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
            <Icon name="arrow-back" size={24} color="#fff" />
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
    return <Icon name="person" size={48} color="#0F3C52" />;
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
                    {user?.NRMatricula ? (
                        <Text style={styles.userExtra}>Matrícula: {user.NRMatricula}</Text>
                    ) : null}
                    {user?.EEFuncionario ? (
                        <Text style={styles.userExtra}>{user.EEFuncionario}</Text>
                    ) : null}
                </View>

                <DrawerItemList {...props} />

                <TouchableOpacity
                    style={styles.logout}
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel="Sair da conta"
                >
                    <Icon name="logout" size={24} color="#0F3C52" />
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
}

/** -----------------------------
 *  Home
 *  ----------------------------- */
function HomeScreen({ navigation, route }: { navigation: HomeScreenNav; route: any }) {
    const [hasUnread, setHasUnread] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const session = await loadSession();
                const idPerfil = session?.usuario?.IDPerfilFiscalizacao;
                if (!idPerfil) return;
                const msgs = await listarMensagensPush(idPerfil);
                setHasUnread(msgs.some((m) => m.STAtivo === '1'));
            } catch {
                setHasUnread(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const session = await loadSession();
            if (!session) return;
            const diff = session.expiresAt - Date.now();
            if (diff <= 0) return;
            const day = 24 * 60 * 60 * 1000;
            const days = Math.floor(diff / day);
            const hours = Math.floor((diff % day) / (60 * 60 * 1000));
            setTimeLeft(`${days}d ${hours}h`);
        })();
    }, []);

    useEffect(() => {
        if (route?.params?.showReleases) {
            setShowModal(true);
        }
    }, [route?.params?.showReleases]);

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

    const closeModal = useCallback(() => {
        setShowModal(false);
        navigation.setParams({ showReleases: undefined });
    }, [navigation]);

    const ultima = getUltimaVersao();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>

                <TouchableOpacity onPress={openDrawer} accessibilityLabel="Abrir menu">
                    <Icon name="menu" size={28} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>SFISMobile</Text>

                <TouchableOpacity onPress={goToNotificacoes} accessibilityLabel="Notificações">
                    <Icon
                        name={hasUnread ? 'notifications-unread' : 'notifications'}
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                <Text style={styles.sessionInfo}>Tempo restante de sessão: {timeLeft}</Text>
                <Text style={styles.question}>O que deseja fazer hoje?</Text>

                {items.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        style={styles.card}
                        onPress={() => navigation.navigate(item.key as keyof DrawerParamList)}
                        accessibilityRole="button"
                        accessibilityLabel={item.title}
                    >
                        <Icon name={item.icon as any} size={24} color="#0F3C52" />
                        <Text style={styles.cardText}>{item.title}</Text>
                        <Icon name="chevron-right" size={24} color="#0F3C52" />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{ultima.versao}</Text>
                        {ultima.novidades.map((n, i) => (
                            <Text key={i} style={styles.modalItem}>• {n}</Text>
                        ))}
                        <TouchableOpacity onPress={closeModal} style={styles.modalButton} accessibilityRole="button" accessibilityLabel="Fechar">
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/** -----------------------------
 *  Navigator
 *  ----------------------------- */
export default function HomeFiscalizacao() {
    const params = useLocalSearchParams();
    return (
        <Drawer.Navigator
            screenOptions={defaultScreenOptions}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ showReleases: params.showReleases }}
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
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="FiscalizacaoRotina"
                component={FiscalizacaoRotina}
                options={{
                    title: 'Fiscalizações de Rotina',
                    drawerIcon: makeDrawerIcon('sync'),
                    drawerLabel: 'Rotina',
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="ConsultarAutorizadas"
                component={ConsultarAutorizadas}
                options={{
                    title: 'Consultar Autorizadas',
                    drawerIcon: makeDrawerIcon('search'),
                    drawerLabel: 'Consultar Autorizadas',
                    drawerItemStyle: { display: 'none' },
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

import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
    DrawerNavigationOptions,
    DrawerNavigationProp,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';

import Icon from '@/src/components/Icon';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadSession, clearSession } from '@/src/services/session';
import type { Servidor } from '@/src/api/usuarioAutenticar';
import styles, { CARD_GRADIENT } from './styles';
import { getUltimaVersao } from '@/src/utils/releases';
import theme from '@/src/theme';

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

/* -------------------------------- Helpers -------------------------------- */
const makeDrawerIcon =
    (name: React.ComponentProps<typeof Icon>['name']) =>
        ({ color, size }: { color: string; size: number }) =>
            <Icon name={name} color={color} size={size} />;

const defaultScreenOptions = ({
                                  navigation,
                              }: {
    navigation: DrawerNavigationProp<DrawerParamList>;
}): DrawerNavigationOptions => ({
    headerStyle: { backgroundColor: theme.colors.primaryDark },
    headerTintColor: theme.colors.surface,
    headerTitleAlign: 'center',
    drawerActiveTintColor: theme.colors.primaryDark,
    headerLeft: () => (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={{ paddingHorizontal: 8 }}
        >
            <Icon name="arrow-back" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
    ),
    swipeEnabled: false,
});

/* --------------------------- Drawer custom content ------------------------ */
function UserAvatar({ user }: { user: Servidor | null }) {
    if (user?.Foto) {
        return (
            <Image
                source={{ uri: `data:image/png;base64,${user.Foto}` }}
                style={styles.userAvatar}
            />
        );
    }
    return <Icon name="person" size={48} color={theme.colors.primaryDark} />;
}

function CustomDrawerContent(props: any) {
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
                    <Icon name="logout" size={24} color={theme.colors.primaryDark} />
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
}

/* ---------------------------------- Home --------------------------------- */
function HomeScreen({ navigation, route }: { navigation: HomeScreenNav; route: any }) {
    const [userName, setUserName] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            const s = await loadSession();
            const first = s?.usuario?.NOUsuario?.split(' ')?.[0] ?? '';
            setUserName(first.toUpperCase());
        })();
    }, []);

    useEffect(() => {
        if (route?.params?.showReleases) setShowModal(true);
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
    const closeModal = useCallback(() => {
        setShowModal(false);
        navigation.setParams({ showReleases: undefined });
    }, [navigation]);

    // corrige duplicação "Versão WS: Versão 1.2.11"
    const ultima = getUltimaVersao();
    const versaoStr = String(ultima?.versao ?? '—').replace(/^vers[aã]o\s*/i, '');

    // @ts-ignore
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header próprio como na IMAGEM 1 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} accessibilityLabel="Abrir menu">
                    <Icon name="menu" size={28} color={theme.colors.surface} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Início</Text>

                {/* Espaço para manter o título central */}
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                <View style={styles.greetingBox}>
                    <Text style={styles.greetingText}>
                        Olá, <Text style={styles.greetingStrong}>{userName || 'FISCAL'}</Text>!
                    </Text>
                    <Text style={styles.greetingSub}>O que deseja fazer hoje?</Text>
                </View>

                <View style={styles.grid}>
                    {items.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            style={styles.tileWrapper}
                            onPress={() => navigation.navigate(item.key as any)}
                            accessibilityRole="button"
                            accessibilityLabel={item.title}
                        >
                            <LinearGradient
                                colors={CARD_GRADIENT}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.tile}
                            >
                                <View style={styles.tileIconWrap}>
                                    <Icon name={item.icon as any} size={28} color="#fff" />
                                </View>
                                <Text style={styles.tileText}>{item.title}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.versionText}>Versão WS: {versaoStr}</Text>
            </ScrollView>

            {/* Modal de novidades (mantido) */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{ultima?.versao}</Text>
                        {ultima?.novidades?.map((n: string, i: number) => (
                            <Text key={i} style={styles.modalItem}>• {n}</Text>
                        ))}
                        <TouchableOpacity
                            onPress={closeModal}
                            style={styles.modalButton}
                            accessibilityRole="button"
                            accessibilityLabel="Fechar"
                        >
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/* ------------------------------ Navigator ------------------------------- */
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
                    drawerItemStyle: { display: 'none' },
                }}
            />
            <Drawer.Screen
                name="ConsultarAutorizadas"
                component={ConsultarAutorizadas}
                options={{
                    title: 'Consultar Autorizadas',
                    drawerIcon: makeDrawerIcon('search'),
                    drawerItemStyle: { display: 'none' },
                }}
            />

            {/* Conteúdo do Drawer (mantido) */}
            <Drawer.Screen
                name="RelatorioUsuario"
                component={RelatorioUsuario}
                options={{ title: 'Relatório do Usuário', drawerIcon: makeDrawerIcon('description') }}
            />
            <Drawer.Screen
                name="Antaq"
                component={Antaq}
                options={{ title: 'A ANTAQ', drawerIcon: makeDrawerIcon('info') }}
            />
            <Drawer.Screen
                name="Tutorial"
                component={Tutorial}
                options={{ title: 'Tutorial', drawerIcon: makeDrawerIcon('menu-book') }}
            />
            <Drawer.Screen
                name="NovidadesVersao"
                component={NovidadesVersao}
                options={{ title: 'Novidades da Versão', drawerIcon: makeDrawerIcon('new-releases') }}
            />
            <Drawer.Screen
                name="SituacaoServico"
                component={SituacaoServico}
                options={{ title: 'Situação do Serviço', drawerIcon: makeDrawerIcon('wifi') }}
            />

            {/* Rotas ocultas */}
            <Drawer.Screen name="EmAndamento" component={EmAndamento} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="PainelEmpresas" component={PainelEmpresas} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="EsquemasOperacionais" component={EsquemasOperacionais} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="ServicosNaoAutorizados" component={ServicosNaoAutorizados} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Notificacoes" component={Notificacoes} options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer.Navigator>
    );
}

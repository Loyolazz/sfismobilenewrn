import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerNavigationOptions,
    DrawerNavigationProp,
} from '@react-navigation/drawer';
import {LinearGradient} from 'expo-linear-gradient';
import {StatusBar} from 'expo-status-bar';

import Icon from '@/src/components/Icon';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {loadSession, clearSession} from '@/src/services/session';
import type {Servidor} from '@/src/api/usuarioAutenticar';
import styles, {CARD_GRADIENT, DRAWER_BANNER_GRADIENT} from './styles';
import {getUltimaVersao} from '@/src/utils/releases';
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
        ({color, size}: { color: string; size: number }) =>
            <Icon name={name} color={color} size={size}/>;

const defaultScreenOptions = ({
                                  navigation,
                              }: {
    navigation: DrawerNavigationProp<DrawerParamList>;
}): DrawerNavigationOptions => ({
    headerStyle: {backgroundColor: theme.colors.primaryDark},
    headerTintColor: theme.colors.surface,
    headerTitleAlign: 'center',
    drawerActiveTintColor: theme.colors.primaryDark,
    headerLeft: () => (
        <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={{paddingHorizontal: 8, height: 40, width: 40, alignItems: 'center', justifyContent: 'center'}}
            android_ripple={{color: 'rgba(255,255,255,0.15)', radius: 20}}
            hitSlop={8}
        >
            <Icon name="arrow-back" size={24} color={theme.colors.surface}/>
        </Pressable>
    ),
    swipeEnabled: false,
});

/* --------------------------- Drawer custom content (NOVO) --------------------------- */
function CustomDrawerContent(props: any) {
    const router = useRouter();
    const [user, setUser] = useState<Servidor | null>(null);

    const logoAntaq = require('@/assets/icon/logo-navbar.png');

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

    const unidade = (user as any)?.NOUnidade || (user as any)?.Unidade || '';
    const perfilId = (user as any)?.IDPerfilFiscalizacao;
    const noUnidOrg = (user as any)?.NOUnidadeOrganizacional || '';
    const perfil =
        typeof perfilId === 'number'
            ? ({1: 'Administrador', 2: 'Coordenador', 3: 'Fiscal'} as any)[perfilId] || `Perfil #${perfilId}`
            : '';

    return (
        <SafeAreaView style={styles.drawerSafe}>
            <StatusBar style="light"/>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScrollContent}>
                {/* Banner */}
                <LinearGradient colors={DRAWER_BANNER_GRADIENT} style={styles.drawerBanner}>
                    <View style={styles.drawerBannerTop}>
                        <Image source={logoAntaq} style={styles.drawerLogo} resizeMode="contain"/>
                    </View>

                    <View style={styles.drawerHeaderRow}>
                        {user?.Foto ? (
                            <Image
                                source={{uri: `data:image/png;base64,${user.Foto}`}}
                                style={styles.drawerAvatar}
                            />
                        ) : (
                            <View style={styles.drawerAvatarFallback}>
                                <Icon name="person" size={28} color={theme.colors.primaryDark}/>
                            </View>
                        )}

                        <View style={styles.drawerHeaderText}>
                            <Text style={styles.drawerName} numberOfLines={1}>
                                {(user?.NOUsuario || '').toUpperCase()}
                            </Text>
                            <Text style={styles.drawerEmail} numberOfLines={1}>
                                {user?.EEFuncionario || user?.NOLoginUsuario || ''}
                            </Text>

                            <View style={styles.drawerChipsRow}>
                                {!!user?.NRMatricula && (
                                    <View style={styles.drawerChip}>
                                        <Icon name="badge" size={14} color="#0A2647"/>
                                        <Text style={styles.drawerChipText}>Matrícula {user.NRMatricula}</Text>
                                    </View>
                                )}
                                {!!unidade && (
                                    <View style={styles.drawerChip}>
                                        <Icon name="home-work" size={14} color="#0A2647"/>
                                        <Text style={styles.drawerChipText}>{unidade}</Text>
                                    </View>
                                )}
                                {!!perfil && (
                                    <View style={styles.drawerChip}>
                                        <Icon name="verified-user" size={14} color="#0A2647"/>
                                        <Text style={styles.drawerChipText}>{noUnidOrg}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Lista de itens — renderiza só quando o state existir */}
                <View style={styles.drawerListCard}>
                    {props?.state?.routes ? <DrawerItemList {...props} /> : null}
                </View>
            </DrawerContentScrollView>
            <View style={styles.drawerFooter}>
                <Pressable
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel="Sair da conta"
                    style={styles.logoutPill}
                    android_ripple={{color: 'rgba(10,38,71,0.12)', radius: 28}}
                >
                    <Icon name="logout" size={20} color={theme.colors.primaryDark}/>
                    <Text style={styles.logoutPillText}>Sair</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

/* ---------------------------------- Home --------------------------------- */
function HomeScreen({navigation, route}: { navigation: HomeScreenNav; route: any }) {
    const insets = useSafeAreaInsets();
    const [userName, setUserName] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            const s = await loadSession();
            const first = s?.usuario?.NOUsuario?.split(' ')?.[0] ?? '';
            setUserName((first || 'Fiscal').toUpperCase());
        })();
    }, []);

    useEffect(() => {
        if (route?.params?.showReleases) setShowModal(true);
    }, [route?.params?.showReleases]);

    type Item = { key: keyof DrawerParamList; title: string; icon: string };
    const items: Item[] = useMemo(
        () => [
            {key: 'MinhasFiscalizacoes', title: 'Minhas Fiscalizações', icon: 'assignment'},
            {key: 'FiscalizacaoRotina', title: 'Fiscalizações de Rotina', icon: 'sync'},
            {key: 'ConsultarAutorizadas', title: 'Consultar Autorizadas', icon: 'search'},
            {key: 'EmAndamento', title: 'Em Andamento', icon: 'hourglass-empty'},
            {key: 'PainelEmpresas', title: 'Painel de Empresas', icon: 'business'},
            {key: 'EsquemasOperacionais', title: 'Esquemas Operacionais', icon: 'schema'},
            {key: 'ServicosNaoAutorizados', title: 'Serviços Não Autorizados', icon: 'report'},
        ],
        []
    );

    const openDrawer = useCallback(() => navigation.openDrawer(), [navigation]);
    const closeModal = useCallback(() => {
        setShowModal(false);
        navigation.setParams({showReleases: undefined});
    }, [navigation]);

    const ultima = getUltimaVersao();
    const versaoStr = String(ultima?.versao ?? '—').replace(/^vers[aã]o\s*/i, '');

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar style="light"/>

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={openDrawer}
                    accessibilityLabel="Abrir menu"
                    accessibilityRole="button"
                    style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
                    android_ripple={{color: 'rgba(255,255,255,0.15)', radius: 20}}
                    hitSlop={8}
                >
                    <Icon name="menu" size={28} color={theme.colors.surface}/>
                </Pressable>

                <Text style={styles.headerTitle}>Início</Text>
                <View style={{width: 40, height: 40}}/>
            </View>

            {/* Saudação */}
            <View style={styles.greetingBox}>
                <Text style={styles.greetingText}>
                    Olá, <Text style={styles.greetingStrong}>{userName}</Text>!
                </Text>
                <Text style={styles.greetingSub}>O que deseja fazer hoje?</Text>
            </View>

            {/* Conteúdo */}
            <ScrollView
                style={styles.scroll}
                contentInsetAdjustmentBehavior="never"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.scrollContent,
                    {paddingBottom: insets.bottom + 16},
                ]}
            >
                <View style={styles.section}>
                    <View style={styles.grid}>
                        {(items ?? []).map((item) => (
                            <Pressable
                                key={item.key as string}
                                onPress={() => navigation.navigate(item.key as any)}
                                accessibilityRole="button"
                                accessibilityLabel={`Abrir ${item.title}`}
                                android_ripple={{color: 'rgba(255,255,255,0.08)'}}
                                style={({pressed}) => [{opacity: pressed ? 0.96 : 1}, styles.tileWrapper]}
                                hitSlop={8}
                                testID={`tile-${item.key as string}`}
                            >
                                <LinearGradient
                                    colors={CARD_GRADIENT}
                                    start={{x: 0, y: 0}}
                                    end={{x: 0, y: 1}}
                                    style={styles.tile}
                                >
                                    <View style={styles.tileIconWrap}>
                                        <Icon name={item.icon as any} size={44} color="#fff"/>
                                    </View>
                                    <Text style={styles.tileText}>{item.title}</Text>
                                </LinearGradient>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.versionText}>Versão WS: {versaoStr}</Text>
                </View>
            </ScrollView>

            {/* Modal de novidades */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{ultima?.versao}</Text>
                        {(ultima?.novidades ?? []).map((n: string, i: number) => (
                            <Text key={i} style={styles.modalItem}>
                                • {n}
                            </Text>
                        ))}
                        <Pressable
                            onPress={closeModal}
                            style={styles.modalButton}
                            accessibilityRole="button"
                            accessibilityLabel="Fechar"
                        >
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </Pressable>
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
                initialParams={{showReleases: params.showReleases}}
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
                    drawerItemStyle: {display: 'none'},
                }}
            />
            <Drawer.Screen
                name="FiscalizacaoRotina"
                component={FiscalizacaoRotina}
                options={{
                    title: 'Fiscalizações de Rotina',
                    drawerIcon: makeDrawerIcon('sync'),
                    drawerItemStyle: {display: 'none'},
                }}
            />
            <Drawer.Screen
                name="ConsultarAutorizadas"
                component={ConsultarAutorizadas}
                options={{
                    title: 'Consultar Autorizadas',
                    drawerIcon: makeDrawerIcon('search'),
                    drawerItemStyle: {display: 'none'},
                }}
            />

            {/* Itens exibidos no Drawer */}
            <Drawer.Screen
                name="RelatorioUsuario"
                component={RelatorioUsuario}
                options={{title: 'Relatório do Usuário', drawerIcon: makeDrawerIcon('description')}}
            />
            <Drawer.Screen
                name="Antaq"
                component={Antaq}
                options={{title: 'A ANTAQ', drawerIcon: makeDrawerIcon('info')}}
            />
            <Drawer.Screen
                name="Tutorial"
                component={Tutorial}
                options={{title: 'Tutorial', drawerIcon: makeDrawerIcon('menu-book')}}
            />
            <Drawer.Screen
                name="NovidadesVersao"
                component={NovidadesVersao}
                options={{title: 'Novidades da Versão', drawerIcon: makeDrawerIcon('new-releases')}}
            />
            <Drawer.Screen
                name="SituacaoServico"
                component={SituacaoServico}
                options={{title: 'Situação do Serviço', drawerIcon: makeDrawerIcon('wifi')}}
            />

            {/* Rotas ocultas */}
            <Drawer.Screen name="EmAndamento" component={EmAndamento} options={{drawerItemStyle: {display: 'none'}}}/>
            <Drawer.Screen name="PainelEmpresas" component={PainelEmpresas}
                           options={{drawerItemStyle: {display: 'none'}}}/>
            <Drawer.Screen name="EsquemasOperacionais" component={EsquemasOperacionais}
                           options={{drawerItemStyle: {display: 'none'}}}/>
            <Drawer.Screen name="ServicosNaoAutorizados" component={ServicosNaoAutorizados}
                           options={{drawerItemStyle: {display: 'none'}}}/>
            <Drawer.Screen name="Notificacoes" component={Notificacoes} options={{drawerItemStyle: {display: 'none'}}}/>
        </Drawer.Navigator>
    );
}

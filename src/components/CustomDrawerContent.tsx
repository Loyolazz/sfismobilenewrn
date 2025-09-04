import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';

import Icon from '@/src/components/Icon';
import { useRouter } from 'expo-router';
import { loadSession, clearSession } from '@/src/services/session';
import type { Servidor } from '@/src/api/usuarioAutenticar';
import styles, { DRAWER_BANNER_GRADIENT } from '../../app/HomeFiscalizacao/styles';
import theme from '@/src/theme';

export default function CustomDrawerContent(props: any) {
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
        return () => { mounted = false; };
    }, []);

    const handleLogout = useCallback(async () => {
        await clearSession();
        router.replace('/Login');
    }, [router]);

    const nome = (user?.NOUsuario || '').toUpperCase();
    const login = user?.EEFuncionario || user?.NOLoginUsuario || '';
    const unidade =
        (user as any)?.SGUnidade ||
        (user as any)?.NOUnidade ||
        (user as any)?.Unidade ||
        '';
    const matricula = user?.NRMatricula ? `Matrícula ${user.NRMatricula}` : '';

    return (
        <SafeAreaView style={styles.drawerSafe}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.drawerScrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Banner */}
                <LinearGradient colors={DRAWER_BANNER_GRADIENT} style={styles.drawerBanner}>
                    {/* shapes decorativos */}
                    <View style={styles.drawerDecorA} />
                    <View style={styles.drawerDecorB} />

                    {/* topo com logo */}
                    <View style={styles.drawerBannerTop}>
                        <Image source={logoAntaq} style={styles.drawerLogo} resizeMode="contain" />
                    </View>

                    {/* cabeçalho do usuário */}
                    <View style={styles.drawerHeaderRow}>
                        {/* avatar com “anel” */}
                        <View style={styles.drawerAvatarRing}>
                            {user?.Foto ? (
                                <Image
                                    source={{ uri: `data:image/png;base64,${user.Foto}` }}
                                    style={styles.drawerAvatar}
                                />
                            ) : (
                                <View style={styles.drawerAvatarFallback}>
                                    <Icon name="person" size={28} color={theme.colors.primaryDark} />
                                </View>
                            )}
                        </View>

                        <View style={styles.drawerHeaderText}>
                            <View style={styles.drawerNameRow}>
                                <Text style={styles.drawerName} numberOfLines={1}  ellipsizeMode="tail">
                                    {nome}
                                </Text>
                            </View>

                            {/* Unidade/UGA em pílula grande */}
                            {!!unidade && (
                                <View style={styles.unidadePill}>
                                    <Icon name="home-work" size={16} color="#0A2647"/>
                                    <Text style={styles.unidadePillText} numberOfLines={1} ellipsizeMode="tail">
                                        {unidade}
                                    </Text>
                                </View>
                            )}

                            {/* chips compactos */}
                            <View style={styles.drawerChipsRow}>
                                {!!matricula && (
                                    <View style={styles.drawerChipSm}>
                                        <Icon name="badge" size={13} color="#0A2647" />
                                        <Text style={styles.drawerChipSmText}>{matricula}</Text>
                                    </View>
                                )}
                                {!!login && (
                                    <View style={styles.drawerChipSm}>
                                        <Icon name="account-circle" size={13} color="#0A2647" />
                                        <Text style={styles.drawerChipSmText} numberOfLines={1} ellipsizeMode="tail">
                                            {login}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Lista de itens (só quando state existir) */}
                <View style={styles.drawerListCard}>
                    {props?.state?.routes ? <DrawerItemList {...props} /> : null}
                </View>
            </DrawerContentScrollView>

            {/* Rodapé / Sair */}
            <View style={styles.drawerFooter}>
                <Pressable
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel="Sair da conta"
                    style={styles.logoutPill}
                    android_ripple={{ color: 'rgba(10,38,71,0.12)', radius: 28 }}
                >
                    <Icon name="logout" size={20} color={theme.colors.primaryDark} />
                    <Text style={styles.logoutPillText}>Sair</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

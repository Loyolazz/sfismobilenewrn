import { StyleSheet } from 'react-native';
import theme from '@/src/theme';

export const CARD_GRADIENT = ['#0B3556', '#153D5D'];

const styles = StyleSheet.create({
    /* ------ áreas gerais ------ */
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background ?? '#F2F4F7',
    },
    scroll: { flex: 1 },
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    /* ------ header (escuro, título central) ------ */
    header: {
        height: 56,
        backgroundColor: theme.colors.primaryDark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerTitle: {
        color: theme.colors.surface,
        fontSize: 18,
        fontWeight: '600',
    },

    /* ------ greeting ------ */
    greetingBox: {
        backgroundColor: '#0B3556',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        marginBottom: 16,
    },
    greetingText: {
        color: '#E8F1F8',
        fontSize: 20,
        fontWeight: '500',
    },
    greetingStrong: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    greetingSub: {
        color: '#C8D7E4',
        marginTop: 6,
        fontSize: 14,
    },

    /* ------ grid 2×1 de cards ------ */
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tileWrapper: {
        width: '48%',
        marginBottom: 16,
    },
    tile: {
        height: 180,
        borderRadius: 18,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        // sombra leve
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    tileIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    tileText: {
        color: '#FFFFFF',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '600',
        textAlign: 'center',
    },

    /* ------ rodapé versão ------ */
    versionText: {
        textAlign: 'center',
        color: '#A0A8B2',
        marginTop: 8,
    },

    /* ------ drawer ------ */
    drawerSafe: { flex: 1 },
    drawerContent: { paddingBottom: 24 },
    userSection: {
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E6E9EE',
        marginBottom: 8,
    },
    userAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 8,
    },
    userName: { fontWeight: '700', fontSize: 16, color: '#0B1F33' },
    userInfo: { color: '#4B5B70', marginTop: 2 },
    userExtra: { color: '#64748B', fontSize: 12, marginTop: 2 },

    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 8,
    },
    logoutText: {
        color: theme.colors.primaryDark,
        fontWeight: '600',
    },

    /* ------ modal novidades ------ */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 14,
        width: '100%',
        padding: 16,
    },
    modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
    modalItem: { fontSize: 14, marginBottom: 4, color: '#2C3E50' },
    modalButton: {
        marginTop: 12,
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: theme.colors.primaryDark,
        borderRadius: 10,
    },
    modalButtonText: { color: '#fff', fontWeight: '600' },
});

export default styles;

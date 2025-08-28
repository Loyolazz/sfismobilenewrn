import { StyleSheet } from 'react-native';
import theme from '@/src/theme';
import { scale, verticalScale } from '@/src/utils/responsive';

export const CARD_GRADIENT = [theme.colors.primary, theme.colors.primaryDark];

const styles = StyleSheet.create({
    /* ------ áreas gerais ------ */
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background ?? '#F2F4F7',
    },
    scroll: { flex: 1 },
    container: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
    },

    /* ------ header (escuro, título central) ------ */
    header: {
        height: verticalScale(56),
        backgroundColor: theme.colors.primaryDark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
    },
    headerTitle: {
        color: theme.colors.surface,
        fontSize: scale(18),
        fontWeight: '600',
    },

    /* ------ greeting ------ */
    greetingBox: {
        backgroundColor: theme.colors.primary,
        borderBottomLeftRadius: theme.radius.md,
        borderBottomRightRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    greetingText: {
        color: '#E8F1F8',
        fontSize: scale(20),
        fontWeight: '500',
    },
    greetingStrong: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    greetingSub: {
        color: '#C8D7E4',
        marginTop: theme.spacing.xs,
        fontSize: theme.typography.body.fontSize,
    },

    /* ------ grid 2×1 de cards ------ */
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tileWrapper: {
        width: '48%',
        marginBottom: theme.spacing.md,
    },
    tile: {
        height: verticalScale(180),
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
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
        width: scale(56),
        height: scale(56),
        borderRadius: scale(28),
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    tileText: {
        color: '#FFFFFF',
        fontSize: scale(18),
        lineHeight: scale(22),
        fontWeight: '600',
        textAlign: 'center',
    },

    /* ------ rodapé versão ------ */
    versionText: {
        textAlign: 'center',
        color: '#A0A8B2',
        marginTop: theme.spacing.sm,
    },

    /* ------ drawer ------ */
    drawerSafe: { flex: 1 },
    drawerContent: { paddingBottom: theme.spacing.lg },
    userSection: {
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E6E9EE',
        marginBottom: theme.spacing.sm,
    },
    userAvatar: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        marginBottom: theme.spacing.sm,
    },
    userName: { fontWeight: '700', fontSize: scale(16), color: '#0B1F33' },
    userInfo: { color: '#4B5B70', marginTop: scale(2) },
    userExtra: { color: '#64748B', fontSize: scale(12), marginTop: scale(2) },

    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginTop: theme.spacing.sm,
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
        padding: theme.spacing.lg,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: theme.radius.md,
        width: '100%',
        padding: theme.spacing.md,
    },
    modalTitle: { fontSize: scale(16), fontWeight: '700', marginBottom: theme.spacing.sm },
    modalItem: { fontSize: scale(14), marginBottom: theme.spacing.xs, color: '#2C3E50' },
    modalButton: {
        marginTop: theme.spacing.md,
        alignSelf: 'flex-end',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.primaryDark,
        borderRadius: theme.radius.md,
    },
    modalButtonText: { color: '#fff', fontWeight: '600' },
});

export default styles;

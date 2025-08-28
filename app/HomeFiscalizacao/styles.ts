import { StyleSheet } from 'react-native';
import theme from '@/src/theme';

const { colors } = theme;

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryDark,
    },
    drawerSafe: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    scroll: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    container: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        color: colors.surface,
        fontSize: 18,
        fontWeight: 'bold',
    },
    question: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 20,
        color: colors.primaryDark,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
    },
    cardText: {
        flex: 1,
        marginLeft: 10,
        color: colors.primaryDark,
        fontSize: 16,
        fontWeight: '500',
    },
    drawerContent: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: colors.surface,
    },
    userSection: {
        paddingVertical: 24,
        alignItems: 'center',
        backgroundColor: colors.surfaceAlt,
    },
    userAvatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: 12,
    },
    userName: {
        color: colors.primaryDark,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userInfo: {
        color: colors.primaryDark,
        fontSize: 12,
        textAlign: 'center',
    },
    userExtra: {
        color: colors.primaryDark,
        fontSize: 12,
        textAlign: 'center',
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    logoutText: {
        color: colors.primaryDark,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    sessionInfo: {
        textAlign: 'center',
        color: colors.primaryDark,
        marginTop: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 20,
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primaryDark,
        marginBottom: 8,
    },
    modalItem: {
        color: colors.primaryDark,
        marginBottom: 4,
    },
    modalButton: {
        marginTop: 16,
        alignSelf: 'flex-end',
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    modalButtonText: {
        color: colors.surface,
        fontWeight: 'bold',
    },
});


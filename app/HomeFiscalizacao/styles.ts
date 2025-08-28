import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F3C52',
    },
    drawerSafe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
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
        paddingTop: 22,
        backgroundColor: '#fff',
    },
    userSection: {
        paddingVertical: 24,
        alignItems: 'center',
        backgroundColor: '#E8F1F5',
    },
    userAvatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: 12,
    },
    userName: {
        color: '#0F3C52',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userInfo: {
        color: '#0F3C52',
        fontSize: 12,
        textAlign: 'center',
    },
    userExtra: {
        color: '#0F3C52',
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
        color: '#0F3C52',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    sessionInfo: {
        textAlign: 'center',
        color: '#0F3C52',
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
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F3C52',
        marginBottom: 8,
    },
    modalItem: {
        color: '#0F3C52',
        marginBottom: 4,
    },
    modalButton: {
        marginTop: 16,
        alignSelf: 'flex-end',
        backgroundColor: '#0F3C52',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});


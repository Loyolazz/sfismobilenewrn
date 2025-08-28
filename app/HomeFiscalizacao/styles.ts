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
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    userAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginBottom: 8,
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
});


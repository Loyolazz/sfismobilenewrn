import { StyleSheet } from 'react-native';
import theme from './src/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    text: {
        ...theme.typography.heading,
        color: theme.colors.text,
        textAlign: 'center',
    },
});


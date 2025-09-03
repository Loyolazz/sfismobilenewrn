import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from '@/src/components/Icon';
import styles, { CARD_GRADIENT } from '../styles';
import type { DrawerParamList } from '../types';

type Item = { key: keyof DrawerParamList; title: string; icon: string };

type Props = {
    items: Item[];
    navigation: DrawerNavigationProp<DrawerParamList>;
};

export default function TileGrid({ items, navigation }: Props) {
    return (
        <View style={styles.grid}>
            {items.map((item) => (
                <Pressable
                    key={item.key as string}
                    onPress={() => navigation.navigate(item.key as any)}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir ${item.title}`}
                    android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
                    style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }, styles.tileWrapper]}
                    hitSlop={8}
                    testID={`tile-${item.key as string}`}
                >
                    <LinearGradient
                        colors={CARD_GRADIENT}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.tile}
                    >
                        <View style={styles.tileIconWrap}>
                            <Icon name={item.icon as any} size={44} color="#fff" />
                        </View>
                        <Text style={styles.tileText}>{item.title}</Text>
                    </LinearGradient>
                </Pressable>
            ))}
        </View>
    );
}

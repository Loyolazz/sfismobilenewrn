import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { listarMensagensPush, MensagemPush } from '@/src/api/notificacoes';
import { loadSession } from '@/src/services/session';
import {MaterialIcons} from "@expo/vector-icons";
import {goBack} from "expo-router/build/global-state/routing";

export default function Notificacoes() {
  const [dados, setDados] = useState<MensagemPush[]>([]);

  useEffect(() => {
    async function fetchData() {
      const session = await loadSession();
      const idPerfil = session?.usuario?.IDPerfilFiscalizacao;
      if (!idPerfil) return;
      try {
        const res = await listarMensagensPush(idPerfil);
        setDados(res);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  function renderItem({ item }: { item: MensagemPush }) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.DSTituloMensagemPush}</Text>
        <Text style={styles.message}>{item.DSMensagemPush}</Text>
        <Text style={styles.date}>{item.DTEnvio}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={dados}
        keyExtractor={(item) => String(item.IDMensagemPush)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

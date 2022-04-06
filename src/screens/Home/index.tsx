import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Card, CardProps } from '../../components/Card';
import { HeaderHome } from '../../components/HeaderHome';
import { Button } from '../../components/Button';

import { styles } from './styles';

export function Home() {
  const { getItem, setItem } = useAsyncStorage('@savepass:passwords');

  const [data, setData] = useState<CardProps[]>([]);

  async function handleFetchData() {
    const response = await getItem();

    const data = response ? JSON.parse(response) : [];

    setData(data);
  }

  async function handleRemove(id: string) {
    const response = await getItem();

    const previousData = response ? JSON.parse(response) : [];

    // Todos os registros menos o que tem o id igual ao que eu quero remover.
    const data = previousData.filter((item: CardProps) => item.id !== id);

    setItem(JSON.stringify(data));

    setData(data);
  }

  useFocusEffect(
    useCallback(() => {
      handleFetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.listHeader}>
        <Text style={styles.title}>Suas senhas</Text>

        <Text style={styles.listCount}>{`${data.length} ao total`}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card data={item} onPress={() => handleRemove(item.id)} />
        )}
      />

      <View style={styles.footer}>
        <Button title="Limpar lista" />
      </View>
    </View>
  );
}

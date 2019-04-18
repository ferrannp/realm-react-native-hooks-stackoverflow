/**
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import RealmDatabase from 'realm';

const realm = new RealmDatabase({
  schema: [
    {name: 'Dog', properties: {name: 'string'}}
  ],
});

const query = () => realm.objects('Dog');

function useRealmResultsHook(query) {
  const [data, setData] = useState(query());

  useEffect(
      () => {
        function handleChange(newData) {
          // Not working even that data !== newData
          console.warn(data === newData);
          setData(newData);
          // With [...newData] works
          // setData(newData);
        }
        const dataQuery = query();
        dataQuery.addListener(handleChange);
        return () => {
          dataQuery.removeAllListeners();
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [query]
  );

  return data;
}

const App = () => {
  const dogs = useRealmResultsHook(query);
  return (
      <View style={styles.container}>
        <Text style={styles.text}>{`Dogs: ${dogs.length}`}</Text>
        <Button title="Increment" onPress={() => {
          realm.write(() => {
            realm.create('Dog', {name: 'Rex'});
          })
        }} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 24,
  },
});

export default App;

import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';

import {services, useServices} from '@app/services';
import {useStores} from '@app/stores';
import {BButton} from '@app/components/button';
import {useAppearance} from '@app/utils/hooks';
import * as DocumentPicker from 'expo-document-picker';
import {convert} from 'react-native-pdf-to-image';
import LinearGradient from 'react-native-linear-gradient';

export const CreateMarkingScheme: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const {counter, ui} = useStores();
  const {t, api, navio} = useServices();
  const [isVisible, setIsVisible] = useState(false);
  const [saveDocument, setSaveDocument] = useState('');
  const {openai} = useStores();

  // State (local)
  const [loading, setLoading] = useState(false);

  // Start
  useEffect(() => {}, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      setSaveDocument(result.assets[0].uri);
      Alert.alert('Upload document?', 'Document name: ' + result.assets[0].name, [
        {
          text: 'Cancel',
          onPress: () => setDocument(''),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            convertPdf(result.assets[0].uri);
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const convertPdf = async document => {
    try {
      const images = await convert(document);
      navio.push('SelectPages', {
        type: 'push',
        data: images,
      });
    } catch (error) {
      console.log('error running convertPdf');
      console.log(error);
    }
  };

  return (
    <View flex>
      <LinearGradient
        start={{x: 0, y: 0.7}}
        colors={['#eef2ff', '#fff3f3']}
        style={styles.linearGradient}
      >
        <View padding-10>
          <Text style={styles.Title}>Create marking scheme</Text>
          <BButton margin-5 label="Select Document" onPress={pickDocument} />
          <BButton
            margin-5
            label="Create Manually"
            onPress={() => console.log('manual creation')}
          />
        </View>
      </LinearGradient>
    </View>
  );
});
CreateMarkingScheme.options = () => ({
  title: services.t.do('home.title'),
});

const styles = StyleSheet.create({
  Title: {
    textAlign: 'center',
    fontSize: 36,
    marginBottom: 20,
  },

  highlight: {
    fontWeight: '700',
  },
  linearGradient: {
    flex: 1,
  },
});

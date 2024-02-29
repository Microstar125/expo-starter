import React, {PropsWithChildren, useState} from 'react';
import {StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {View, Modal, Colors, TextField} from 'react-native-ui-lib';
import {BButtonModal, BButtonUnderline} from './button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { navio } from '@app/navio';
import { useStores } from '@app/stores';

export const SlideModal: React.FC<
  PropsWithChildren<{
    isVisible?: boolean;
    onPressOut?: PureFunc;
    onCancel?: PureFunc;
    title?: string;
    height?: object;
  }>
> = ({children, isVisible, onPressOut, onCancel, title, height}) => {
  return (
    <Modal transparent={true} visible={isVisible}>
      <TouchableOpacity style={styles.modalWrap} activeOpacity={1} onPressOut={onPressOut}>
        <View style={[styles.modal, height]}>
          <TouchableWithoutFeedback>
            <View flex>
              <Modal.TopBar title={title} onCancel={onCancel} />
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export const CreateScheme: React.FC<
  PropsWithChildren<{
    setIsVisible: PureFunc;
    selectedFiles: any;
  }>
> = ({setIsVisible, selectedFiles}) => {
  const {schemes} = useStores();
  //Empty text input
  const [schemeName, setSchemeName] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const GPTInitialTemplate = {
    model: 'gpt-4-vision-preview',
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: 'You are a teacher marking students exams.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please summarise the attached images of a marking scheme so you can use it to mark students work.',
          },
        ],
      },
    ],
  };

  function onChangeText(newText: string) {
    if (newText.length >= 1) {
      setIsDisabled(false);
    }
    if (newText.length === 0) {
      setIsDisabled(true);
    }

    setSchemeName(newText);
  }

  //Create marking scheme
  const createScheme = title => {
    let id = uuid.v4();
    let scheme = {
      id: id,
      title: title,
      date: new Date().toLocaleDateString(),
      pages: selectedFiles,
      chatGPTMessage: GPTInitialTemplate,
    };
    schemes.createMarkingScheme(scheme);
  };

  //Store the selected pages
  const storeData = async (value, id) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(id, jsonValue).then(() => {
        navio.push('Main', {
          type: 'push',
        });
      });
    } catch (e) {
      // saving error
      console.log('Error saving scheme');
    }
  };

  return (
    <View>
      <View center>
        <TextField
          containerStyle={styles.createContainer}
          placeholder={'Scheme name...'}
          label={'Name'}
          value={schemeName}
          onChangeText={newText => onChangeText(newText)}
          validate={['required']}
          validationMessage={['Name is required']}
          validateOnBlur
          validateOnChange
          enableErrors
          showCharCounter
          maxLength={50}
        />
      </View>
      <View style={styles.twoButtonModal}>
        <BButtonUnderline label="Clear" onPress={() => setSchemeName('')} />
        <BButtonModal label="Save" onPress={() => createScheme(schemeName)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },
  modal: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttonWrap: {
    paddingTop: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey50,
  },
  twoButtonModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 20,
    padding: 10,
  },
  createContainer: {
    width: '90%',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
});

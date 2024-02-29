import { navio } from '@app/navio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import * as FileSystem from 'expo-file-system';
import ImgToBase64 from 'react-native-image-base64';

export class MarkingSchemeStore implements IStore {
  markingSchemes = [];
  description = 'Sending request to OpenAI...';
  error = '';

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: MarkingSchemeStore.name,
      properties: ['markingSchemes'],
    });
  }

  deleteMarkingScheme(id: string) {
    runInAction(() => {
      const newList = this.markingSchemes.filter(item => item.id !== id);
      this.markingSchemes = newList;
    });
  }

  createMarkingScheme(scheme) {
    runInAction(() => {
      this.createMarkingSchemeGPT(scheme);
      navio.push('Main', {
        type: 'push',
      });
    });
  }

  async convertToBase64(file) {
    //const base64 = await FileSystem.readAsStringAsync(file, {encoding: 'base64'});
    const base64 = ImgToBase64.getBase64String(file).catch(err => console.log(err));
    return base64;
  }

  // Function to create the first chatGPT response (teaching the AI what the marking scheme is for marking students work)
  async createMarkingSchemeGPT(scheme) {
    scheme.pages.forEach(imageURL => {
      const file = 'file://' + imageURL;
      const imageMessage = {
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${this.convertToBase64(file)}`,
        },
      };
      scheme.chatGPTMessage.messages[1].content.push(imageMessage);
    });
    this.describeMarkingSchemeWithOpenAI(scheme);
    this.markingSchemes.push(scheme);
  }

  describeMarkingSchemeWithOpenAI = async scheme => {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const result = await this.postData(url, scheme.chatGPTMessage);
      console.log('Result from Chat GPT: ' + JSON.stringify(result));
      runInAction(() => {
        this.description = result.choices[0].message.content;
      });
      return result.choices[0].message.content;
    } catch (error) {
      console.error('Error from Chat GPT: ' + error);
      return null;
    } finally {
      console.log('Finally running: ' + this.description);
    }
  };

  postData = async (url = '', data: any) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    console.log('postData has ran');
    return await response.json(); // parses JSON response into native JavaScript objects
  };
}

export class MarkingScheme {
  id = null;
  name = '';
  date = '';
  document = '';
  convertedDocument = [];

  constructor() {
    makeAutoObservable(this);
  }
}

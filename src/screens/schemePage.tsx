import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Image, StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';

import {services, useServices} from '@app/services';
import {useStores} from '@app/stores';
import {BButton, HeaderButton} from '@app/components/button';
import {useAppearance} from '@app/utils/hooks';
import {CameraComponent} from '@app/components/CameraComponent';
import * as DocumentPicker from 'expo-document-picker';
import {convert} from 'react-native-pdf-to-image';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import {BottomButtons} from '@app/components/BottomButtons';
import {Entypo} from '@expo/vector-icons';
import {Bounceable} from 'rn-bounceable';

export type Params = {
  data: any;
};

export const SchemePage: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const {params: _p} = useRoute(); // this is how to get passed params with navio.push('Screen', params)
  const params = _p as Params; // use as params?.type
  const {t, api, navio} = useServices();
  const [isVisible, setIsVisible] = useState(false);
  const [saveDocument, setSaveDocument] = useState('');
  const {openai} = useStores();

  // State (local)
  const [loading, setLoading] = useState(false);
  // Start
  useEffect(() => {}, []);

  //Images
  const [images, setImages] = useState([]);
  const deviceWidth = Dimensions.get('window').width;

  //Calcuate the width of the image
  const calculateWidth = () => {
    const dataLength = images.length;
    if (dataLength === 0) {
      const paddingRequired = (dataLength + 3) * 10;
      const finalWidth = (deviceWidth - paddingRequired) / (dataLength + 2);
      return finalWidth;
    }
    if (dataLength >= 3) {
      const paddingRequired = (3 + 2) * 10;
      const finalWidth = (deviceWidth - paddingRequired) / 3;
      return finalWidth;
    } else {
      const paddingRequired = (dataLength + 2) * 10;
      const finalWidth = (deviceWidth - paddingRequired) / (dataLength + 1);
      return finalWidth;
    }
  };

  //Calculate the height of the image
  const calculateHeight = () => {
    const width = calculateWidth();
    const height = width * 1.5;
    return height;
  };

  const postData = async (url = '', data: any) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    console.log(response);
    return await response.json(); // parses JSON response into native JavaScript objects
  };

  //Params for OpenAI
  const [textForGPT, setTextForGPT] = useState({
    content: [
      {
        type: 'text',
        text: 'What is in this image?',
      },
    ],
  });

  function createGPTPrompt(newObject: string) {
    setTextForGPT(prev => ({
      content: [...prev.content, newObject],
    }));
  }

  const GPTFullMessage = {
    model: 'gpt-4-vision-preview',
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: 'You are a teacher marking students exams.',
      },
      {
        role: 'user',
        textForGPT,
      },
    ],
  };

  const [description, setDescription] = useState<string>('');
  //Function to get reply from OpenAI
  const describeImageWithOpenAI = async textForGPT => {
    try {
      // const chatCompletions: any = await openai.chat.completions.create(
      //   GPTFullMessage as any,
      // );
      const url = 'https://api.openai.com/v1/chat/completions';
      setDescription('Sending request to OpenAI...');
      const result = await postData(url, params);
      console.log(result);
      return result.choices[0].message.content;
    } catch (error) {
      setDescription(JSON.stringify(error));
      console.error(error);
      return null;
    } finally {
      console.log(description);
    }
  };

  return (
    <View flex>
      <LinearGradient
        start={{x: 0, y: 0.7}}
        colors={['#eef2ff', '#fff3f3']}
        style={styles.linearGradient}
      >
        <View style={styles.wrap} paddingV-10>
          <ScrollView>
            <Text style={styles.Title}>{params?.data.title}</Text>
            <View style={styles.imageWrap}>
              {images.map((image, index) => (
                <Image
                  style={{
                    width: calculateWidth(),
                    height: calculateHeight(),
                    alignSelf: 'center',
                    margin: 5,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: image.uri,
                  }}
                  key={index}
                />
              ))}
              <View
                style={{
                  width: calculateWidth(),
                  height: calculateHeight(),
                  alignSelf: 'center',
                  margin: 5,
                  borderRadius: 10,
                }}
              >
                <View style={styles.addButton}>
                  <Bounceable onPress={() => setIsVisible(true)}>
                    <Entypo name="plus" size={48} color="black" />
                  </Bounceable>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.line} />
              <View>
                <Text style={styles.text}>👇 AI marking 👇</Text>
              </View>
              <View style={styles.line} />
            </View>
            <View style={styles.replyWrap}>
              <Text style={styles.reply}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam condimentum nulla
                ut dui ullamcorper, vestibulum tincidunt ante ultricies. Mauris lacinia libero eget
                libero accumsan consectetur. Suspendisse ut efficitur nisi. Maecenas sed elit eget
                enim ultricies consequat. Quisque sollicitudin turpis sapien, vel molestie diam
                tincidunt a. In aliquam consequat nisl, vitae scelerisque diam consectetur a.
                Vivamus nisi leo, convallis nec lobortis non, hendrerit et eros. Suspendisse
                imperdiet consequat aliquam. Curabitur pulvinar urna et commodo euismod.
                {'\n'}
                {'\n'}
                Nullam rhoncus tempor nulla, id semper eros aliquet quis. Donec tempus leo id
                viverra volutpat. Etiam lorem orci, accumsan quis sollicitudin non, laoreet nec
                risus. Duis lobortis eget est et ultricies. Duis augue quam, congue sed aliquam non,
                dignissim sit amet nisl. In nisi metus, mollis nec lacus ac, vehicula interdum
                nulla. Fusce maximus, lacus id laoreet ullamcorper, est odio egestas libero,
                facilisis ornare quam augue et lacus. Vestibulum hendrerit velit quis nunc ultrices
                vehicula. Integer aliquet nulla turpis, eu finibus turpis lacinia vel. Vestibulum
                ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce
                nec volutpat metus.
              </Text>
            </View>
          </ScrollView>
          <BottomButtons
            mainLabel="Mark question"
            secondLabel="Add photo"
            thirdLabel="Mark Next Paper"
            doubleButton={true}
            onPress={() => console.log('marking')}
            secondOnPress={() => setIsVisible(true)}
          />
        </View>
        {isVisible && (
          <CameraComponent
            setIsVisible={setIsVisible}
            setImages={setImages}
            images={images}
            createGPTPrompt={createGPTPrompt}
          />
        )}
      </LinearGradient>
    </View>
  );
});
SchemePage.options = () => ({
  title: services.t.do('home.title'),
});

const styles = StyleSheet.create({
  wrap: {
    height: '100%',
  },
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
  imageWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  addButton: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    width: 150,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
    margin: 20,
  },
  replyWrap: {
    margin: 20,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    marginBottom: 110,
  },
  reply: {
    fontSize: 16,
    textAlign: 'left',
    margin: 20,
    fontWeight: 'bold',
  },
});

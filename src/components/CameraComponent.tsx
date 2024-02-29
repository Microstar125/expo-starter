import React, {MutableRefObject, PropsWithChildren, useEffect, useRef, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {Camera, CameraType} from 'expo-camera';
import {BButton, CameraButton, HeaderButton} from './button';

type PropsWithChildren = Modifiers.MarginModifiers &
  Modifiers.FlexModifiers & {
    setIsVisible?: PureFunc;
    setImages?: PureFunc;
    createGPTPrompt?: PureFunc;
    images?: any;
  };

export const CameraComponent: React.FC<PropsWithChildren> = ({
  children,
  setIsVisible,
  setImages,
  images,
  createGPTPrompt,
}) => {
  const device = CameraType.back;
  const camera: MutableRefObject<Camera | null> = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [b64, setB64] = useState('');
  const [tempImage, setTempImage] = useState(null);
  const [description, setDescription] = useState<string>('');
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const testData = {
    choices: [
      {
        finish_reason: 'length',
        index: 0,
        message: {
          content:
            "This image shows an indoor setting with a few objects. In the foreground, there is a potted plant with thick, green, rounded leaves, which appears to be a Crassula ovata, commonly known as a jade plant. The pot is placed on a desk or a table. Next to the jade plant on the right side, there's a small white diffuser or humidifier with some text on it which isn't fully legible. Just below the plant pot, partially visible, there's a squeeze bottle with a white label that could contain some kind of liquid, possibly for plant care or personal care. In the background, there's a computer monitor displaying a webpage, with text that suggests it might be related to API keys, which are used in computer programming for authentication purposes when using an Application Programming Interface (API). The monitor shows black text on a white background, with a menu on the left side, and on the right side, sections labeled with titles like Your API keys",
          role: 'assistant',
        },
      },
    ],
    created: 1703115229,
    id: 'chatcmpl-8Y0MPK8fdTjVr53QBhUjhHIxvkh5Q',
    model: 'gpt-4-1106-vision-preview',
    object: 'chat.completion',
    usage: {
      completion_tokens: 200,
      prompt_tokens: 778,
      total_tokens: 978,
    },
  };

  // need this to make sure the camera is available for picture taking
  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (camera.current) {
      const options = {quality: 0.5, base64: true, skipProcessing: true};
      const data = await camera.current?.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await camera.current.pausePreview();
        setIsPreview(true);
        setTempImage(data);
        // const description = await describeImageWithOpenAI(data.base64);
        // const description = testData.choices[0].message.content;
        //setDescription(`Description: ${description}`);
        //setIsVisible(false);
      }
    }
  };

  const postData = async (url = '', data: any) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    console.log(response);
    return await response.json(); // parses JSON response into native JavaScript objects
  };

  const describeImageWithOpenAI = async (base64Image: string) => {
    const params = {
      model: 'gpt-4-vision-preview',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'What is in this image?',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                // url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg',
              },
            },
          ],
        },
      ],
    };

    try {
      // const chatCompletions: any = await openai.chat.completions.create(
      //   params as any,
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
  const imageSource = `data:image/jpeg;base64,${b64}`;

  //Function to append to ChatGPT prompt
  function appendToChatGPTPrompt(imageBase64: string) {
    const textForGPT = {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${imageBase64}`,
      },
    };
    createGPTPrompt(textForGPT);
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.container}
        ref={camera}
        type={device}
        flashMode={Camera.Constants.FlashMode.on}
        onCameraReady={onCameraReady}
        onMountError={error => {
          console.log('error', error);
        }}
        isActive={hasPermission}
        photo={true}
        autoFocus={false}
      />
      {isPreview && (
        <View style={styles.buttonWrap}>
          <BButton
            onPress={() => {
              setIsPreview(false);
              camera.current?.resumePreview();
            }}
            label="Retake"
            buttonBG="white"
            textColor="black"
          />
          <BButton
            onPress={() => {
              setIsPreview(false);
              setImages((images: any) => [...images, tempImage]);
              setIsVisible(false);
              appendToChatGPTPrompt(tempImage.base64);
            }}
            label="Save"
            buttonBG="white"
            textColor="black"
          />
        </View>
      )}
      {!isPreview && (
        <View style={styles.buttonWrap}>
          <CameraButton onPress={takePicture} />
        </View>
      )}
      <Text style={{margin: 30}}>{description}</Text>
      <Image
        source={{uri: imageSource}} // Replace with your image path
        style={{width: 200, height: 200, marginLeft: '25%'}} // Set image size as needed
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  Button: {
    textAlign: 'center',
    width: '50%',
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 5,
    padding: 5,
    marginLeft: '25%',
    marginBottom: 10,
  },
  Image: {
    width: 200,
    height: 200,
    marginLeft: '25%',
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 40,
    left: '32%',
  },
});

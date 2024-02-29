import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {View, Text, MarginModifiers, Modifiers, Colors} from 'react-native-ui-lib';
import {Bounceable} from 'rn-bounceable';
import Entypo from '@expo/vector-icons/Entypo';
import {useAppearance} from '@app/utils/hooks';

type Props = Modifiers.MarginModifiers &
  Modifiers.FlexModifiers & {
    label?: string;
    name?: string;
    onPress?: PureFunc;
    size?: 'medium' | 'small';
    buttonBG?: 'black' | 'white';
    textColor?: 'black' | 'white';
    isDisabled?: boolean;
  };

export const BButton: React.FC<Props> = ({
  label,
  onPress,
  size = 'medium',
  buttonBG = 'black',
  textColor = 'white',
  isDisabled,
  ...modifiers
}) => {
  const textSize = size === 'medium' ? {text65M: true} : {text90: true};
  const padding = size === 'medium' ? {'padding-s4': true} : {'padding-s2': true};
  const button = buttonBG === 'black' ? {'bg-black': true} : {'bg-white': true};
  const color = textColor === 'black' ? {_black: true} : {_white: true};

  return (
    <View {...modifiers}>
      <Bounceable onPress={onPress}>
        <View style={styles.bbutton} center br100 bg-black {...padding} {...button}>
          <Text style={styles.text} {...color} {...textSize}>
            {label}
          </Text>
        </View>
      </Bounceable>
    </View>
  );
};

export const BButtonModal: React.FC<Props> = ({
  label,
  onPress,
  size = 'medium',
  buttonBG = 'black',
  textColor = 'white',
  isDisabled,
  ...modifiers
}) => {
  const textSize = size === 'medium' ? {text65M: true} : {text90: true};
  const padding = size === 'medium' ? {'padding-s4': true} : {'padding-s2': true};
  const button = buttonBG === 'black' ? {'bg-black': true} : {'bg-white': true};
  const color = textColor === 'black' ? {_black: true} : {_white: true};

  return (
    <View {...modifiers}>
      <Pressable
        android_ripple={{color: Colors.primaryDark, borderless: false, foreground: true}}
        onPress={onPress}
      >
        <View style={styles.bbutton} center br100 bg-black {...padding} {...button}>
          <Text style={styles.text} {...color} {...textSize}>
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export const BButtonUnderline: React.FC<Props> = ({
  label,
  onPress,
  size = 'medium',
  ...modifiers
}) => {
  const textSize = size === 'medium' ? {text65M: true} : {text70: true};

  return (
    <View style={styles.container} {...modifiers}>
      <Pressable
        android_ripple={{color: Colors.primaryDark, borderless: false, foreground: true}}
        onPress={onPress}
      >
        <View center padding-s4 br100>
          <Text style={styles.buttonOutline} {...textSize}>
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export const HeaderButton: React.FC<Props> = ({name, size = 'medium', onPress, ...modifiers}) => {
  const iconSize = size === 'medium' ? 38 : 26;

  return (
    <View {...modifiers}>
      <Bounceable onPress={onPress}>
        <View center>
          <Entypo name={name} size={iconSize} color={Colors.primary} />
        </View>
      </Bounceable>
    </View>
  );
};

export const CameraButton: React.FC<Props> = ({name, onPress, ...modifiers}) => {
  return (
    <View {...modifiers} style={styles.capture}>
      <Bounceable onPress={onPress}>
        <View center>
          <Entypo name={name} size={64} color={Colors.primary} />
        </View>
      </Bounceable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 6,
  },
  text: {
    fontWeight: 'bold',
  },
  bbutton: {
    elevation: 3,
  },
  buttonOutline: {
    textDecorationLine: 'underline',
    fontWeight: '800',
    color: Colors.primary,
  },
  capture: {
    backgroundColor: '#f5f6f5',
    height: 80,
    width: 80,
    borderRadius: Math.floor(200 / 2),
    marginHorizontal: 31,
  },
});

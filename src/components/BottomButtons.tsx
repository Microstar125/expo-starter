import React, {PropsWithChildren, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native-ui-lib';
import {BButton} from './button';
import {navio} from '@app/navio';

type PropsWithChildren = Modifiers.MarginModifiers &
  Modifiers.FlexModifiers & {
    setIsVisible?: PureFunc;
    doubleButton?: boolean;
    mainLabel?: string;
    onPress?: PureFunc;
    secondOnPress?: PureFunc;
    thirdOnPress?: PureFunc;
    secondLabel?: string;
    thirdLabel?: string;
  };

export const BottomButtons: React.FC<PropsWithChildren> = ({
  children,
  doubleButton,
  mainLabel,
  onPress,
  secondOnPress,
  thirdOnPress,
  setIsVisible,
  secondLabel,
  thirdLabel,
}) => {
  useEffect(() => {}, []);

  return (
    <View style={styles.bottomWrap}>
      <View>
        <BButton
          buttonBG="black"
          textColor="white"
          margin-5
          label={mainLabel ? mainLabel : 'Create New'}
          onPress={onPress ? onPress : () => navio.push('CreateMarkingScheme', {type: 'push'})}
        />
      </View>
      {doubleButton && (
        <View style={styles.twoButtons}>
          <View style={styles.button}>
            <BButton
              buttonBG="white"
              textColor="black"
              size="small"
              margin-5
              label={secondLabel ? secondLabel : 'Upload Marking Scheme'}
              onPress={secondOnPress}
            />
          </View>
          <View style={styles.button}>
            <BButton
              buttonBG="white"
              textColor="black"
              size="small"
              margin-5
              label={thirdLabel ? thirdLabel : 'Enter Manually'}
              onPress={thirdOnPress}
            />
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  twoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
  },
});

import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Image, StyleSheet, Touchable, TouchableOpacity} from 'react-native';
import {Checkbox, Text, View} from 'react-native-ui-lib';
import {HeaderButton} from './button';

type PropsWithChildren = Modifiers.MarginModifiers &
  Modifiers.FlexModifiers & {
    setIsVisible?: PureFunc;
    data: any;
    columnWidth: string;
    columnHeight: number;
    toggleItemSelect?: PureFunc;
    check?: boolean;
  };

export const PdfPage: React.FC<PropsWithChildren> = ({
  data,
  columnWidth,
  columnHeight,
  toggleItemSelect,
  children,
  setIsVisible,
}) => {
  useEffect(() => {}, []);
  const [check, setCheck] = useState(false);

  const file = 'file://' + data;

  return (
    <View style={{...styles.card, width: columnWidth, height: columnHeight}} bg-white>
      <TouchableOpacity
        onPress={() => {
          toggleItemSelect(data);
          setCheck(prevState => !prevState);
        }}
      >
        <Image style={styles.image} source={{uri: file}} />
        <View style={styles.delete}>
          <Checkbox value={check} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    height: 250,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  delete: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

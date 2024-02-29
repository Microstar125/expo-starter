import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, ScrollViewBase, StyleSheet} from 'react-native';
import {Assets, Button, Text, View} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useServices} from '@app/services';
import {useStores} from '@app/stores';
import {HeaderButton} from '@app/components/button';
import {Row} from '@app/components/row';
import {useAppearance} from '@app/utils/hooks';
import {BottomButtons} from '@app/components/BottomButtons';
import {ConversationCard} from '@app/components/ConversationCard';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Main: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const {counter, ui} = useStores();
  const {navio} = useServices();
  const [isVisible, setIsVisible] = useState(false);
  const [document, setDocument] = useState('');
  const {schemes} = useStores();

  // State (local)
  const [loading, setLoading] = useState(false);

  // Start
  useEffect(() => {
    configureUI();
  }, []);

  //console.log(schemes.description);
  console.log(JSON.stringify(schemes.markingSchemes[15].chatGPTMessage));
  const file = 'file:///data/user/0/io.batyr.expostarter/cache/1709130125005_pdf.png';
  const base64 = `data:image/png;base64,${schemes.convertToBase64(file)}`;

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({
      headerLeft: () => (
        <Row paddingV-20>
          <HeaderButton onPress={() => console.log('pressed')} name="menu" />
          <Image style={styles.logo} source={Assets.logo.logo} />
        </Row>
      ),
      headerRight: () => (
        <Row paddingV-20>
          <HeaderButton
            onPress={() => navio.push('CreateMarkingScheme', {type: 'push'})}
            name="plus"
          />
        </Row>
      ),
    });
  };

  return (
    <View flex paddingT-30>
      <LinearGradient
        start={{x: 0, y: 0.7}}
        colors={['#eef2ff', '#fff3f3']}
        style={styles.linearGradient}
      >
        <SafeAreaView>
          <View style={styles.wrap}>
            <Image style={{height: 500, width: 300}} source={{uri: base64}} />
            <Button
              label="Test"
              onPress={() => schemes.createMarkingScheme(schemes.markingSchemes[15])}
            />
            <FlatList
              data={schemes.markingSchemes}
              horizontal={false}
              numColumns={3}
              columnWrapperStyle={styles.cardWrap}
              renderItem={({item}) => <ConversationCard data={item} />}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={{paddingBottom: 140, paddingTop: 50}}
            />
            <BottomButtons doubleButton={true} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
});
Main.options = () => ({
  headerBackTitleStyle: false,
  title: '',
  headerTransparent: true,
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
  cardWrap: {
    alignItems: 'flex-start',
    marginLeft: 6,
    marginRight: 6,
  },
  logo: {
    marginLeft: 60,
    width: 150,
    height: 60,
  },
});

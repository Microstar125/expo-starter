import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {View} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavioScreen} from 'rn-navio';

import {services} from '@app/services';
import {HeaderButton} from '@app/components/button';
import {useAppearance} from '@app/utils/hooks';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PdfPage} from '@app/components/PdfPage';
import {Row} from '@app/components/row';
import {BottomButtons} from '@app/components/BottomButtons';
import {CreateScheme, SlideModal} from '@app/components/slideModal';

export type Params = {
  data: any;
};

export const SelectPages: NavioScreen = observer(({}) => {
  useAppearance();
  const navigation = useNavigation();
  const {params: _p} = useRoute(); // this is how to get passed params with navio.push('Screen', params)
  const params = _p as Params; // use as params?.type

  // Start
  useEffect(() => {
    configureUI();
  }, []);

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({
      headerRight: () => (
        <Row>
          <HeaderButton
            onPress={() => {
              setColumns(1);
              setColumnWidth('98%');
              setColumnHeight(500);
            }}
            name="list"
          />
          <HeaderButton
            onPress={() => {
              setColumns(2);
              setColumnWidth('48%');
              setColumnHeight(250);
            }}
            name="grid"
          />
        </Row>
      ),
    });
  };

  // State (local)
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState(2);
  const [columnWidth, setColumnWidth] = useState('48%');
  const [columnHeight, setColumnHeight] = useState(250);

  const [isVisible, setIsVisible] = useState(false);
  const heartModalHeight = {height: '30%'};

  // Selecting pages
  const [selectedFiles, setSelectedFiles] = useState([]);

  const toggleItemSelect = (id: string) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(prevIds => prevIds.filter(itemId => itemId !== id));
    } else {
      setSelectedFiles(prevIds => [...prevIds, id]);
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
          <SafeAreaView>
            <View style={styles.wrap}>
              <FlatList
                data={params?.data.outputFiles}
                horizontal={false}
                numColumns={columns}
                key={columns}
                renderItem={({item}) => (
                  <PdfPage
                    data={item}
                    columnWidth={columnWidth}
                    columnHeight={columnHeight}
                    toggleItemSelect={toggleItemSelect}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{paddingBottom: 140}}
              />
              <BottomButtons mainLabel="Save Pages" onPress={() => setIsVisible(true)} />
            </View>
          </SafeAreaView>
        </View>

        {isVisible && (
          <SlideModal
            isVisible={isVisible}
            onPressOut={() => setIsVisible(false)}
            onCancel={() => setIsVisible(false)}
            title="Name Test"
            height={heartModalHeight}
          >
            <CreateScheme selectedFiles={selectedFiles} setIsVisible={setIsVisible} />
          </SlideModal>
        )}
      </LinearGradient>
    </View>
  );
});
SelectPages.options = () => ({
  title: services.t.do('home.title'),
});

const styles = StyleSheet.create({
  Title: {
    textAlign: 'center',
    fontSize: 36,
    marginBottom: 20,
  },
  wrap: {
    height: '100%',
  },
  highlight: {
    fontWeight: '700',
  },
  linearGradient: {
    flex: 1,
  },
  bottom: {
    bottom: 0,
    width: '100%',
    padding: 10,
  },
});

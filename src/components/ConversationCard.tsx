import React, {PropsWithChildren, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {HeaderButton} from './button';
import {Bounceable} from 'rn-bounceable';
import {navio} from '@app/navio';
import {useStores} from '@app/stores';

type PropsWithChildren = Modifiers.MarginModifiers &
  Modifiers.FlexModifiers & {
    setIsVisible?: PureFunc;
    data: any;
  };

export const ConversationCard: React.FC<PropsWithChildren> = ({data, children, setIsVisible}) => {
  const [dateText, setDateText] = React.useState('');
  const {schemes} = useStores();

  useEffect(() => {
    function checkDate() {
      const now = new Date().toLocaleDateString();
      if (data.date === now) {
        setDateText('Today');
      } else {
        setDateText(data.date);
      }
    }
    checkDate();
  }, [data.date]);

  return (
    <View style={styles.cardWrap} bg-white>
      <Bounceable
        onPress={() =>
          navio.push('SchemePage', {
            type: 'push',
            data: data,
          })
        }
      >
        <View style={styles.card} bg-white>
          <Text style={styles.date}>{dateText}</Text>
          <Text style={styles.text}>{data.title}</Text>
          <View style={styles.delete}>
            <HeaderButton
              onPress={() => schemes.deleteMarkingScheme(data.id)}
              size="small"
              name="cross"
            />
          </View>
        </View>
      </Bounceable>
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
  },
  twoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
  },
  card: {
    width: '100%',
    height: '100%',
  },
  cardWrap: {
    width: '31%',
    height: 150,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  date: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  delete: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
});

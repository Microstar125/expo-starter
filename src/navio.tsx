import {Navio} from 'rn-navio';

import {Main} from '@app/screens/main';
import {Playground} from '@app/screens/playground';
import {PlaygroundFlashList} from '@app/screens/playground/flash-list';
import {PlaygroundExpoImage} from '@app/screens/playground/expo-image';
import {Settings} from '@app/screens/settings';
import {Example} from '@app/screens/_screen-sample';

import {useAppearance} from '@app/utils/hooks';
import {
  screenDefaultOptions,
  tabScreenDefaultOptions,
  getTabBarIcon,
  drawerScreenDefaultOptions,
} from '@app/utils/designSystem';
import {services} from '@app/services';
import {AuthLogin} from './screens/auth/login';
import {CreateMarkingScheme} from './screens/createMarkingScheme';
import {SelectPages} from './screens/selectPages';
import {SchemePage} from './screens/schemePage';

// NAVIO
export const navio = Navio.build({
  screens: {
    Main,
    CreateMarkingScheme,
    SelectPages,
    SchemePage,

    Playground,
    PlaygroundFlashList,
    PlaygroundExpoImage,

    // for .pushStack example
    ProductPage: {
      component: Example,
      options: {
        headerShown: false,
      },
    },

    // for auth flow
    AuthLogin,
  },
  stacks: {
    MainStack: ['Main', 'CreateMarkingScheme', 'SelectPages', 'SchemePage'],
    PlaygroundStack: {
      screens: ['Playground', 'PlaygroundFlashList', 'PlaygroundExpoImage'],
    },

    // for .pushStack example
    ProductPageStack: {
      screens: ['ProductPage'],
      containerOptions: {
        headerShown: true,
        title: 'Product page',
      },
    },

    // for auth flow
    AuthFlow: ['AuthLogin'],
  },
  drawers: {
    // main drawer
    MainDrawer: {
      content: {
        Main: {
          stack: 'MainStack',
          options: {
            drawerType: 'front',
          },
        },
        Playground: {
          stack: 'PlaygroundStack',
        },
        // Tabs: {
        //   tabs: 'TabsWithDrawer',
        // },
      },
    },

    // drawer inside tabs
    // DrawerForTabs: {
    //   content: {
    //     FlashList: {
    //       stack: ['PlaygroundFlashList'],
    //       options: {
    //         title: 'Flash List',
    //         drawerPosition: 'right',
    //       },
    //     },
    //     ExpoImage: {
    //       stack: ['PlaygroundExpoImage'],
    //       options: {
    //         title: 'Expo Image',
    //         drawerPosition: 'right',
    //       },
    //     },
    //   },
    // },
  },
  root: 'AppTabs',
  hooks: [useAppearance],
  defaultOptions: {
    stacks: {
      screen: screenDefaultOptions,
    },
    tabs: {
      screen: tabScreenDefaultOptions,
    },
    drawers: {
      screen: drawerScreenDefaultOptions,
    },
  },
});

export const getNavio = () => navio;
export const NavioApp = navio.App;

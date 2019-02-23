import { StackActions, NavigationActions } from 'react-navigation';

// reset navigation to welcomepage
const resetToWelcomePage = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'WelcomePage' })],
});

const resetToDrawer = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Drawer' })],
});

export default {
  resetToWelcomePage,
  resetToDrawer
};
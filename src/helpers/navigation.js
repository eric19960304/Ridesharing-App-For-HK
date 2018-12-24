import { StackActions, NavigationActions } from 'react-navigation';

// reset navigation to welcomepage
const resetToWelcomePage = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'WelcomePage' })],
});

console.log(resetToWelcomePage);

export default {
  resetToWelcomePage
};
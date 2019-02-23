import React, { Component } from "react";
import { Root, Toast } from "native-base";
import { createAppContainer, createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Notifications } from "expo";
import StorageManager from "./helpers/storageManager";

import WelcomePage from "./screens/welcomePage";
import SettingPage from "./screens/settingPage";
import SideBar from "./screens/sidebar";
import Search from "./screens/search";
import LoginPage from './screens/loginPage';
import SignupPage from './screens/signupPage';
import EditProfilePage from './screens/editProfilePage';
import GoDrivePage from './screens/goDrivePage';
import MessagePage from './screens/messagePage';
import ResetPasswordPage from './screens/resetPasswordPage';

const storageManager = StorageManager.getInstance();

const Drawer = createDrawerNavigator(
  {
    Search: { screen: Search },
    GoDrivePage: { screen: GoDrivePage },
    MessagePage: { screen: MessagePage},
    SettingPage: { screen: SettingPage },
  },
  {
    initialRouteName: "Search",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const stackPages = {
  Drawer: { screen: Drawer },
  LoginPage: { screen: LoginPage },
  SignupPage: { screen: SignupPage },
  WelcomePage: { screen: WelcomePage },
  ResetPasswordPage: { screen: ResetPasswordPage },
  EditProfilePage: { screen: EditProfilePage },
};

export default class App extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
  
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (notification) => {
    Toast.show({
      text: notification.data.message,
      textStyle: { textAlign: 'center' },
      type: "success",
      position: "top",
      duration: 3000,
    });
  };

  render() {

    const user = storageManager.get('user');

    const AppNavigator = createStackNavigator(
      stackPages,
      {
        initialRouteName: user ? "MessagePage" : "WelcomePage",
        headerMode: "none"
      }
    );

    const AppContainer = createAppContainer(AppNavigator);

    return (
      <Root>
        <AppContainer />
      </Root>
    )
  }
}

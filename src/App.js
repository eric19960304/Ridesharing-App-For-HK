import React from "react";
import { Root } from "native-base";
import { StackNavigator, DrawerNavigator } from "react-navigation";

import WelcomePage from "./screens/welcomePage";
import SettingPage from "./screens/settingPage";
import SideBar from "./screens/sidebar";
import Search from "./screens/search";
import LoginPage from './screens/loginPage';
import SignupPage from './screens/signupPage';

const Drawer = DrawerNavigator(
  {
    Search: { screen: Search },
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

const AppNavigator = StackNavigator(
  {
    Drawer: { screen: Drawer },
    LoginPage: { screen: LoginPage },
    SignupPage: { screen: SignupPage },
    WelcomePage: { screen: WelcomePage },
  },
  {
    initialRouteName: "WelcomePage",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;

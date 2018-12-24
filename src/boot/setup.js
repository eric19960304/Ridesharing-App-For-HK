import { Font, Permissions, AppLoading } from "expo";
import React, { Component } from "react";
import { StyleProvider } from "native-base";
import { Platform } from "react-native";

import App from "../App";
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";
import StorageManager from "../helpers/storageManager";

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  componentWillMount() {
    this.prepare();
  }

  async prepare() {

    let checkList = [];

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });

    let storageManager = StorageManager.getInstance();
    let storageStatus = await storageManager.loadAllDataFromPersistence();
    checkList.push(storageStatus);

    let locationPermissionStatus = await Permissions.askAsync(Permissions.LOCATION);
    checkList.push(locationPermissionStatus);

    if(Platform.OS == 'ios'){
      let cameraRollPermissionStatus = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      checkList.push(cameraRollPermissionStatus);
    }
    
    allCheckingPass = checkList.every( (b) => !!b );

    this.setState({ isReady: allCheckingPass });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(variables)}>
        <App />
      </StyleProvider>
    );
  }
}

import { Font, Permissions, AppLoading, NotificationsIOS } from "expo";
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
    if(Platform.OS === 'ios'){
      Expo.Notifications.setBadgeNumberAsync(0);
    }
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

    let pushNotificationStatus = await this.askForPushNotificationsPermissionAsync();
    checkList.push(pushNotificationStatus);
    
    allCheckingPass = checkList.every( (b) => !!b );

    this.setState({ isReady: allCheckingPass });
  }

  askForPushNotificationsPermissionAsync = async() => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return false;
    }
  
    return true;
    
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

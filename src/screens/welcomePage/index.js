import React, { Component } from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import { Container, Button, H2, Text } from "native-base";

import styles from "./styles";
import helpers from "../../helpers";

const storageManager = helpers.StorageManager.getInstance();
const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-threeriders.png");

class WelcomePage extends Component {
  
  constructor(props){
    super(props);

  }

  render() {

    const user = storageManager.get('user');
    console.log('welcomePage: ', user);
    
    return (
      <Container>
        <StatusBar barStyle="light-content" />
      
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <ImageBackground source={launchscreenLogo} style={styles.logo} />
          </View>

          <View style={styles.contentContainer}>

            {user ?
              <View  style={styles.titleContainer}>
                <H2 style={styles.text}>Hello, {user.nickname}!</H2>
              </View>
              :
              <View  style={styles.titleContainer}>
                <H2 style={styles.text}>An Easy-to-use</H2>
                <H2 style={styles.text}>Ridesharing App for Hong Kong</H2>
              </View>
            }

            {user ?
              <View style={styles.buttonGroup} >
                <Button
                  style={styles.leftButton}
                  onPress={() => this.props.navigation.navigate('Search')}
                >
                  <Text>Go Ride</Text>
                </Button>
                <Button
                  style={styles.rightButton}
                  onPress={() => this.props.navigation.navigate('GoDrivePage')}
                >
                  <Text>Go Drive</Text>
                </Button>
              </View>
              :
              <View style={styles.buttonGroup} >
                <Button
                  style={styles.leftButton}
                  onPress={() => this.props.navigation.navigate('LoginPage')}
                >
                  <Text>Login</Text>
                </Button>
                <Button
                  style={styles.rightButton}
                  onPress={() => this.props.navigation.navigate('SignupPage')}
                >
                  <Text>Signup</Text>
                </Button>
              </View>
            }

          </View>
        </ImageBackground>
      </Container>
    );
  }
}

export default WelcomePage;

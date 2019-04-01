import React, { Component } from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import { Container, Button, H2, Text } from "native-base";

import styles from "./styles";

const backgroundImage = require("../../../assets/backgroundImage.jpg");
const launchscreenLogo = require("../../../assets/logo-threeriders.png");
const slogan = require("../../../assets/slogan.png");
class WelcomePage extends Component {
  
  constructor(props){
    super(props);

  }

  render() {
    
    return (
      <Container>
        <StatusBar barStyle="light-content" />
      
        <ImageBackground source={backgroundImage} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <ImageBackground source={launchscreenLogo} style={styles.logo} />
            
          </View>

          <View style={styles.contentContainer}>

            <View style={styles.titleContainer}>
              <ImageBackground source={slogan} style={styles.slogan} />
            </View>
            
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

          </View>
        </ImageBackground>
      </Container>
    );
  }
}

export default WelcomePage;

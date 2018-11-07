import React, { Component } from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import { Container, Button, H2, Text, Spinner } from "native-base";

import styles from "./styles";
import helpers from "../../helpers";

const { storage } = helpers;
const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-threeriders.png");

class WelcomePage extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      loading: true,
      user: null
    };
  }

  async componentWillMount(){
    return await this.getUserDataFromStorage();
  }
  
  async getUserDataFromStorage(){
    let user = null;
    try{
      user = JSON.parse(await storage.get('user'));
    }catch(e){
      console.log(e);
    }
    console.log(
      'welcomepage: ',
      user
    );
    this.setState({
      loading: false,
      user
    });
  }

  render() {

    const {loading, user} = this.state;

    if(loading){
      return (
        <Container>
          <StatusBar barStyle="light-content" />
          <Spinner color="blue" />
        </Container>
      );
    }
    
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <ImageBackground source={launchscreenLogo} style={styles.logo} />
          </View>
          
          {user ?
          <View>
            <View style={styles.titleContainer}>
              <H2 style={styles.text}>Hello {user.email.split('@')[0]}!</H2>
            </View>
            <View style={styles.contentContainer}>
                <Button
                  style={styles.goRideButton}
                  onPress={() => this.props.navigation.navigate('Search')}
                >
                  <Text>Go ride</Text>
                </Button>
            </View>
          </View>
          :
          <View>
            <View  style={styles.titleContainer}>
              <H2 style={styles.text}>An Easy-to-use</H2>
              <H2 style={styles.text}>Ridesharing App for HK</H2>
            </View>
            <View style={styles.contentContainer} >
              <Button
                style={styles.loginButton}
                onPress={() => this.props.navigation.navigate('LoginPage')}
              >
                <Text>Login</Text>
              </Button>
              <Button
                style={styles.signupButton}
                onPress={() => this.props.navigation.navigate('SignupPage')}
              >
                <Text>Signup</Text>
              </Button>
            </View>
          </View>
          }
        </ImageBackground>
      </Container>
    );
  }
}

export default WelcomePage;

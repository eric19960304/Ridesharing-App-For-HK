import React, { Component } from "react";
import { Keyboard } from 'react-native'
import {
  Container, Header, Title, Content, Button, Item, 
  Label, Input, Body, Left, Right, Icon, Form, Text, Toast
} from "native-base";
import { NavigationActions } from 'react-navigation';

import styles from "./styles";
import config from "../../../config";
import networkClient from "../../helpers/networkClient";

class SignupPage extends Component {

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  render() {
    const { email, password, confirmPassword,nickname } = this.state;

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Signup</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
            <Item floatingLabel>
              <Label style={styles.label}>Email</Label>
              <Input 
                value={email} 
                onChangeText={(email) => this.setState({email})}/>
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>Nickname</Label>
              <Input 
                value={nickname} 
                onChangeText={(nickname) => this.setState({nickname})}/>
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>Password</Label>
              <Input 
                secureTextEntry 
                value={password} 
                onChangeText={(password) => this.setState({password})}
              />
            </Item>
            <Item floatingLabel last>
              <Label style={styles.label}>Confirm Password</Label>
              <Input 
                secureTextEntry 
                value={confirmPassword} 
                onChangeText={(confirmPassword) => this.setState({confirmPassword})}
              />
            </Item>
          </Form>

          <Button 
            block 
            style={styles.signupButton}
            onPress={this.onFormSubmit}>
            <Text>Sign Up</Text>
          </Button>
        </Content>
      </Container>
    );

  };

  async onFormSubmit(){
    const { email, nickname, password, confirmPassword  } = this.state;
    
    // check if form input valid
    let errorMessage = null;
    if(email.length === 0){
      errorMessage = "Please enter your email.";
    }
    if(nickname.length === 0){
      errorMessage = "Please enter your nickname.";
    }
    if(password.length === 0){
      errorMessage = "Please enter your password.";
    }
    if(confirmPassword.length === 0){
      errorMessage = "Password not match, please check again.";
    }
    if(password !== confirmPassword){
      errorMessage = "passwords do not match, please confirm.";
    }
    if(errorMessage){
      Toast.show({
        text: message,
        textStyle: { textAlign: 'center' },
        type: "warning",
        position: "top"
      });
      return;
    }
  
    // send request to backend
    const url = config.serverURL + '/auth/signup';
    const body ={
        email: email.toLowerCase(),
        nickname,
        password,
    };
    const response = await networkClient.POST(url, body);
    // check return value from backend
    const successMessage = "Signup successful, please check your email for activate link";
    const failMessage = 'something go wrong, please try again later!';
    if(response.success){
      // signup successful

      Toast.show({
        text: successMessage,
        textStyle: { textAlign: 'center' },
        type: "success",
        position: "top",
        duration: 3000
      });

      Keyboard.dismiss();
      // reset navigation to welcomepage
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'WelcomePage'})
        ]
      });
      this.props.navigation.dispatch(resetAction);

    }else if(response.message){
      // signup fails
      Toast.show({
        text: response.message,
        textStyle: { textAlign: 'center' },
        type: "danger",
        position: "top",
      });
    }else{
      // server error
      Toast.show({
        text: failMessage,
        textStyle: { textAlign: 'center' },
        type: "danger",
        position: "top",
      });
    }

  } // end of onFormSubmit

}

export default SignupPage;

import React, { Component } from "react";
import { Keyboard } from 'react-native'
import {
  Container, Header, Title, Content, Button, Item, 
  Label, Input, Body, Left, Right, Icon, Form, Text, Toast
} from "native-base";
import styles from "./styles";

import auth from "../../helpers/auth";



class SignupPage extends Component {

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  render() {
    const { email, password, confirmPassword } = this.state;

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
    const { email, password, confirmPassword } = this.state;
    if(email.length === 0){
      Toast.show({
        text: "Please enter your email.",
        textStyle: { textAlign: 'center' },
        type: "warning",
        position: "top"
      });
      return;
    }

    if(password.length === 0){
      Toast.show({
        text: "Please enter your password.",
        textStyle: { textAlign: 'center' },
        type: "warning",
        position: "top"
      });
      return;
    }

    if(confirmPassword.length === 0){
      Toast.show({
        text: "Password not match, please check again.",
        textStyle: { textAlign: 'center' },
        type: "warning",
        position: "top"
      });
      return;
    }

    if(password !== confirmPassword){
      Toast.show({
        text: "passwords do not match, please confirm.",
        textStyle: { textAlign: 'center' },
        type: "warning",
        position: "top"
      });
      return;
    }

    
    try{

      let result = {
        isSuccess: false,
        message: 'something go wrong, please try again later!'
      };
      
      result = await auth.signup(email, password);
      
      if(result.isSuccess === true){

        Toast.show({
          text: result.message,
          textStyle: { textAlign: 'center' },
          type: "success",
          position: "top",
          duration: 3000
        });

        Keyboard.dismiss();
        this.props.navigation.navigate('WelcomePage');

      }else{
        Toast.show({
          text: result.message,
          textStyle: { textAlign: 'center' },
          type: "danger",
          position: "top",
        });
      }

    }catch(e){
      console.log(e);
    }

  } // end of onFormSubmit

}

export default SignupPage;

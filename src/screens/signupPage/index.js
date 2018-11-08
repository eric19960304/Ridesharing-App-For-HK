import React, { Component } from "react";
import {
  Container, Header, Title, Content, Button, Item, 
  Label, Input, Body, Left, Right, Icon, Form, Text, Toast
} from "native-base";
import styles from "./styles";

import helpers from "../../helpers";

const { auth, StorageManager } = helpers;
const storageManager = StorageManager.getInstance();

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
              <Label>Email</Label>
              <Input 
                value={email} 
                onChangeText={(email) => this.setState({email})}/>
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input 
                secureTextEntry 
                value={password} 
                onChangeText={(password) => this.setState({password})}
              />
            </Item>
            <Item floatingLabel last>
              <Label>Confirm Password</Label>
              <Input 
                secureTextEntry 
                value={confirmPassword} 
                onChangeText={(confirmPassword) => this.setState({confirmPassword})}
              />
            </Item>
          </Form>

          <Button 
            block 
            style={{ margin: 15, marginTop: 50 }} 
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
        text: "Please enter your password again.",
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

        let user = {
          email,
          jwt: result.jwt
        }

        storageManager.setUser(user);

        Toast.show({
          text: "Signup successful!",
          textStyle: { textAlign: 'center' },
          type: "success",
          position: "top",
          duration: 3000
        });

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

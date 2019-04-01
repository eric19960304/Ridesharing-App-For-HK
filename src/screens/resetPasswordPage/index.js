import React, { Component } from "react";
import { Keyboard } from 'react-native'
import {
  Container, Header, Title, Content, Button, Item, Label,
  Input, Body, Left, Right, Icon, Form, Text, Toast
} from "native-base";

import styles from "./styles";
import config from "../../../config";
import networkClient from "../../helpers/networkClient";

class ResetPasswordPage extends Component {

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.sendResetLink = this.sendResetLink.bind(this);
  }

  render() {
    const { email } = this.state;

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon type="MaterialIcons" name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Reset PW</Title>
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
          </Form>

          <Button block style={styles.loginButton} onPress={this.sendResetLink}>
            <Text>Send reset link</Text>
          </Button>
        </Content>
      </Container>
    );

  };

  async sendResetLink(){

    const { email } = this.state;

    // check if form input valid
    let errorMessage = null;
    if(email.length==0){
      errorMessage = "Please enter your email.";
    }
    if(errorMessage){
      Toast.show({
        text: errorMessage,
        textStyle: { textAlign: 'center' },
        type: "warning",
        position: "top"
      });
      return;
    }
    
    // send request to backend
    const url = config.serverURL + '/auth/reset-password/request';
    const body ={
        email: email.toLowerCase()
    };
    networkClient.POST(url, body, (response)=>{
      // check return value from backend
      let successMessage = response.message;

      Toast.show({
        text: successMessage,
        textStyle: { textAlign: 'center' },
        type: successMessage === 'Link sent' ? 'success' : 'danger' ,
        position: "top",
        duration: 5000
      });

      this.props.navigation.goBack();
    });

  } // end of onFormSubmit

  

}

export default ResetPasswordPage;

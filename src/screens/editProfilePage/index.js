import React, { Component } from "react";
import { Keyboard } from 'react-native';
import helpers from "../../helpers";
import {
  Container, Header, Title, Content, Button, Item, 
  Label, Input, Body, Left, Right, Icon, Form, Text, Toast
} from "native-base";
import * as Expo from 'expo';
import { Avatar } from 'react-native-elements';

import styles from "./styles";
import config from "../../../config";
import networkClient from "../../helpers/networkClient";

const storageManager = helpers.StorageManager.getInstance();

class EditProfilePage extends Component {

  constructor(props){
    super(props);
    const user = storageManager.get('user');
    this.state = {
      avatarSource: null,
      email: user.email,
      nickname: user.nickname,
      password: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  render() {
    const { avatarSource, email, nickname, password, newPassword, confirmPassword } = this.state;
    
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon type="MaterialIcons" name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Edit Profile</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          
          { avatarSource ?
            <Avatar
              large
              rounded
              block
              source={{uri: avatarSource}}
              activeOpacity={0.7}
              onPress={this._pickImage}
            />
            :
            <Avatar
              large
              rounded
              block
              source={{uri: "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"}}
              activeOpacity={0.7}
              onPress={this._pickImage}
            />
          }
          <Text>Click icon to select an image from device</Text>
          
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
              <Label style={styles.label}>Current Password</Label>
              <Input 
                secureTextEntry 
                value={password} 
                onChangeText={(password) => this.setState({password})}
              />
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>New Password</Label>
              <Input 
                secureTextEntry 
                value={newPassword} 
                onChangeText={(newPassword) => this.setState({newPassword})}
              />
            </Item>
            <Item floatingLabel last>
              <Label style={styles.label}>Confirm New Password</Label>
              <Input 
                secureTextEntry 
                value={confirmPassword} 
                onChangeText={(confirmPassword) => this.setState({confirmPassword})}
              />
            </Item>
          </Form>

          <Button block 
            style={styles.submitButton}
            onPress={this.onFormSubmit}>
            <Text>Submit</Text>
          </Button>
        </Content>
      </Container>
    );

  }; // end of render

  _pickImage = async () => {
    let result = await Expo.ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ avatarSource: result.uri });
    }
  };

  async onFormSubmit(){
    const { email, nickname, password, newPassword, confirmPassword  } = this.state;
    
    let errorMessage = null;
    if(email.length === 0){
      errorMessage = "Please enter your email.";
    }
    if(nickname.length === 0){
      errorMessage = "Please enter your nickname.";
    }

    let body = {};
    let response = null;

    if(password.length === 0 && newPassword.length === 0 && confirmPassword.length === 0){
      // not update password

      if(errorMessage){
        Toast.show({
          text: errorMessage,
          textStyle: { textAlign: 'center' },
          type: "warning",
          position: "top"
        });
        return;
      }

      // prepare the request body
      for(const k in this.state){
        if(this.state[k]) body[k] = this.state[k];
      }
      delete body['password'];
      delete body['newPassword'];
      delete body['confirmPassword'];
      /*
      post body format: {
        email: string,
        nickname: string
      }
      */

      // send request to backend
      response = await networkClient.POSTWithJWT(
        config.serverURL + '/api/user/edit-profile', 
        body
      );

    }else{
      // update password
      if(password.length === 0){
        errorMessage = "Please enter your current password.";
      }
      if(newPassword.length === 0){
        errorMessage = "Please enter your new password.";
      }
      if(confirmPassword.length === 0){
        errorMessage = "Please enter the password again.";
      }
      if(newPassword !== confirmPassword){
        errorMessage = "Two new passwords do not match, please confirm.";
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

      // prepare the request body
      for(const k in this.state){
        if(this.state[k]) body[k] = this.state[k];
      }
      delete body['confirmPassword'];
      /*
      post body format: {
        email: string,
        nickname: string,
        password: string,
        newPassword: string
      }
      */

      response = await networkClient.POSTWithJWT(
        config.serverURL + '/api/user/edit-profile-with-password', 
        body
      );

    }
  
    // check return value from backend
    const successMessage = "Profile Update successful!";
    const failMessage = 'something go wrong, please try again later!';
    if(response.success){
      // profile update success

      Toast.show({
        text: successMessage,
        textStyle: { textAlign: 'center' },
        type: "success",
        position: "top",
        duration: 3000
      });

      Keyboard.dismiss();

    }else if(response.message){
      // profile update fail
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

export default EditProfilePage;

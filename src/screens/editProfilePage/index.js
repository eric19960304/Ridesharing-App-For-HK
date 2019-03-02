import React, { Component } from "react";
import { Keyboard } from 'react-native';
import { View } from "react-native";
import {
  Container, Header, Title, Content, Button, Item, 
  Label, Input, Body, Left, Right, Icon, Form, Text, Toast
} from "native-base";
import * as Expo from 'expo';

import { Avatar } from 'react-native-elements';
import { Switch } from 'react-native'

import styles from "./styles";
import config from "../../../config";
import networkClient from "../../helpers/networkClient";
import StorageManager from '../../helpers/storageManager';
import MyView from './MyView';

const storageManager = StorageManager.getInstance();

class EditProfilePage extends Component {

  constructor(props){
    super(props);
    const user = storageManager.get('user');
    this.state = {
      avatarSource: user.avatarSource,
      email: user.email,
      nickname: user.nickname,
      password: '',
      newPassword: '',
      confirmPassword: '',
      isDriver: user.isDriver,
      carplate: user.carplate,
      contact: user.contact,
    };
    
    //console.log(user.avatarSource);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }



 
  render() {
    const { avatarSource, email, nickname, password, newPassword, confirmPassword,isDriver,carplate,contact } = this.state;
    const user = storageManager.get('user');
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
        <View style={styles.avatarGroup}>
        { avatarSource ?
            <Avatar
              xlarge
              rounded
              block
              source={{uri: 'data:image/png;base64,'+avatarSource}}
              activeOpacity={0.7}
              onPress={this._pickImage}
            />
            :
            <Avatar
              xlarge
              rounded
              block
              source={{uri: "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"}}
              activeOpacity={0.7}
              onPress={this._pickImage}
            />
          }
          <Text>Click icon to select an image from device</Text>
        </View>
          
          
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
            
            
            <View style={styles.switch}>
               <Text style={{color: 'grey',fontSize: 17}}>I am also a driver</Text>
              <Switch  
              value = {isDriver}
              onValueChange = {(value) =>this.setState({isDriver: value})}/>
            </View>
            
           
            <MyView hide={!this.state.isDriver}>
            <Item floatingLabel>
              <Label style={styles.label}>Car Plate</Label>
              <Input 
                value={carplate} 
                onChangeText={(carplate) => this.setState({carplate})}
              />
            </Item>
            </MyView>
            
            <Item floatingLabel>
              <Label style={styles.label}>Contact Number</Label>
              <Input 
                value={contact} 
                onChangeText={(contact) => this.setState({contact})}
              />
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
    let profilePicResult = await Expo.ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    let profilePicResult64=profilePicResult.base64;
    //let avatarSource=profilePicResult64;
    if (!profilePicResult64.cancelled) {
      this.setState({ avatarSource: profilePicResult64 });
    }
    //console.log(avatarSource);
  };

  async onFormSubmit(){
    const { avatarSource, email, nickname, password, newPassword, confirmPassword } = this.state;
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
        if(this.state[k]!=null && this.state[k]!='' ) body[k] = this.state[k];
      }
      delete body['password'];
      delete body['newPassword'];
      delete body['confirmPassword'];
      
      //console.log(body);
      storageManager.update('user',body);
      
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
      //console.log(body);
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

import React, { Component } from "react";
import {
  Container, Header, Title, Content, Text, Button,
  Icon, Left, Right, Body, Separator, ListItem, Toast
} from "native-base";
import { NavigationActions } from 'react-navigation';

import styles from "./styles";
import StorageManager from "../../helpers/storageManager";

const storageManager = StorageManager.getInstance();

class SettingPage extends Component {

  constructor(props){
    super(props);

    this.onLogout = this.onLogout.bind(this);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Setting</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Separator bordered>
            <Text>Account Management</Text>
          </Separator>
          <ListItem>
            <Text>Edit Profile (TODO)</Text>
          </ListItem>
          <ListItem>
            <Text>Change Password (TODO)</Text>
          </ListItem>
          <Separator bordered>
            <Text>App Setting</Text>
          </Separator>
          <ListItem onPress={this.onLogout}>
            <Text>Logout</Text>
          </ListItem>
          
        </Content>

      </Container>
    );
  }

  onLogout(){
    storageManager.remove('user');
    storageManager.remove('jwt');
    
    Toast.show({
      text: "Logout Successful.",
      textStyle: { textAlign: 'center' },
      type: "success",
      duration: 3000,
      position: "top"
    });
    // reset navigation to welcomepage
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'WelcomePage'})
      ]
    });
    this.props.navigation.dispatch(resetAction);
    
  }
}

export default SettingPage;

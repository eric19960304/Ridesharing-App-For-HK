import React from 'react';
import {
  Container, Header, Title, Button,
  Icon, Left, Right, Body
} from "native-base";

import styles from "./styles";
import SocketIOClient from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';
import { StorageManager } from "../../helpers";
import config from '../config';

const storageManager = StorageManager.getInstance();

class MessagePage extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      messages: [],
      user: null
    };

    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this.storeMessages = this.storeMessages.bind(this);

    // Creating the socket-client instance will automatically connect to the server.
    this.socket = SocketIOClient(config.serverURL);
    this.determineUser();
    this.socket.on('message', this.onReceivedMessage);
  }

  render() {
    const user = (this.state.user || -1 );

    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon type="MaterialIcons" name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Message</Title>
          </Body>
          <Right />
        </Header>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={user}
        />

      </Container>
    );

  };

  determineUser() {
    const USER = storageManager.get('user').email;
    this.state.user = {'id': USER};
    this.socket.emit('userJoined', {'text': USER});
  }

  onReceivedMessage(messages) {
    this.storeMessages(messages);
  }

  onSend(messages=[]) {
    //sendMsg = 
    this.socket.emit('message', messages[0]);
    this.storeMessages(messages);
  }

  // Helper functions
  storeMessages(messages) {
    this.setState((previousState) => {
      console.log(messages);
      console.log(previousState.messages);
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

}

export default MessagePage;
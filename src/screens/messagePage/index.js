import React from 'react';
import {
  Container, Header, Title, Button,
  Icon, Left, Right, Body
} from "native-base";

import styles from "./styles";
import SocketIOClient from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';
import StorageManager from "../../helpers/storageManager";
import config from '../../../config';

const storageManager = StorageManager.getInstance();

class MessagePage extends React.Component {

  constructor(props) {
    super(props);

    const email = storageManager.get('user').email;

    this.state = {
      messages: [],
      user: { 'id': email } 
    };

    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this.storeMessages = this.storeMessages.bind(this);

    this.socket = SocketIOClient(config.serverURL);
  }

  render() {
    // Creating the socket-client instance will automatically connect to the server.
    const email = storageManager.get('user').email;
    
    this.socket.emit('userJoined', {'text': email});
    this.socket.on('message', this.onReceivedMessage);

    const { user } = this.state;
    console.log(user);

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

  onReceivedMessage(messages) {
    this.storeMessages(messages);
  }

  onSend(messages=[]) {
    //sendMsg
    if(messages.length > 0){
      
      let m = Object.assign({}, messages[0]);
      m.messageId = m._id;
      delete m._id;

      this.socket.emit('message', m);
      this.storeMessages(messages);
    }
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
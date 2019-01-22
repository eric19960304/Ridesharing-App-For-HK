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
      userEmail: { _id: email } 
    };

    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this.storeMessages = this.storeMessages.bind(this);

    this.socket = SocketIOClient(config.serverURL);
    this.socket.emit('userJoined', { 'email': email });
    this.socket.on('message', this.onReceivedMessage);
  }

  render() {
    // Creating the socket-client instance will automatically connect to the server.
    
    const { userEmail, messages } = this.state;

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
          messages={messages}
          onSend={this.onSend}
          user={userEmail}

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
  storeMessages(newMessage=[]) {
    this.setState( (prevState) => ({
      messages: GiftedChat.append(prevState.messages, newMessage)
    }));
  }

}

export default MessagePage;
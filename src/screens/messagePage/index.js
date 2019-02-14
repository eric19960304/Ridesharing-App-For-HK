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

    const userEmail = storageManager.get('user').email;

    this.state = {
      messages: [],
      userEmail: { _id: userEmail } 
    };

    this.socket = SocketIOClient(config.serverURL);
    this.socket.emit('userJoined', { 'email': userEmail });
    this.socket.on('message', this.storeMessages);
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

  onSend = (messages=[]) => {
    //sendMsg
    if(messages.length > 0){
      
      let m = Object.assign({}, messages[0]);
      m.messageId = m._id;
      delete m._id;

      this.socket.emit('message', m);
      this.storeMessages(messages);
    }
  }

  storeMessages = (messages) => {
    console.log(messages);
    this.setState( (prevState) => ({
      messages: GiftedChat.append(prevState.messages, messages)
    }));
  }

}

export default MessagePage;
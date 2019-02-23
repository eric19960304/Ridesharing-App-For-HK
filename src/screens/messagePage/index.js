import React from 'react';
import {
  Container, Header, Title, Button,
  Icon, Left, Right, Body, Toast, Text
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

    const userId = storageManager.get('user').userId;

    this.state = {
      messages: [],
      userId: { _id: userId } 
    };

    this.socket = SocketIOClient(config.serverURL);
    this.socket.emit('userJoined', { 'userId': userId });
    this.socket.on('message', this.storeMessages);
  }

  render() {
    // Creating the socket-client instance will automatically connect to the server.
    
    const { userId, messages } = this.state;

    console.log(userId);

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

        { 
          messages.length > 0 ?
          <GiftedChat
            messages={messages}
            // onSend={this.onSend}
            user={userId}
            renderInputToolbar={()=>null}
          />
          :
          <Text>You do not have any message.</Text>
        }
        

      </Container>
    );

  };

  // onSend = (messages=[]) => {
  //   //sendMsg
  //   if(messages.length > 0){
      
  //     let m = Object.assign({}, messages[0]);
  //     m.messageId = m._id;
  //     delete m._id;

  //     this.socket.emit('message', m);
  //     this.storeMessages(messages);
  //   }
  // }

  storeMessages = (messages) => {
    if(!this.props.navigation.isFocused()){
      Toast.show({
        text: 'New message: ' + messages.text,
        textStyle: { textAlign: 'center' },
        type: "success",
        position: "top",
        duration: 3000
      });
    }

    this.setState( (prevState) => ({
      messages: GiftedChat.append(prevState.messages, messages)
    }));
  }

}

export default MessagePage;
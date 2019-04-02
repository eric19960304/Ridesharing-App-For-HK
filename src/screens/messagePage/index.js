import React from 'react';
import {
  Container, Header, Title, Button,
  Icon, Left, Right, Body, Text
} from "native-base";

import styles from "./styles";
import SocketIOClient from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';
import StorageManager from "../../helpers/storageManager";
import config from '../../../config';
import logoSmall from '../../../assets/nblogo.png';

const storageManager = StorageManager.getInstance();

class MessagePage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      user: { _id: 1 }
    };

    
    this.userId = storageManager.get('user').userId;
    this.socket = SocketIOClient(config.serverURL);
    this.socket.emit('userJoined', { 'userId': this.userId });
    this.socket.on('message', this.storeMessages);
  }

  componentWillMount(){
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
  }

  componentDidFocus = (payload)=>{
    this.socket.emit('userClearUnread', { 'userId': this.userId });
  }

  componentWillUnmount(){
    this.socket.emit('userLeft', { 'userId': this.userId });
  }

  render() {
    // Creating the socket-client instance will automatically connect to the server.
    
    const { user, messages } = this.state;

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
            user={user}
            renderInputToolbar={()=>null}
            renderComposer={() => null}
            minInputToolbarHeight={0}
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
    if(messages===null || messages===undefined) return;

    // Toast.show({
    //   text: 'New message: \n' + messages.text,
    //   textStyle: { textAlign: 'center' },
    //   type: "success",
    //   position: "top",
    //   duration: 3000
    // });

    const _messages = messages.map(m=> {
      m.user.avatar = logoSmall;
      return m;
    });

    this.setState( (prevState) => ({
      messages: GiftedChat.append(prevState.messages, _messages)
    }));
  }

}

export default MessagePage;
import React, { Component } from "react";
import StorageManager from "../../helpers/storageManager";
import { View } from "react-native";
import {Avatar} from 'react-native-elements';
import {
  Content, Text, List, ListItem, Icon,
  Container, Left, Right, Badge
} from "native-base";

import styles from "./style";
import networkClient from "../../helpers/networkClient";
import config from "../../../config";

const storageManager = StorageManager.getInstance();
const datas = [
  // avalible icon list: https://fontawesome.com/
  {
    name: "Find Ride",
    route: "Search",
    icon: "map-marker",
  },
  {
    name: "Go Drive",
    route: "GoDrivePage",
    icon: "car",
  },
  {
    name: "Message",
    route: "MessagePage",
    icon: "comments",
    unreadMessagesCount: 0,
  },
  {
    name: "Setting",
    route: "SettingPage",
    icon: "cog",
  },
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      datas: datas
    };
  }

  componentWillMount(){
    this._updateMessageCountWorker = setInterval(this.updateUnreadMessagesCount, 5000);
  }

  componentWillUnmount(){
    clearInterval(this._updateMessageCountWorker);
  }

  render() {
    const user = storageManager.get('user');
    const avatarSource = user.avatarSource;
    const { datas } = this.state;

    return (
      <Container>
        <Content
          bounces={false}
          style={styles.content}
        >
          <View style={styles.flexContainer}>
            <View style={styles.avatarGroup}>
              { avatarSource ?
              <Avatar
                large
                rounded
                source={{uri: 'data:image/png;base64,'+user.avatarSource}}
                activeOpacity={0.7}
                onPress={()=>this.props.navigation.navigate('EditProfilePage')}
              />
              :
              <Avatar
                large
                rounded
                source={{uri: "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"}}
                activeOpacity={0.7}
                onPress={()=>this.props.navigation.navigate('EditProfilePage')}
              />
              }
            </View>

            <View style={styles.avatarGroup}>
              <Text style={styles.username}>
                {user.nickname}
              </Text>
            </View>
      
          </View>
                        
          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem button noBorder
                onPress={() => this.props.navigation.navigate(data.route)}
              >
                <Left>
                  <Icon active
                    type="FontAwesome"
                    name={data.icon}
                    style={styles.itemIcon}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                  { data.name ==='Message' &&
                    <Badge danger style={{marginLeft: 10}}>
                      <Text> { String(data.unreadMessagesCount) } </Text>
                    </Badge>
                  }
                </Left>
                
              </ListItem>
            }
          />

        </Content>
      </Container>
    );
  } // end of render

  updateUnreadMessagesCount = async () => {
    const response = await networkClient.POSTWithJWT(config.serverURL + '/api/user/unread-messages-count', {});
    if('count' in response){
      const count = Number(response.count);
      const { datas } = this.state;
      if(count != datas[2].unreadMessagesCount){
        let newDatas = [];
        datas.forEach( m => {
          newDatas.push(Object.assign({}, m));
        });
        newDatas[2].unreadMessagesCount = count;
        this.setState({
          datas: newDatas,
        });
      }
    }
    
  }

}


export default SideBar;

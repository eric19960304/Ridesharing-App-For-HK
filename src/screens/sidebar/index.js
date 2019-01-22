import React, { Component } from "react";
import helpers from "../../helpers";
import { View } from "react-native";
import {Avatar} from 'react-native-elements';
import {
  Content, Text, List, ListItem, Icon,
  Container, Left, Right, Badge
} from "native-base";
import styles from "./style";

const storageManager = helpers.StorageManager.getInstance();
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
      shadowRadius: 4
    };
  }

  render() {
    const user = storageManager.get('user');
    return (
      <Container>
        <Content
          bounces={false}
          style={styles.content}
        >
          <View style={styles.flexContainer}>
            <View style={styles.avatarGroup}>
                <Avatar
                  large
                  rounded
                  source={{uri: "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"}}
                  activeOpacity={0.7}
                  onPress={()=>this.props.navigation.navigate('EditProfilePage')}
                />
            </View>

            <View style={styles.avatarGroup}>
              <Text style={styles.username}>
                {user.nickname}
              </Text>
            </View>
      
          </View>
                        
          {this.renderList()}

        </Content>
      </Container>
    );
  } // end of render

  renderList(){
    return (
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
            </Left>
            { data.types &&
              <Right>
                <Badge style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {`${data.types} Types`}
                  </Text>
                </Badge>
              </Right>
            }
          </ListItem>
        }
      />
    )
  } // end of renderList
}

export default SideBar;

import React, { Component } from 'react';
import {
  View,
  Dimensions,
  InteractionManager,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body
} from "native-base";

import MapView from 'react-native-maps';
import styles from './styles';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 35.679976;
const LONGITUDE = 139.768458;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// 116423, 51613, 17
const OVERLAY_TOP_LEFT_COORDINATE1 = [35.68184060244454, 139.76531982421875];
const OVERLAY_BOTTOM_RIGHT_COORDINATE1 = [35.679609609368576, 139.76806640625];
const IMAGE_URL1 = 'https://i.kym-cdn.com/entries/icons/mobile/000/013/564/doge.jpg';
// 116423, 51615, 17
const OVERLAY_TOP_LEFT_COORDINATE2 = [35.67737855391474, 139.76531982421875];
const OVERLAY_BOTTOM_RIGHT_COORDINATE2 = [35.67514743608467, 139.76806640625];
const IMAGE_URL2 = 'https://i.ytimg.com/vi/Doxj7ACZSe4/hqdefault.jpg';

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      overlay1: {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE1, OVERLAY_BOTTOM_RIGHT_COORDINATE1],
        image: IMAGE_URL1,
      },
      overlay2: {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE2, OVERLAY_BOTTOM_RIGHT_COORDINATE2],
        image: IMAGE_URL2,
      },
      loading: true,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loading: false });
    });
  }

  render() {

    const { width, height } = Dimensions.get('window');
    const ratio = width / height;

    const coordinates = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922 * ratio,
    };


    return (
      
      <Container>
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
            <Title>Find Ride</Title>
          </Body>
          <Right />
        </Header>

        <Content scrollEnabled={false}>
          <View style={{ width, height }}>
            {this.state.loading ? (
              <Loading />
            ) : (
              <MapView
                style={styles.map}
                initialRegion={coordinates}
              />
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const Loading = () => (
  <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
);


export default Search;
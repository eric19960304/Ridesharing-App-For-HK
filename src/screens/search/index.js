import React, { Component } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import {
  Container, Header, Title, Content, Text, Button,
  Icon, Left, Right, Body, Spinner
} from "native-base";

import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import networkClient from "../../helpers/networkClient";
import config from "../../../config";


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 35.679976;
const LONGITUDE = 139.768458;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

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
      loading: true,
      markers: [],
      GOOGLE_MAP_API_KEY: null
    };

    this.mapView = null;

    this.resetMarker = this.resetMarker.bind(this);
  }

  componentWillMount() {
    networkClient.POSTWithJWT(config.serverURL + '/api/secret/google-map-api-key', {})
    .then( (data)=>{
      if(!data) return;

      if(data.googleMapApiKey){
        this.setState({
          GOOGLE_MAP_API_KEY: data.googleMapApiKey,
          loading: false
        });
      }else if(data.message){
        console.log(data.message);
      }
      
    })
    .catch( (error)=>{
      console.log(error);
    });
  }

  onMapPress(e) {
    if(this.state.markers.length <= 1){
      this.setState({
        markers: [
          ...this.state.markers,
          {
            coordinate: e.nativeEvent.coordinate,
            key: id++,
            color: randomColor(),
          },
        ],
      });
    }
  }

  resetMarker(){
    this.setState({ markers: [] });
    id = 0;
  }

  render() {

    const { width, height } = Dimensions.get('window');
    const ratio = width / height;
    const { GOOGLE_MAP_API_KEY } = this.state;

    const coordinates = {
      latitude: 22.28552, 
      longitude: 114.15769,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5 * ratio,
    };

    if(this.state.loading){
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
            <Loading />
          </View>
        </Content>
      </Container>
      )
    }

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

            <MapView 
              style={styles.map} 
              initialRegion={coordinates} 
              onPress={(e) => this.onMapPress(e)}
              ref={c => this.mapView = c}
            >

              {this.state.markers.map(marker => (
                <Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  pinColor={marker.color}
                />
              ))}

              {this.state.markers.length == 2 &&
                <MapViewDirections
                  origin={this.state.markers[0].coordinate}
                  destination={this.state.markers[1].coordinate}
                  apikey={GOOGLE_MAP_API_KEY}
                  strokeWidth={3}
                  strokeColor="#1E90FF"
                  onReady={(result) => {
                    this.mapView.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: (width / 20),
                        bottom: (height / 20),
                        left: (width / 20),
                        top: (height / 20),
                      }
                    });
                  }}
                />
              }
              
            </MapView>
            
            <View style={styles.buttonContainer}>
              <View style={styles.bubble}>
              {(() => {
                switch(this.state.markers.length) {
                  case 0:
                    return <Text>Tap to select starting point</Text>;
                  case 1:
                    return <Text>Tap to select end point</Text>;
                  case 2:
                    return <Button title="Reset" onPress={this.resetMarker}><Text>Reset</Text></Button>;
                  default:
                    return null;
                }
              })()}
              </View>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const Loading = () => (
  <View style={styles.container}>
    <Spinner color="blue" />
  </View>
);

export default Search;
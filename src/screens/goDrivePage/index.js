import React, { Component } from 'react';
import { Location } from "expo";
import {
  View,
  Dimensions,
} from 'react-native';
import {
  Container, Header, Title, Content, Text, Button,
  Icon, Left, Right, Body, Spinner
} from "native-base";

import MapView, { Marker } from 'react-native-maps';
import styles from './styles';
import networkClient from "../../helpers/networkClient";
import config from "../../../config";


const { width, height } = Dimensions.get('window');

class GoDrivePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.mapView = null;
    this.driverLocation = null;
  }

  componentWillMount() {
    this.updateLocation();
    this._updateLocationWorker = setInterval(this.updateLocation, 5000);
  }

  componentWillUnmount() {
    clearInterval(this._updateLocationWorker);
  }

  updateLocation = () => {
    Location.getCurrentPositionAsync({})
    .then( (data)=>{
      if(data){
        if(!this.driverLocation){
          this.driverLocation = data;
          this.sendLocationToServer(data);
        }

        let prevLocation = Object.assign({}, this.driverLocation);
        const prevLat = parseFloat(prevLocation.coords.latitude);
        const prevLong = parseFloat(prevLocation.coords.longitude);
        const currentLat = parseFloat(data.coords.latitude);
        const currentLong = parseFloat(data.coords.longitude);
        let latDiff = Math.abs(currentLat - prevLat);
        let longDiff = Math.abs(currentLong - prevLong);
        if(latDiff+longDiff > 0.001){
          this.driverLocation = data;
          this.sendLocationToServer(data);
        }
      }
    })
    .catch((err)=>{
      console.log('err:', err);
    });
  };

  sendLocationToServer(data){
    const url = config.serverURL + '/api/driver/location-update';
    const body ={
      location: data.coords,
      timestamp: data.timestamp,
    };
    networkClient.POSTWithJWT(url, body)
    .then((result)=>{
      console.log(result);
    })
    .catch(()=>{
      console.log('err:', err);
    });
  }

  render() {

    const { width, height } = Dimensions.get('window');

    if(this.state.loading){
      return(
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
              <Title>Go Drive</Title>
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
            <Title>Go Drive</Title>
          </Body>
          <Right />
        </Header>

        <Content scrollEnabled={false}>
          <View style={{ width, height }}>

            <MapView 
              style={styles.map} 
              scrollEnabled={false}
              showsUserLocation={true}
              followsUserLocation={true}
              ref={c => this.mapView = c}
            >

            </MapView>
            
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

export default GoDrivePage;
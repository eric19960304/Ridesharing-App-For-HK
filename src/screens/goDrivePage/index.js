import React, { Component } from 'react';
import { Location } from "expo";
import {
  View,
  Dimensions,
  Platform
} from 'react-native';
import {
  Container, Header, Title, Content, Button,
  Icon, Left, Right, Body, Spinner, Toast
} from "native-base";

import MapView, { Marker } from 'react-native-maps';
import styles from './styles';
import networkClient from "../../helpers/networkClient";
import config from "../../../config";

const { width, height } = Dimensions.get('window');
const ratio = width / height;

const initialCoordinates = {
  latitude: 22.28552, 
  longitude: 114.15769,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5 * ratio,
};

class GoDrivePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.mapView = null;
    this.driverLocation = null;

    this.displayRegion = {
      ...initialCoordinates,
      latitudeDelta: 0.05,
    longitudeDelta: 0.05 * ratio,
    }

  }

  componentWillMount() {
    Location.getProviderStatusAsync()
    .then((result)=>{
      console.log(result);
      if(result.locationServicesEnabled){
        this.updateLocation();
        this._updateLocationWorker = setInterval(this.updateLocation, 5000);
      }else{
        this._updateLocationWorker = setInterval(this.displayLocationNotEnabledWarning, 5000);
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  componentWillUnmount() {
    clearInterval(this._updateLocationWorker);
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
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Icon type="MaterialIcons" name="menu" />
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
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon type="MaterialIcons" name="menu" />
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
              initialRegion={initialCoordinates} 
              style={styles.map} 
              scrollEnabled={false}
              showsUserLocation={true}
              onUserLocationChange={(event) => this.userLocationChanged(event)}
              onRegionChange={this.regionChanged}
              followsUserLocation={true}
              showsMyLocationButton={true}
              ref={c => this.mapView = c}
            >

            </MapView>
            
          </View>
        </Content>
      </Container>
    );
  } // end of render

  userLocationChanged = (event) => {
    const newRegion = event.nativeEvent.coordinate;

    this.displayRegion = {
      ...this.displayRegion,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude
    };

    if(this.mapView) {
      this.mapView.animateToRegion(
        this.displayRegion, 
        1000
      );
    }
  }

  regionChanged = (event) => {
    this.displayRegion = {
        ...this.displayRegion,
        longitudeDelta: event.longitudeDelta,
        latitudeDelta: event.latitudeDelta,
    }
  }

  displayLocationNotEnabledWarning = ()=>{
    Toast.show({
      text: 'Please enable location service',
      textStyle: { textAlign: 'center' },
      type: "warning",
      position: "top"
    });
  }

  updateLocation = () => {

    if(!this.props.navigation.isFocused()){
      return;
    }

    Location.getCurrentPositionAsync({})
    .then( (data)=>{
      if(data){

        // /* send location to server only if the location is different in certain degree */
        // if(!this.driverLocation){
        //   this.driverLocation = data;
        //   this.sendLocationToServer(data);
        // }

        // let prevLocation = Object.assign({}, this.driverLocation);
        // const prevLat = parseFloat(prevLocation.coords.latitude);
        // const prevLong = parseFloat(prevLocation.coords.longitude);
        // const currentLat = parseFloat(data.coords.latitude);
        // const currentLong = parseFloat(data.coords.longitude);
        // let latDiff = Math.abs(currentLat - prevLat);
        // let longDiff = Math.abs(currentLong - prevLong);
        // if(latDiff+longDiff > 0.001){
        //   this.driverLocation = data;
        //   this.sendLocationToServer(data);
        // }

        // send location to server anyway to update the timestamp
        this.sendLocationToServer(data);

      }
    })
    .catch((err)=>{
      console.log('err:', err);
    });
  };

  sendLocationToServer = (data) => {
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

} // end of class 

const Loading = () => (
  <View style={styles.container}>
    <Spinner color="blue" />
  </View>
);

export default GoDrivePage;
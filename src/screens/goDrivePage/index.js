import React, { Component } from 'react';
import { Location } from "expo";
import {
  View, Dimensions,
} from 'react-native';
import {
  Container, Header, Title, Content, Button,
  Icon, Left, Right, Body, Spinner, Toast, Text,
} from "native-base";

import StorageManager from "../../helpers/storageManager";
import MapView, { Marker } from 'react-native-maps';
import styles from './styles';
import networkClient from "../../helpers/networkClient";
import config from "../../../config";

const storageManager = StorageManager.getInstance();

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
      onGoingRideDetails: null
    };

    this.mapView = null;
    this.driverLocation = null;

    this.displayRegion = {
      ...initialCoordinates,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ratio,
    }

    this.user = storageManager.get('user');
  }

  componentWillMount() {
    this.user = storageManager.get('user');
    if(!this.user.isDriver){
      this._updateLocationWorker = null;
      return;
    };

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
    this.user = storageManager.get('user');

    if(!this.user.isDriver){
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

          <Content 
            scrollEnabled={false} 
            contentContainerStyle={styles.centerContainer}
          >
            <View style={styles.centerEverything}>
              <Text style={styles.centerText} >
                Please first provide the details of your car!
              </Text>

              <Button block 
                style={styles.centerButton}
                onPress={() => this.props.navigation.navigate('EditProfilePage')}>
                <Text>Go to profile page</Text>
              </Button>
              
            </View>

          </Content>
        </Container>
      )
    }

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
        // send location to server anyway to update the timestamp
        this.sendLocationToServer(data);
      }
    })
    .catch((err)=>{
      console.log('err:', err);
    });
  };

  sendLocationToServer = async (data) => {
    const { onGoingRideDetails } = this.state;
    const url = config.serverURL + '/api/driver/update';
    const body ={
      location: data.coords,
      timestamp: new Date(),
    };
    let response = await networkClient.POSTWithJWT(url, body);
    console.log(response);
    if( response && (!onGoingRideDetails || onGoingRideDetails.length !== response.length) ){
      // has new matched ride request
      this.setState({
        onGoingRideDetails: response
      });
    }
  }

} // end of class 

const Loading = () => (
  <View style={styles.container}>
    <Spinner color="blue" />
  </View>
);

export default GoDrivePage;
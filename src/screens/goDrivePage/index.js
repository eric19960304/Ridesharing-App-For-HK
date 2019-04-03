import React, { Component } from 'react';
import { Location } from "expo";
import {
  View, Dimensions
} from 'react-native';
import {
  Container, Header, Title, Content, Button,
  Icon, Left, Right, Body, Spinner, Toast, Text,
} from "native-base";

import StorageManager from "../../helpers/storageManager";
import MapView, { Marker } from 'react-native-maps';
import styles from './styles';
import networkClient from "../../helpers/networkClient";
import MapViewDirections from 'react-native-maps-directions';
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
      loading: true,
      rideRequests: [],
      matchedRideRequests: [],
      GOOGLE_MAP_API_KEY: null
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

    networkClient.POSTWithJWT(
      config.serverURL + '/api/secret/google-map-api-key', 
      {},
      (data)=>{
        if(!data) return;

        if(data.googleMapApiKey){
          this.setState({
            GOOGLE_MAP_API_KEY: data.googleMapApiKey,
            loading: false
          });
        }
      }
    );

    Location.getProviderStatusAsync()
    .then((result)=>{
      if(result.locationServicesEnabled){
        this.updateLocation();
        this._updateLocationWorker = setInterval(this.updateLocation, 5000);
      }else{
        this._updateLocationWorker = setInterval(this.displayLocationNotEnabledWarning, 5000);
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this._updateLocationWorker);
  }

  render() {
    const { width, height } = Dimensions.get('window');
    this.user = storageManager.get('user');

    const { rideRequests, matchedRideRequests, GOOGLE_MAP_API_KEY } = this.state;
    const colors = [];

    let rideRequestsToDisplay;
    if(matchedRideRequests.length > 0){
      rideRequestsToDisplay = matchedRideRequests;
    }else{
      rideRequestsToDisplay = rideRequests;
    }
    
    if(rideRequestsToDisplay){
      rideRequestsToDisplay.forEach( _ =>{
        colors.push(this.randomColor());
      });
    }
    
    const startPoints = [];
    if(rideRequestsToDisplay){
      rideRequestsToDisplay.forEach( (q) =>{
        startPoints.push(q.startLocation);
      });
    }

    const endPoints = [];
    if(rideRequestsToDisplay){
      rideRequestsToDisplay.forEach( (q) =>{
        endPoints.push(q.endLocation);
      });
    }

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
          <View style={{ width, height: height }}>

            <MapView 
              initialRegion={initialCoordinates} 
              style={styles.map} 
              scrollEnabled={true}
              showsUserLocation={true}
              onMapReady={ this.moveToUserLocation }
              ref={c => this.mapView = c}
            >

              { rideRequestsToDisplay.length > 0 &&
                rideRequestsToDisplay.map( (req, idx) => (
                  <MapViewDirections
                    key={idx}
                    origin={req.startLocation}
                    destination={req.endLocation}
                    apikey={GOOGLE_MAP_API_KEY}
                    strokeWidth={3}
                    strokeColor={colors[idx]}
                  />
                ))
              }

              {startPoints.map( (p, idx) => (
                <Marker
                  key={idx}
                  coordinate={p}
                  pinColor={colors[idx]}
                />
              ))}

              {endPoints.map( (p, idx) => (
                <Marker
                  key={idx}
                  coordinate={p}
                  pinColor={colors[idx]}
                >
                  <Icon
                    type="FontAwesome"
                    name="flag"
                    style={{ width: 40, color: colors[idx] }}
                  />
                </Marker>
              ))}

            </MapView>
            
          </View>
        </Content>
      </Container>
    );
  } // end of render

  moveToUserLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const coordinates = {
      latitude: location.coords.latitude, 
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ratio,
    };

    if(this.mapView) {
      this.mapView.animateToRegion(coordinates, 1000);
    }
  }

  randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
  };

  sendLocationToServer = async (data) => {
    const { rideRequests, matchedRideRequests } = this.state;
    const url = config.serverURL + '/api/driver/update';
    const body ={
      location: data.coords,
      timestamp: (new Date()).getTime(),
    };
    networkClient.POSTWithJWT(url, body, (response)=>{
      if( response && 
        (rideRequests.length !== response.allRideRequests.length ||
         matchedRideRequests.length !== response.onGoingRides.length) ){
        // has new matched ride request
        this.setState({
          rideRequests: response.allRideRequests,
          matchedRideRequests: response.onGoingRides
        });
      }
    });
  }

} // end of class 

const Loading = () => (
  <View style={styles.container}>
    <Spinner color="blue" />
  </View>
);

export default GoDrivePage;
import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Image,
} from 'react-native';
import {
  Container, Header, Title, Content, Text, Button,
  Icon, Left, Right, Body, Spinner, Toast
} from "native-base";
import { Location, } from 'expo';

import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import networkClient from "../../helpers/networkClient";
import config from "../../../config";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import carMarkerImage from "../../../assets/logo.png";

const { width, height } = Dimensions.get('window');

const ratio = width / height;
const coordinates = {
  latitude: 22.28552, 
  longitude: 114.15769,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5 * ratio,
};
let markerId = 0;
let driverId = 0;
class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      markers: [],
      drivers: [],
      mapRegion: null,
      GOOGLE_MAP_API_KEY: null,
    };

    this.displayRegion = {
      ...coordinates,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ratio,
    }

    this.mapView = null;

    // this.resetMarker = this.resetMarker.bind(this);
    //this.setMarker = this.setMarker.bind(this);
    //this.setEndPointMarker = this.setEndPointMarker.bind(this);
    this.renderResetButton = this.renderResetButton.bind(this);
    this.submitRideRequest = this.submitRideRequest.bind(this);
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

    this._updateDriverLocationWorker = setInterval(this.getDriverLocation, 5000);
  }

  componentDidMount(){
    this.getDriverLocation();
  }

  componentWillUnmount() {
    clearInterval(this._updateDriverLocationWorker);
  }

  getDriverLocation = () => {
    if(!this.props.navigation.isFocused()){
      return;
    }

    const url = config.serverURL + '/api/driver/get-all-drivers-location';
    const body = {};
    networkClient.POSTWithJWT(url, body)
    .then((locationList)=>{
      this.setState({ drivers: [] });
      driverId = 0
      //console.log('location list: ', locationList);
      for (i in locationList){
        this.setState({
          drivers: [
            ...this.state.drivers,
            {
              coordinate: {latitude: locationList[i].location.latitude, longitude: locationList[i].location.longitude},
              key: 'driver' + driverId++,
            }
          ]
        });
      }
    })
    .catch(()=>{
      console.log('err:', err);
    });
  }

  render() {

    const { width, height } = Dimensions.get('window');
    const { GOOGLE_MAP_API_KEY, isMoveWithUser } = this.state;

    const numberOfMarkers = this.state.markers.length;
    

    if(this.state.loading){
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
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon type="MaterialIcons" name="menu" />
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
              showsMyLocationButton={true}
              region = {this.state.mapRegion || undefined} 
              showsUserLocation={true}
              onPress={(e) => this.onMapPress(e)}
              onMapReady={ this.moveToUserLocation }
              ref={c => this.mapView = c}
            >

              {this.state.markers.map(marker => (
                <Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  pinColor={marker.color}
                />
              ))}


              {this.state.drivers.map(driver => (
                <Marker
                  image={carMarkerImage}
                  key={driver.key}
                  coordinate={driver.coordinate}
                  style={{width: 10, height: 10}}
                />
              ))}

              {numberOfMarkers == 2 &&
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

                <GooglePlacesAutocomplete
                  placeholder='Search'
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed={false}   // true/false/undefined
                  fetchDetails={true}
                  renderDescription={row => row.description} // custom description render
                  onPress={(data, details = null) => this.changeMapRegion(data, details)}
                  editable={ numberOfMarkers == 2 ? false : true }
                  getDefaultValue={() => ''}
                  
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyCMF65pXtPakOIuMSSkuTxeJ5AYQ-17bt8',
                    language: 'en', // language of the results
                    // secondary_text: 'Hong Kong'
                    // types: 'HK' // default: 'geocode'
                    components: 'country:hk'
                  }}
                  
                  styles={styles.searchBar}
                  
                  // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                  // currentLocationLabel="Current location"
                  // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                  // predefinedPlaces={[homePlace, workPlace]}

                  debounce={500} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                  // renderLeftButton={
                  //   ()  => numberOfMarkers == 0 && <Text>Start point</Text> 
                  //   || numberOfMarkers == 1 && <Text>End point</Text>
                  // }
                  renderRightButton={
                    () => numberOfMarkers == 2 && this.renderResetButton()}

                  ref={(instance) => { this.GooglePlacesRef = instance }}
                />

              { numberOfMarkers == 2 &&
                <View style={styles.buttonContainer}>
                  <View style={styles.bubble}>
                  
                    <Button title="Submit" onPress={this.submitRideRequest}>
                      <Text>Submit</Text>
                    </Button>
                  
                  </View>
                </View>
              }

          </View>
          
          
        </Content>
      </Container>
    );
  }

  renderResetButton(){
    return (
      <Button onPress={
        () => this.resetMarker()
      }>
        <Text>Reset</Text>
      </Button>
    )
  }

  async submitRideRequest(){
    const { markers } = this.state;
    console.log('markers:', markers);

    let body = {
      startLocation: markers[0].coordinate,
      endLocation: markers[1].coordinate,
      timestamp: (new Date()).getTime(),
    };

    const response = await networkClient.POSTWithJWT(
      config.serverURL + '/api/rider/real-time-ride-request',
      body
    );
    console.log(response);

    Toast.show({
      text: 'Request sent, matching ...',
      textStyle: { textAlign: 'center' },
      type: "success",
      position: "top",
    });
  }

  changeMapRegion(data, details){
    //console.log(data, details);
    if(this.state.markers.length <= 1){
      this.setState({
        mapRegion: {
          latitude: details.geometry.location.lat, 
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ratio,
        }
      });
  
      this.GooglePlacesRef.setAddressText("");
    }
  }
  
  onMapPress(e) {
    if(this.state.markers.length <= 1){
      this.setState({
        markers: [
          ...this.state.markers,
          {
            coordinate: e.nativeEvent.coordinate,
            key: markerId++,
            color: this.randomColor(),
          },
        ],
      });
    }
  }
  
  resetMarker(){
    this.setState({ markers: [] });
    markerId = 0;
  }

  randomColor(){
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

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

}


const Loading = () => (
  <View style={styles.container}>
    <Spinner color="blue" />
  </View>
);

export default Search;
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
import { TextInput } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width, height } = Dimensions.get('window');

const ratio = width / height;
const coordinates = {
  latitude: 22.28552, 
  longitude: 114.15769,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5 * ratio,
};
let markerId = 0;

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      startPointMarker: null,
      endPointMarker: null,
      GOOGLE_MAP_API_KEY: null,
    };

    this.mapView = null;

    // this.resetMarker = this.resetMarker.bind(this);
    //this.setStartPointMarker = this.setStartPointMarker.bind(this);
    //this.setEndPointMarker = this.setEndPointMarker.bind(this);
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

  setStartPointMarker(data, details){
    //console.log(data, details);
    console.log(details.geometry.location);
    var newCoordinate = new Object({ latitude: details.geometry.location.lat ,longitude: details.geometry.location.lng });
    this.setState({
      startPointMarker: 
        {
          coordinate: newCoordinate,
          key: markerId++,
          color: randomColor(),
        }
    });
    
    //this.GooglePlacesAutocomplete.editable = false
  }

  setEndPointMarker(data, details){
    //console.log(data, details);
    console.log(details.geometry.location);
    var newCoordinate = new Object({ latitude: details.geometry.location.lat ,longitude: details.geometry.location.lng });
    this.setState({
      endPointMarker: 
        {
          coordinate: newCoordinate,
          key: markerId++,
          color: randomColor(),
        },
    });
    
    //this.GooglePlacesAutocomplete.editable = false
  }

  // onMapPress(e) {
  //   if(this.state.markers.length <= 1){
  //     this.setState({
  //       markers: [
  //         ...this.state.markers,
  //         {
  //           coordinate: e.nativeEvent.coordinate,
  //           key: markerId++,
  //           color: randomColor(),
  //         },
  //       ],
  //     });
  //   }
  // }
  
  // resetMarker(){
  //   this.setState({ markers: [] });
  //   markerId = 0;
  // }

  render() {

    const { width, height } = Dimensions.get('window');
    const { GOOGLE_MAP_API_KEY } = this.state;

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
              //onPress={(e) => this.onMapPress(e)}
              ref={c => this.mapView = c}
            >

              {this.state.startPointMarker != null &&
                <Marker
                  key={this.state.startPointMarker.key}
                  coordinate={this.state.startPointMarker.coordinate}
                  pinColor={this.state.startPointMarker.color}
                />
              }

              {this.state.endPointMarker != null &&
                <Marker
                  key={this.state.endPointMarker.key}
                  coordinate={this.state.endPointMarker.coordinate}
                  pinColor={this.state.endPointMarker.color}
                />
              }

              {this.state.startPointMarker != null && this.state.endPointMarker != null &&
                <MapViewDirections
                  origin={this.state.startPointMarker.coordinate}
                  destination={this.state.endPointMarker.coordinate}
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
            
            <View style={styles.viewContainer}>
              <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed='false'   // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => this.setStartPointMarker(data, details)}
                
                getDefaultValue={() => ''}
                
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: 'AIzaSyCMF65pXtPakOIuMSSkuTxeJ5AYQ-17bt8',
                  language: 'en', // language of the results
                  // secondary_text: 'Hong Kong'
                  // types: 'HK' // default: 'geocode'
                }}
                
                styles={{ 
                  textInputContainer: {
                    width: '100%'
                  },
                  listView: {
                    backgroundColor: 'white',
                  },
                  description: {
                    fontWeight: 'bold',
                  },
                }}
                
                // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                // currentLocationLabel="Current location"
                // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                // predefinedPlaces={[homePlace, workPlace]}

                debounce={1000} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                // renderLeftButton={()  => <Text>Start point</Text>}
                // renderRightButton={() => <Button onPress={}><Text>Submit</Text></Button>}
              />
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
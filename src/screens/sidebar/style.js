import { Platform, Dimensions } from 'react-native';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  content: { 
    flex: 1, 
    backgroundColor: "#fff", 
    top: -1 
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20,
  },
  username: {
    fontWeight: Platform.OS === "ios" ? "400" : "300",
    fontSize: 16,
    color: 'white',
  },
  itemIcon:{ 
    color: "#777", 
    fontSize: 26, 
    width: 30 
  },
  badge:{
    borderRadius: 3,
    height: 25,
    width: 72,
    backgroundColor: "#C5F442"
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined,
    textShadowColor: 'rgba(0, 0, 0, 0)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10
  },
  flexContainer: {
    flexDirection: 'row'
  },
  avatarGroup: {
    flex: 1,
    height: Platform.OS === "ios"? 120: 130,
    backgroundColor: '#111111',
    alignItems: "center",
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
};

const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 30
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 60 : 70,
    top: Platform.OS === "android" ? 35 : 60,
    width: 241,
    height: 130
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 50,
    backgroundColor: "transparent"
  },
  text: {
    color: "#D8D8D8",
    bottom: 6,
    marginTop: 5,
    backgroundColor: '#000000',
    marginTop: 8
  },
  contentContainer: { 
    marginBottom: 80, 
    flexDirection: "row" 
  },
  loginButton: {
    backgroundColor: "#6FAF98",
    marginLeft: 100
  },
  signupButton: {
    backgroundColor: "#6FAF98",
    marginLeft: 30
  },
  goRideButton: {
    backgroundColor: "#6FAF98",
    marginLeft: 145
  }
};

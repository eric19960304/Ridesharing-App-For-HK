import { Platform, Dimensions } from 'react-native';
const deviceHeight = Dimensions.get("window").height;

export default {
  imageContainer: {
    alignItems: "center",
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
    width: 241,
    height: 130
  },
  sloganContainer: {
    marginTop: deviceHeight / 10,
    marginBottom: 20
  },
  slogan: {
    width: 330,
    height: 85
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
    flexDirection: "column", 
    alignItems: "center"
  },
  buttonGroup: { 
    marginBottom: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  leftButton: {
    backgroundColor: "#6FAF98"
  },
  rightButton: {
    backgroundColor: "#6FAF98",
    marginLeft: 30
  }
};

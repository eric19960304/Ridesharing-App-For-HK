const React = require("react-native");
const { Platform } = React;

export default {
  container: {
    backgroundColor: "#fff"
  },
  submitButton: { 
    margin: 15
  },
  label: {
    paddingTop: Platform.OS=="android"? 5 : 0
  },
  avatarImage: {
    width: 200, height: 200
  }
};

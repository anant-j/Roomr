import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import ErrorBox from "./ErrorBox";
import { errorFactory } from "utils/ErrorFactory";
import PropTypes from "prop-types";

const ErrorView = ({ errorCode, setErrorCode }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (errorCode) {
      setErrorMessage(errorFactory(errorCode).message);
      fadeIn();
      setTimeout(function () {
        fadeOut();
      }, 5000);
      setTimeout(function () {
        // This call to setErrorCode needed to clean up the error state after fadeout
        setErrorCode(null);
      }, 7000);
    }
  }, [errorCode]);

  return (
    <Animated.View
      style={[
        styles.errorBox,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <ErrorBox text={errorMessage} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorBox: {
    height: 75,
    width: "90%",
  },
});

ErrorView.propTypes = {
  errorCode: PropTypes.string,
  setErrorCode: PropTypes.func,
};

export default ErrorView;

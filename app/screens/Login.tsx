import * as React from "react";
import {
  Animated,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TextProps,
} from "react-native";
import { Text, View, Button, TextInput } from "../components/Themed";
import { login } from "../firebase";
// import { useAppDispatch } from "hooks/typedHooks";
import { useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import ErrorBox from "../components/ErrorBox";
import { errorFactory } from "../utils/ErrorFactory";
import { validator } from "../utils/Validations";
import * as Progress from "react-native-progress";
import { tenantSignup, landlordSignup } from "../firebase";
import { useAppSelector } from "hooks/typedHooks";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const expoToken = useAppSelector((state) => state.auth.expoToken);
  const placeholderColor = "#707070";
  const [currentScreen, setCurrentScreen] = useState("home");
  const [hidePass, setHidePass] = useState(true);
  const [loginMode, setLoginMode] = useState(true);
  const [isTenant, setIsTenant] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [phone, onChangePhone] = useState("");
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [passwordAgain, onChangePasswordAgain] = useState("");
  const [houseID, onChangeHouseID] = useState("");
  const [address, onChangeAddress] = useState("");

  const GradientText = (
    props: JSX.IntrinsicAttributes & {
      lightColor?: string;
      darkColor?: string;
    } & Readonly<TextProps> &
      Readonly<{ children?: React.ReactNode }>,
  ) => {
    return (
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
          colors={["#FFFFFF", "#5587C1", "#4574AB", "#39659A", "#244C7C"]}
          // start={{ x: 0, y: 0 }}
          // end={{ x: 0, y: 1 }}
        >
          <Text {...props} style={[props.style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    );
  };

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

  const setError = (code: string) => {
    switch (errorFactory(code).redirectScreen) {
      case "none":
        break;
      case "email":
        if (loginMode) {
          setScreen("login");
        } else {
          setScreen("email");
        }
        break;
      case "password":
        if (loginMode) {
          setScreen("login");
        } else {
          setScreen("password");
        }
        break;
      default:
        setScreen(errorFactory(code).redirectScreen);
        break;
    }
    setErrorMessage(errorFactory(code).message);
    fadeIn();
    setTimeout(function () {
      fadeOut();
    }, 5000);
  };

  const setScreen = (screen) => {
    if (screen == currentScreen) {
      return;
    }
    setCurrentScreen(screen);
    setErrorMessage("");
  };

  const register = async () => {
    setScreen("waiting");
    let result;
    if (isTenant) {
      result = await tenantSignup({
        name: {
          first: firstName,
          last: lastName,
        },
        phone: phone,
        email: email,
        password: password,
        houseID: houseID,
        expo_token: expoToken,
      });
      if (result.data.status === "success") {
        login(email, password);
        return;
      }
    } else {
      result = await landlordSignup({
        name: {
          first: firstName,
          last: lastName,
        },
        phone: phone,
        email: email,
        password: password,
        address: address,
        expo_token: expoToken,
      });
      if (result.data.status === "success") {
        setScreen("allSet");
        return;
      }
    }
    if (result.data.status === "error") {
      setError(result.data.code);
    }
  };

  const LottieRef = useRef(null);

  const getProgress = (screen) => {
    switch (screen) {
      case "home":
      case "login":
      case "waiting":
      case "allSet":
        return 0;
      case "name":
        return 1;
      case "email":
        return 2;
      case "phone":
        return 3;
      case "tenantOrLandlord":
        return 4;
      case "houseID":
      case "address":
        return 5;
      case "password":
        return 6;
      case "max":
        return 6;
      default:
        return 0;
    }
  };

  const errorComponent = () => {
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
  switch (currentScreen) {
    case "home":
      return (
        <View style={styles.container}>
          {/* <Text style={styles.maintitle}>Welcome to{"\n"}Roomr</Text> */}
          <GradientText style={[styles.title, styles.maintitle]}>
            Welcome to Roomr
          </GradientText>
          <Image
            style={styles.logo}
            source={require("../assets/images/icon_transparent.png")}
          />
          {errorComponent()}
          <Button
            onPress={() => {
              setLoginMode(true);
              setScreen("login");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Button>
          <Text></Text>
          <Button
            onPress={() => {
              setLoginMode(false);
              setScreen("name");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Button>
        </View>
      );
    case "login":
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Log In</Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              keyboardType="email-address"
              placeholder="Enter Email"
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter Password"
                autoCompleteType="password"
                secureTextEntry={hidePass ? true : false}
                onChangeText={onChangePassword}
                style={[styles.input, styles.passwordInput]}
                placeholderTextColor={placeholderColor}
                autoCapitalize="none"
              />
              <View style={styles.passwordEye}>
                <Feather
                  name={hidePass ? "eye-off" : "eye"}
                  size={25}
                  color="#878787"
                  onPress={() => setHidePass(!hidePass)}
                />
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  setScreen("home");
                }}
                style={[styles.button, styles.sideBySideLeft]}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const emailValidation = validator(email, "email");
                  const passwordValidation = validator(password, "password");
                  if (!emailValidation.success) {
                    setError(emailValidation.error);
                  } else if (!passwordValidation.success) {
                    setError(passwordValidation.error);
                  } else {
                    onChangeEmail(emailValidation.sanitized);
                    onChangePassword(passwordValidation.sanitized);
                    login(email, password).then((result) => {
                      if (!result.success) {
                        setError(result.error);
                      }
                    });
                  }
                }}
                style={[styles.button, styles.sideBySideRight]}
              >
                <Text style={styles.buttonText}>Login</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    case "name":
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={getProgress(currentScreen) / getProgress("max")}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>What is your name?</Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeFirstName}
              value={firstName}
              placeholder="First Name"
              autoCapitalize="sentences"
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeLastName}
              value={lastName}
              placeholder="Last Name"
              autoCapitalize="sentences"
            />
            <View style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  setScreen("home");
                }}
                style={[styles.button, styles.sideBySideLeft]}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const firstNameValidation = validator(firstName, "firstName");
                  const lastNameValidation = validator(lastName, "lastName");
                  if (!firstNameValidation.success) {
                    setError(firstNameValidation.error);
                  } else if (!lastNameValidation.success) {
                    setError(lastNameValidation.error);
                  } else {
                    onChangeFirstName(firstNameValidation.sanitized);
                    onChangeLastName(lastNameValidation.sanitized);
                    setScreen("email");
                  }
                }}
                style={[styles.button, styles.sideBySideRight]}
              >
                <Text style={styles.buttonText}>Next</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    case "email":
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={getProgress(currentScreen) / getProgress("max")}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>What is your email?</Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  setScreen("name");
                }}
                style={[styles.button, styles.sideBySideLeft]}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const emailValidation = validator(email, "email");
                  if (!emailValidation.success) {
                    setError(emailValidation.error);
                  } else {
                    onChangeEmail(emailValidation.sanitized);
                    setScreen("phone");
                  }
                }}
                style={[styles.button, styles.sideBySideRight]}
              >
                <Text style={styles.buttonText}>Next</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    case "phone":
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={getProgress(currentScreen) / getProgress("max")}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>What is your phone number?</Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={onChangePhone}
              value={phone}
              keyboardType="number-pad"
              placeholder="Enter Phone Number"
            />
            <View style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  setScreen("email");
                }}
                style={[styles.button, styles.sideBySideLeft]}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const phoneNumberValidation = validator(phone, "phone");
                  if (!phoneNumberValidation.success) {
                    setError(phoneNumberValidation.error);
                  } else {
                    onChangePhone(phoneNumberValidation.sanitized);
                    setScreen("tenantOrLandlord");
                  }
                }}
                style={[styles.button, styles.sideBySideRight]}
              >
                <Text style={styles.buttonText}>Next</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    case "tenantOrLandlord":
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={getProgress(currentScreen) / getProgress("max")}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>Are you a Tenant or a Landlord?</Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <Button
              onPress={() => {
                setIsTenant(true);
                setScreen("houseID");
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Tenant</Text>
            </Button>
            <Text></Text>
            <Button
              onPress={() => {
                setIsTenant(false);
                setScreen("address");
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Landlord</Text>
            </Button>
            <Text></Text>
            <Button
              onPress={() => {
                setScreen("phone");
              }}
              style={styles.backbuttonLower}
            >
              <Feather name="arrow-left" color={"white"} size={30} />
            </Button>
          </View>
        </View>
      );
    case "houseID":
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={getProgress(currentScreen) / getProgress("max")}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>What is your House ID?</Text>
          <Text style={styles.subtitle}>
            Don&apos;t have one? Ask your Landlord!
          </Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeHouseID}
              value={houseID}
              maxLength={8}
              placeholder="Enter 8 Digit House ID"
              autoCapitalize="characters"
            />
            <View style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  setScreen("tenantOrLandlord");
                }}
                style={[styles.button, styles.sideBySideLeft]}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const houseIDValidation = validator(houseID, "houseID");
                  if (!houseIDValidation.success) {
                    setError(houseIDValidation.error);
                  } else {
                    onChangeHouseID(houseIDValidation.sanitized);
                    setScreen("password");
                  }
                }}
                style={[styles.button, styles.sideBySideRight]}
              >
                <Text style={styles.buttonText}>Next</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    case "address": {
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={getProgress(currentScreen) / getProgress("max")}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>What is your Address?</Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeAddress}
              value={address}
              placeholder="Enter Address"
              autoCapitalize="words"
            />
            <View style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  setScreen("tenantOrLandlord");
                }}
                style={[styles.button, styles.sideBySideLeft]}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const addressValidation = validator(address, "address");
                  if (!addressValidation.success) {
                    setError(addressValidation.error);
                  } else {
                    onChangeAddress(addressValidation.sanitized);
                    setScreen("password");
                  }
                }}
                style={[styles.button, styles.sideBySideRight]}
              >
                <Text style={styles.buttonText}>Next</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    }
    case "password":
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={getProgress(currentScreen) / getProgress("max")}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>Please create a Password.</Text>
          {errorComponent()}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Password"
              autoCompleteType="password"
              secureTextEntry={true}
              onChangeText={onChangePassword}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Enter Password Again"
              secureTextEntry={true}
              onChangeText={onChangePasswordAgain}
              style={styles.input}
              autoCapitalize="none"
            />
            <View style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  if (isTenant) {
                    setScreen("houseID");
                  } else {
                    setScreen("address");
                  }
                }}
                style={[styles.button, styles.sideBySideLeft]}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const passwordValidation = validator(password, "password");
                  const passwordValidation2 = validator(
                    passwordAgain,
                    "password",
                  );
                  if (!passwordValidation.success) {
                    setError(passwordValidation.error);
                  } else if (!passwordValidation2.success) {
                    setError(passwordValidation2.error);
                  } else if (password !== passwordAgain) {
                    setError("passwords-dont-match");
                  } else {
                    onChangePassword(passwordValidation.sanitized);
                    onChangePasswordAgain(passwordValidation2.sanitized);
                    // nextScreen();
                    register();
                  }
                }}
                style={[styles.button, styles.sideBySideRight]}
              >
                <Text style={styles.buttonText}>Register</Text>
              </Button>
            </View>
          </View>
        </View>
      );
    case "waiting":
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Please wait</Text>
          {errorComponent()}
          <LottieView
            source={require("../assets/animations/loading.json")}
            autoPlay
          />
        </View>
      );
    case "allSet":
      return (
        <View style={styles.container}>
          <Text style={styles.title}>You are all set.</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              LottieRef.current.play();
            }}
          >
            <LottieView
              ref={LottieRef}
              source={require("../assets/animations/success.json")}
              autoPlay
              loop={false}
            />
          </TouchableWithoutFeedback>
          <Button
            onPress={() => {
              login(email, password).then((result) => {
                if (!result.success) {
                  setError(result.error);
                }
              });
            }}
            style={[styles.button, styles.bigSpacer]}
          >
            <Text style={styles.buttonText}>Continue to app</Text>
          </Button>
          {errorComponent()}
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Uh oh, something went wrong!</Text>
          <Text>This is just temporary until all wiring is put in place</Text>
          <Text> Default login username: test@test.com</Text>
          <Text> Default login password: testpassword </Text>
          <Button
            onPress={() => {
              setScreen("home");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Back to home</Text>
          </Button>
          {errorComponent()}
        </View>
      );
      break;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  maintitle: {
    // width: "70%",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 50,
  },
  title: {
    width: "80%",
    position: "relative",
    marginTop: 100,
    fontSize: 40,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
  },

  errorBox: {
    marginTop: 25,
    height: 75,
    width: "90%",
  },

  logo: {
    marginTop: 40,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "90%",
    height: 50,
    marginTop: 12,
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },

  passwordContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  passwordInput: {
    margin: 0,
    marginTop: 0,
  },
  passwordEye: {
    alignSelf: "center",
    position: "absolute",
    right: 2,
    backgroundColor: "transparent",
    margin: 5,
    padding: 5,
  },

  buttonsContainer: {
    flexDirection: "row",
    width: "90%",
    marginTop: 15,
    justifyContent: "space-evenly",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    color: "white",
  },
  sideBySideLeft: {
    marginLeft: 0,
    marginRight: 5,
    width: "48%",
  },
  sideBySideRight: {
    marginLeft: 5,
    marginRight: 0,
    width: "48%",
  },

  bigSpacer: {
    marginTop: 500,
  },

  progressBarcontainer: {
    position: "absolute",
    top: 75,
  },

  backbuttonLower: {
    borderRadius: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

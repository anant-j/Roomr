import * as React from "react";
import {
  Animated,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
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

export default function LoginScreen() {
  const expoToken = useAppSelector((state) => state.auth.expoToken);

  const maxScreens = 8;
  const totalProgressScreens = 7;
  const [progress, setProgress] = useState(0);
  const [loginScreen, setLoginScreen] = useState(true);
  const [hidePass, setHidePass] = useState(true);
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

  const setError = (code: string, screen?: number) => {
    if (screen && screen != progress && screen >= 0 && screen <= maxScreens) {
      setProgress(screen);
    }
    setErrorMessage(errorFactory(code).message);
    if (errorFactory(code).redirectScreen !== -1) {
      setProgress(errorFactory(code).redirectScreen);
    }
    fadeIn();
    setTimeout(function () {
      fadeOut();
    }, 5000);
  };

  const nextScreen = () => {
    if (progress < maxScreens + 1) {
      setProgress(progress + 1);
    }
    setErrorMessage("");
  };

  const previousScreen = () => {
    if (progress > 0) {
      setProgress(progress - 1);
    } else {
      setProgress(0);
    }
    setErrorMessage("");
  };

  const register = async () => {
    nextScreen();
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
        setProgress(8);
        return;
      }
    }
    if (result.data.status === "error") {
      setError(result.data.code);
    }
  };

  const LottieRef = useRef(null);

  switch (progress) {
    case 0:
      return (
        <View style={styles.container}>
          <Text style={styles.maintitle}>Welcome to{"\n"}Roomr</Text>
          <Image
            style={styles.logo}
            source={require("../assets/images/transparentIcon.png")}
          />
          <Button
            onPress={() => {
              setLoginScreen(true);
              nextScreen();
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Login</Text>
          </Button>
          <Text></Text>
          <Button
            onPress={() => {
              setLoginScreen(false);
              nextScreen();
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Register</Text>
          </Button>
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
        </View>
      );
    case 1:
      if (loginScreen) {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Enter Email"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter Password"
                autoCompleteType="password"
                secureTextEntry={hidePass ? true : false}
                onChangeText={onChangePassword}
                style={styles.passwordInput}
              />
              <View style={styles.passwordEye}>
                <Feather
                  name={hidePass ? "eye-off" : "eye"}
                  size={25}
                  color="grey"
                  onPress={() => setHidePass(!hidePass)}
                />
              </View>
            </View>
            <View style={styles.passwordContainer}>
              <Button
                onPress={() => {
                  previousScreen();
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Previous</Text>
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
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Login</Text>
              </Button>
            </View>
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
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.progressBarcontainer}>
              <Progress.Bar
                progress={progress / totalProgressScreens}
                width={300}
                color={"#5B8DCA"}
                unfilledColor={"#e8e8e8"}
                borderWidth={0}
              />
            </View>
            <Text style={styles.title}>What is your name?</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeFirstName}
              value={firstName}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeLastName}
              value={lastName}
              placeholder="Last Name"
            />
            <View style={styles.passwordContainer}>
              <Button
                onPress={() => {
                  previousScreen();
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Previous</Text>
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
                    nextScreen();
                  }
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Next</Text>
              </Button>
            </View>
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
          </View>
        );
      }
    case 2:
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={progress / totalProgressScreens}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>What is your email?</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Enter Email"
          />
          <View style={styles.passwordContainer}>
            <Button
              onPress={() => {
                previousScreen();
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Previous</Text>
            </Button>
            <Button
              onPress={() => {
                const emailValidation = validator(email, "email");
                if (!emailValidation.success) {
                  setError(emailValidation.error);
                } else {
                  onChangeEmail(emailValidation.sanitized);
                  nextScreen();
                }
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Next</Text>
            </Button>
          </View>
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
        </View>
      );
    case 3:
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={progress / totalProgressScreens}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>What is your phone number?</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePhone}
            value={phone}
            keyboardType="numeric"
            placeholder="Enter Phone Number"
          />
          <View style={styles.passwordContainer}>
            <Button
              onPress={() => {
                previousScreen();
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Previous</Text>
            </Button>
            <Button
              onPress={() => {
                const phoneNumberValidation = validator(phone, "phone");
                if (!phoneNumberValidation.success) {
                  setError(phoneNumberValidation.error);
                } else {
                  onChangePhone(phoneNumberValidation.sanitized);
                  nextScreen();
                }
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Next</Text>
            </Button>
          </View>
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
        </View>
      );
    case 4:
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={progress / totalProgressScreens}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>Are you a Tenant or a Landlord?</Text>
          <Button
            onPress={() => {
              setIsTenant(true);
              nextScreen();
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Tenant</Text>
          </Button>
          <Text></Text>
          <Button
            onPress={() => {
              setIsTenant(false);
              nextScreen();
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Landlord</Text>
          </Button>
          <Text></Text>
          <Button
            onPress={() => {
              previousScreen();
            }}
            style={styles.backbuttonLower}
          >
            <Feather name="arrow-left" color={"white"} size={30} />
          </Button>
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
        </View>
      );
    case 5:
      if (isTenant) {
        return (
          <View style={styles.container}>
            <View style={styles.progressBarcontainer}>
              <Progress.Bar
                progress={progress / totalProgressScreens}
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
            <TextInput
              style={styles.input}
              onChangeText={onChangeHouseID}
              value={houseID}
              maxLength={8}
              placeholder="Enter 8 Digit House ID"
            />
            <View style={styles.passwordContainer}>
              <Button
                onPress={() => {
                  previousScreen();
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const houseIDValidation = validator(houseID, "houseID");
                  if (!houseIDValidation.success) {
                    setError(houseIDValidation.error);
                  } else {
                    onChangeHouseID(houseIDValidation.sanitized);
                    nextScreen();
                  }
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Next</Text>
              </Button>
            </View>
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
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.progressBarcontainer}>
              <Progress.Bar
                progress={progress / totalProgressScreens}
                width={300}
                color={"#5B8DCA"}
                unfilledColor={"#e8e8e8"}
                borderWidth={0}
              />
            </View>
            <Text style={styles.title}>What is your Address?</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeAddress}
              value={address}
              placeholder="Enter Address"
            />
            <View style={styles.passwordContainer}>
              <Button
                onPress={() => {
                  previousScreen();
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  const addressValidation = validator(address, "address");
                  if (!addressValidation.success) {
                    setError(addressValidation.error);
                  } else {
                    onChangeAddress(addressValidation.sanitized);
                    nextScreen();
                  }
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Next</Text>
              </Button>
            </View>
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
          </View>
        );
      }
    case 6:
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={progress / totalProgressScreens}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>Please create a Password.</Text>
          <TextInput
            placeholder="Enter Password"
            autoCompleteType="password"
            secureTextEntry={true}
            onChangeText={onChangePassword}
            style={styles.passwordInputFullWidth}
          />
          <Text></Text>
          <TextInput
            placeholder="Enter Password Again"
            secureTextEntry={true}
            onChangeText={onChangePasswordAgain}
            style={styles.passwordInputFullWidth}
          />
          <Text></Text>
          <View style={styles.passwordContainer}>
            <Button
              onPress={() => {
                previousScreen();
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Previous</Text>
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
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Register</Text>
            </Button>
          </View>
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
        </View>
      );
    case 7:
      return (
        <View style={styles.container}>
          <View style={styles.progressBarcontainer}>
            <Progress.Bar
              progress={progress / totalProgressScreens}
              width={300}
              color={"#5B8DCA"}
              unfilledColor={"#e8e8e8"}
              borderWidth={0}
            />
          </View>
          <Text style={styles.title}>Please wait</Text>
          <LottieView
            source={require("../assets/animations/loading.json")}
            autoPlay
          />
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
        </View>
      );
    case 8:
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
            <Text style={styles.linkText}>Continue to app</Text>
          </Button>
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
              setProgress(0);
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Back to home</Text>
          </Button>
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
        </View>
      );
      break;
  }
}

const styles = StyleSheet.create({
  bigSpacer: {
    marginTop: 500,
  },
  errorBox: {
    position: "absolute",
    top: 200,
    width: "90%",
    // marginBottom:0,
    // marginTop: 1000,
  },
  logo: {
    width: 80,
    resizeMode: "contain",
  },
  input: {
    height: 50,
    width: "90%",
    margin: 12,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },
  passwordInputFullWidth: {
    height: 50,
    width: "90%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    width: "90%",
    marginBottom: 12,
  },
  passwordInput: {
    height: 50,
    width: "85%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },
  progressBarcontainer: {
    position: "absolute",
    top: 75,
  },
  passwordEye: {
    alignSelf: "center",
    // paddingLeft: 10,
    // paddingRight: 10,
    margin: 5,
    padding: 5,
    // borderWidth: 2,
    // borderColor: "red",
    // borderRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // padding: 20,
  },
  maintitle: {
    position: "absolute",
    top: 100,
    fontSize: 40,
    fontWeight: "bold",
  },
  title: {
    position: "absolute",
    top: 100,
    // left: 70,
    // width: "70%",
    width: "80%",
    fontSize: 40,
    fontWeight: "bold",
  },
  subtitle: {
    position: "absolute",
    top: 200,
    // left: 0,
    // width: "67%",
    fontSize: 20,
  },
  backbutton: {
    position: "absolute",
    top: 150,
    left: 30,
    margin: 0,
    padding: 0,
    borderRadius: 50,
  },
  backbuttonLower: {
    borderRadius: 50,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    width: "90%",
    alignItems: "center",
  },
  linkText: {
    fontSize: 25,
    color: "white",
  },
  sideBySideButton: {
    borderRadius: 10,
    padding: 10,
    // marginLeft: 50,
    margin: 2,
    width: "50%",
    alignItems: "center",
  },
});

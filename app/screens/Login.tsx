import * as React from "react";
import { StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
import { Text, View, Button, TextInput } from "../components/Themed";
import { registerFakeTenant, login } from "../firebase";
import { useAppDispatch } from "hooks/typedHooks";
import { fetchAuth } from "reduxStates/authListener";
import { useEffect, useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const [progress, setProgress] = useState(0);
  const [loginScreen, setLoginScreen] = useState(true);
  const [hidePass, setHidePass] = useState(true);
  const [isTenant, setIsTenant] = useState(false);

  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [phone, onChangePhone] = useState("");
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [passwordAgain, onChangePasswordAgain] = useState("");
  const [houseID, onChangeHouseID] = useState("");
  const [address, onChangeAddress] = useState("");

  const LottieRef = useRef(null);
  useEffect(() => {
    dispatch<any>(fetchAuth());
  }, []);

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
              setProgress(progress + 1);
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Login</Text>
          </Button>
          <Text></Text>
          <Button
            onPress={() => {
              // registerFakeTenant();
              setLoginScreen(false);
              setProgress(progress + 1);
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Register</Text>
          </Button>
        </View>
      );
    case 1:
      if (loginScreen) {
        return (
          <View style={styles.container}>
            <Button
              onPress={() => {
                setProgress(0);
              }}
              style={styles.backbutton}
            >
              <Feather name="arrow-left" color={"white"} size={30} />
            </Button>
            <Text style={styles.title}>Log In</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Enter Email"
            />
            {/* <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
              placeholder="Enter Password"
              secureTextEntry={true}
            /> */}
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
            <Button
              onPress={() => {
                login(email, password);
              }}
              style={styles.button}
            >
              <Text style={styles.linkText}>Login</Text>
            </Button>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Button
              onPress={() => {
                setProgress(progress - 1);
              }}
              style={styles.backbutton}
            >
              <Feather name="arrow-left" color={"white"} size={30} />
            </Button>
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
            <Button
              onPress={() => {
                setProgress(progress + 1);
              }}
              style={styles.button}
            >
              <Text style={styles.linkText}>Next</Text>
            </Button>
          </View>
        );
      }
    case 2:
      return (
        <View style={styles.container}>
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
                setProgress(progress - 1);
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Previous</Text>
            </Button>
            <Button
              onPress={() => {
                setProgress(progress + 1);
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Next</Text>
            </Button>
          </View>
        </View>
      );
    case 3:
      return (
        <View style={styles.container}>
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
                setProgress(progress - 1);
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Previous</Text>
            </Button>
            <Button
              onPress={() => {
                setProgress(progress + 1);
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Next</Text>
            </Button>
          </View>
        </View>
      );
    case 4:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Are you a Tenant or a Landlord?</Text>
          <Button
            onPress={() => {
              setIsTenant(true);
              setProgress(progress + 1);
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Tenant</Text>
          </Button>
          <Text></Text>
          <Button
            onPress={() => {
              setIsTenant(false);
              setProgress(progress + 1);
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Landlord</Text>
          </Button>
          <Text></Text>
          <Button
            onPress={() => {
              setProgress(progress - 1);
            }}
            style={styles.backbuttonLower}
          >
            <Feather name="arrow-left" color={"white"} size={30} />
          </Button>
        </View>
      );
    case 5:
      if (isTenant) {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>What is your House ID?</Text>
            <Text style={styles.subtitle}>
              Don&apos;t have one? Ask your Landlord!
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeHouseID}
              value={houseID}
              placeholder="Enter 9 Digit House ID"
            />
            <View style={styles.passwordContainer}>
              <Button
                onPress={() => {
                  setProgress(progress - 1);
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  setProgress(progress + 1);
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Next</Text>
              </Button>
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
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
                  setProgress(progress - 1);
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Previous</Text>
              </Button>
              <Button
                onPress={() => {
                  setProgress(progress + 1);
                }}
                style={styles.sideBySideButton}
              >
                <Text style={styles.linkText}>Next</Text>
              </Button>
            </View>
          </View>
        );
      }
    case 6:
      return (
        <View style={styles.container}>
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
                setProgress(progress - 1);
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Previous</Text>
            </Button>
            <Button
              onPress={() => {
                setProgress(progress + 1);
              }}
              style={styles.sideBySideButton}
            >
              <Text style={styles.linkText}>Next</Text>
            </Button>
          </View>
        </View>
      );
    case 7:
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
              setProgress(progress + 1);
            }}
            style={[styles.button, styles.bigSpacer]}
          >
            <Text style={styles.linkText}>Continue to app</Text>
          </Button>
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Uh oh, something went wrong!</Text>
          <Text>This is just temporary until all wiring is put in place</Text>
          <Button
            onPress={() => {
              setProgress(0);
            }}
            style={styles.button}
          >
            <Text style={styles.linkText}>Back to home</Text>
          </Button>
        </View>
      );
      break;
  }
}

const styles = StyleSheet.create({
  bigSpacer: {
    marginTop: 500,
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
    padding: 20,
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
    fontSize: 40,
    fontWeight: "bold",
  },
  subtitle: {
    position: "absolute",
    top: 200,
    // left: 0,
    width: "67%",
    fontSize: 20,
  },
  backbutton: {
    position: "absolute",
    top: 110,
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

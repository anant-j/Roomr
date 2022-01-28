export const errorFactory = (code: string) => {
  switch (code) {
    case "auth/invalid-email":
    case "invalid-email":
      return {
        redirectScreen: -1,
        message: "The email you have entered is invalid",
      };
      break;
    case "auth/weak-password":
      return { redirectScreen: -1, message: "Your password is too weak" };
      break;
    case "auth/email-already-in-use":
      return { redirectScreen: -1, message: "This email is already in use" };
      break;
    case "auth/user-not-found":
      return {
        redirectScreen: -1,
        message: "This email was not found. Please regiser instead",
      };
      break;
    case "auth/wrong-password":
      return {
        redirectScreen: -1,
        message:
          "The password you have entered is incorrect. Please try again!",
      };
      break;
    case "password-too-short":
      return {
        redirectScreen: -1,
        message: "Please enter a password that is at least 6 characters long",
      };
      break;
    case "passwords-dont-match":
      return {
        redirectScreen: -1,
        message: "The passwords you have entered do not match",
      };
    case "name-too-short":
      return {
        redirectScreen: -1,
        message: "Please enter a valid name",
      };
    case "name-too-long":
      return {
        redirectScreen: -1,
        message: "The name you have entered is too long",
      };
    case "invalid-phone-number":
      return {
        redirectScreen: -1,
        message: "Please enter a valid phone number",
      };
    case "invalid-house-id":
      return {
        redirectScreen: -1,
        message: "Please enter a valid 8 digit house ID",
      };
    case "invalid-address":
      return { redirectScreen: -1, message: "Please enter a valid address" };
    case "INVALID_USER_DATA":
      return {
        redirectScreen: -1,
        message: "The data you have provided is invalid. Please try again.",
      };
    case "HOUSE_DOES_NOT_EXIST":
      return {
        redirectScreen: 5,
        message: "The houseID you have entered does not exist",
      };
    case "HOUSE_ALREADY_EXISTS":
      return {
        redirectScreen: 5,
        message: "The address you have entered already exists",
      };
    case "USER_ALREADY_EXISTS":
      return {
        redirectScreen: 0,
        message: "You are already registered. Please log in instead",
      };
    case "LANDLORD_DOES_NOT_EXIST":
      return {
        redirectScreen: -1,
        message: "An error occured. Please request support via our email.",
      };
    default:
      return { redirectScreen: -1, message: "An unexpected error occurred" };
      break;
  }
};

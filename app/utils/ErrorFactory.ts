export const errorFactory = (code: string) => {
  switch (code) {
    case "auth/invalid-email":
    case "invalid-email":
      return {
        redirectScreen: "email",
        message: "The email you have entered is invalid",
      };
      break;
    case "auth/weak-password":
      return {
        redirectScreen: "password",
        message:
          "Your password is too weak. Please try again with a stronger password.",
      };
      break;
    case "auth/email-already-in-use":
      return {
        redirectScreen: "email",
        message: "This email is already in use. Please login instead.",
      };
      break;
    case "auth/user-not-found":
      return {
        redirectScreen: "login",
        message: "This email was not found. Please regiser instead",
      };
      break;
    case "auth/wrong-password":
      return {
        redirectScreen: "login",
        message:
          "The password you have entered is incorrect. Please try again!",
      };
      break;
    case "password-too-short":
    case "invalid-password":
      return {
        redirectScreen: "password",
        message: "Please enter a password that is at least 6 characters long",
      };
      break;
    case "passwords-dont-match":
      return {
        redirectScreen: "password",
        message: "The passwords you have entered do not match",
      };
    case "invalid-name":
      return {
        redirectScreen: "name",
        message: "Please enter a valid name",
      };
    case "name-too-short":
      return {
        redirectScreen: "name",
        message: "Please enter a valid name",
      };
    case "name-too-long":
      return {
        redirectScreen: "name",
        message: "The name you have entered is too long",
      };
    case "invalid-phone-number":
      return {
        redirectScreen: "phone",
        message: "Please enter a valid phone number",
      };
    case "invalid-house-id":
      return {
        redirectScreen: "houseID",
        message: "Please enter a valid 8 digit house ID",
      };
    case "invalid-address":
      return {
        redirectScreen: "address",
        message: "Please enter a valid address",
      };
    case "HOUSE_DOES_NOT_EXIST":
      return {
        redirectScreen: "houseID",
        message: "The houseID you have entered does not exist",
      };
    case "HOUSE_ALREADY_EXISTS":
      return {
        redirectScreen: "address",
        message: "The address you have entered already exists",
      };
    case "USER_ALREADY_EXISTS":
      return {
        redirectScreen: "login",
        message: "You are already registered. Please log in instead",
      };
    case "LANDLORD_DOES_NOT_EXIST":
      return {
        redirectScreen: "home",
        message: "An error occured. Please request support via our email.",
      };
    case "invalid-task-name":
      return {
        message: "Please enter a valid task name.",
      };
    case "invalid-fields":
      return {
        message: "Please fill in all input fields.",
      };
    default:
      return {
        redirectScreen: "home",
        message: `An unexpected error occurred. Error Code:${code}`,
      };
  }
};

export const errorFactory = (code: string) => {
  switch (code) {
    case "auth/invalid-email":
    case "invalid-email":
      return "The email you have entered is invalid";
      break;
    case "auth/weak-password":
      return "Password is too weak";
      break;
    case "auth/email-already-in-use":
      return "Email already in use";
      break;
    case "auth/user-not-found":
      return "User not found";
      break;
    case "auth/wrong-password":
      return "Wrong password";
      break;
    case "password-too-short":
      return "Please enter a password that is at least 6 characters long";
      break;
    case "passwords-dont-match":
      return "The passwords you have entered do not match";
    case "name-too-short":
      return "Please enter a name that is at least 2 characters long";
    case "name-too-long":
      return "The name you have entered is too long";
    case "invalid-phone-number":
      return "Please enter a valid phone number";
    case "invalid-house-id":
      return "Please enter a valid 9 digit house ID";
    case "invalid-address":
      return "Please enter a valid address";
    default:
      return "An unexpected error occurred";
      break;
  }
};

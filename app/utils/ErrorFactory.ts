export const errorFactory = (code: string) => {
  switch (code) {
    case "auth/invalid-email":
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
    default:
      return "An unexpected error occurred";
      break;
  }
};

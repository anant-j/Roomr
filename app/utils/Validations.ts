export const validations = (content: string | number, type: string) => {
  switch (type) {
    case "email":
      return emailValidation(content);
    case "password":
      return passwordValidation(content);
    default:
      break;
  }
};

function emailValidation(email) {
  const valid =
    email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null ? true : false;
  if (valid) {
    return { success: true };
  } else {
    return { success: false, error: "invalid-email" };
  }
}

function passwordValidation(password) {
  if (password.length < 6) {
    return { success: false, error: "password-too-short" };
  }
  return { success: true };
}

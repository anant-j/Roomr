export const validator = (content: string | number, type: string) => {
  switch (type) {
    case "email":
      return emailValidation(content);
    case "password":
      return passwordValidation(content);
    case "firstName":
    case "lastName":
      return nameValidation(content);
    case "phone":
      return phoneNumberValidation(content);
    case "houseID":
      return houseIDValidation(content);
    case "address":
      return houseAddressValidations(content);
    default:
      return { success: false, error: "unknown" };
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

function nameValidation(name) {
  if (name.length < 2) {
    return { success: false, error: "name-too-short" };
  }
  if (name.length > 40) {
    return { success: false, error: "name-too-long" };
  }
  // if (name.match(/[^a-zA-Z0-9]/g)) {
  //   return { success: false, error: "invalid-name" };
  // }
  return { success: true };
}

function phoneNumberValidation(number) {
  if (number.length < 10) {
    return { success: false, error: "invalid-phone-number" };
  }
  return { success: true };
}

function houseIDValidation(houseID) {
  if (houseID.length != 8) {
    return { success: false, error: "invalid-house-id" };
  }
  return { success: true };
}

function houseAddressValidations(address) {
  if (address.length < 5) {
    return { success: false, error: "invalid-address" };
  }
  return { success: true };
}

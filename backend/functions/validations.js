/**
 * @param  {string} email
 * @return {object}
 */
exports.email = (email) => {
  const valid =
    email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null ? true : false;
  if (valid) {
    return {success: true, sanitized: email.toLowerCase()};
  } else {
    return {success: false};
  }
};

/**
 * @param  {string} password
 * @return {object}
 */
exports.password = (password) => {
  if (password.length < 6) {
    return {success: false};
  }
  return {success: true, sanitized: password};
};

/**
 * @param  {string} name
 * @return {object}
 */
exports.name = (name) => {
  if (name.length < 2) {
    return {success: false};
  }
  if (name.length > 40) {
    return {success: false};
  }
  // if (name.match(/[^a-zA-Z0-9]/g)) {
  //   return { success: false};
  // }
  return {
    success: true,
    sanitized: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
  };
};

/**
 * @param  {string} number
 * @return {object}
 */
exports.phone = (number) => {
  if (number.length < 10) {
    return {success: false};
  }
  // string should only contain numbers
  if (number.match(/[^0-9]/g)) {
    return {success: false};
  }
  return {success: true, sanitized: number};
};

/**
 * @param  {string} houseID
 * @return {object}
 */
exports.houseID = (houseID) => {
  if (houseID.length != 8) {
    return {success: false};
  }
  return {success: true, sanitized: houseID.toUpperCase()};
};

/**
 * @param  {string} address
 * @return {object}
 */
exports.address = (address) => {
  if (address.length < 5) {
    return {success: false};
  }
  return {success: true, sanitized: address};
};


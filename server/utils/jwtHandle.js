import jwt from "jsonwebtoken";
let jwtRemove = [];

export function signJwt(
  dataToBeSigned,
  key = process.env.ACCESS_TOKEN_SECRET,
  expiresIn = process.env.TOKEN_EXPIRY_TIME
) {
  const data = jwt.sign(dataToBeSigned, key, {
    expiresIn: expiresIn,
  });
  return data;
}

export function removeJwt(token) {
  jwtRemove.push(token);
}

export function tokenCanUsing(token) {
  return !jwtRemove.includes(token);
}

export function clearListRemove() {
  jwtRemove.splice(0, jwtRemove.length);
}

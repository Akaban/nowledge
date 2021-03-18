export function getUserData(user) {
  return {
    email: user.email,
    uid: user.uid,
    providerId: user.providerData[0].provider,
  };
}

import firebase from "../../app/config/firebase";
import axios from "axios";

export function callBackendTest() {
  firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(function (idToken) {
      console.log(idToken)
      // axios
      //   .get("http://localhost:5000/protected", {
      //     headers: {
      //       Authorization: `Bearer ${idToken}`,
      //     },
      //   })
      //   .then((res) => {
      //     console.log(res.data);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    })
    .catch(function (error) {console.log(error)});
}

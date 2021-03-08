import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { getUserProfile } from "../../../app/firestore/firestoreService";
import { listentoSelectedUserProfile } from "../profileActions"
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

export default function ProfilePage({ match }) {
  const { selectedUserProfile } = useSelector((state) => state.profile);
  const { currentUser } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.async);

  const dispatch = useDispatch();
  const user_profile_id = currentUser.uid

  useFirestoreDoc({
    query: () => getUserProfile(user_profile_id),
    data: (profile) => dispatch(listentoSelectedUserProfile(profile)),
    deps: [dispatch, user_profile_id],
    name: "getUserProfile"
  });

  if ((loading && !selectedUserProfile) || (!selectedUserProfile && !error))
    return <LoadingComponent content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileContent profile={selectedUserProfile} />
      </Grid.Column>
    </Grid>
  );
}

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Grid } from "semantic-ui-react";
import { getUserProfile, getUserPlan } from "../../../app/firestore/firestoreService";
import { listentoCurrentUserPlan, listentoSelectedUserProfile } from "../profileActions"
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import ProfileContent from "./ProfileContent";

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
  
  useFirestoreDoc({
    query: () => getUserPlan(user_profile_id),
    data: (plan) => dispatch(listentoCurrentUserPlan(plan)),
    deps: [dispatch, user_profile_id],
    name: "getUserPlan",
    silent: true
  });

  if ((loading && !selectedUserProfile) || (!selectedUserProfile && !error))
    return <LoadingComponent content="Loading profile..." />;

  return (
    <Container>
    <Grid>
      <Grid.Column width={16}>
        <ProfileContent profile={selectedUserProfile} />
      </Grid.Column>
    </Grid></Container>
  );
}

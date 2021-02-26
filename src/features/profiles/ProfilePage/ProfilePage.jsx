import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

export default function ProfilePage({ match }) {
  const { selectedUserProfile } = useSelector((state) => state.profile);
  const { currentUser } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.async);

  // useFirestoreDoc({
  //   query: () => getUserProfile(match.params.id),
  //   data: (profile) => dispatch(listentoSelectedUserProfile(profile)),
  //   deps: [dispatch, match.params.id],
  // });

  if ((loading && !selectedUserProfile) || (!selectedUserProfile && !error))
    return <LoadingComponent content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader
          profile={selectedUserProfile}
          isCurrentUser={currentUser.uid === selectedUserProfile}
        />
        <ProfileContent profile={selectedUserProfile} />
      </Grid.Column>
    </Grid>
  );
}

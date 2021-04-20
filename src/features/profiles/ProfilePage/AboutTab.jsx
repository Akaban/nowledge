import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Container, Grid, Header, Tab } from "semantic-ui-react";
import { format } from "date-fns";
import ProfileForm from "./ProfileForm.oldjsx";
import useAsyncEffect from "../../../app/hooks/useAsyncEffect";
import { getPremiumInfo } from "../../../app/backend/premium";
import { useSelector, useDispatch } from "react-redux";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { ProgressBar } from "react-bootstrap";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { getUserPlan } from "../../../app/firestore/firestoreService";
import { listentoCurrentUserPlan } from "../profileActions";

export default function AboutTab({ profile }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const current_user_id = currentUser.id;
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  const { userPlan } = useSelector((state) => state.profile);


  const { error, loading } = useSelector((state) => state.async);
  useFirestoreDoc({
    query: () => getUserPlan(current_user_id),
    data: (plan) => dispatch(listentoCurrentUserPlan(plan)),
    deps: [dispatch, current_user_id],
    name: "getUserPlan",
    silent: true,
  });
  if (!userPlan && !error) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;
  const max_space = userPlan.plan === "basic" ? 1e9 : 30e6

  console.log(userPlan)

  const progressStorageSize = Math.round(
    (userPlan.user_books_storage_size /
      max_space) *
      100
  );

  const get_variant_from_progress = (progress) => {
    if (progress > 85) return "danger";
    else return "info";
  };
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={`Plan`} />
          {/* <Button onClick={() => setEditMode(!editMode)} floated='right' basic content={editMode ? 'Cancel': 'Edit'} /> */}
        </Grid.Column>
        <Grid.Column width={16}>
          <strong>Current plan:</strong> {userPlan.plan.capitalize()}
          <Header content="Current limits" />
          Storage usage:{" "}
          <ProgressBar
            striped
            variant={get_variant_from_progress(progressStorageSize)}
            now={progressStorageSize}
            label={`${progressStorageSize}%`}
          />
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}

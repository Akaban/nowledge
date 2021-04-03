import React, { useState } from 'react'
import { Redirect } from "react-router-dom"
import { Container, Grid, Header, Tab } from 'semantic-ui-react'
import { format } from 'date-fns'
import ProfileForm from './ProfileForm.oldjsx'
import useAsyncEffect from '../../../app/hooks/useAsyncEffect'
import { getPremiumInfo } from '../../../app/backend/premium'
import { useSelector, useDispatch } from "react-redux"
import LoadingComponent from '../../../app/layout/LoadingComponents'
import { ProgressBar } from 'react-bootstrap'

export default function AboutTab({profile, userPlan}) {
    const dispatch = useDispatch();
    String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

  const { error, loading } = useSelector((state) => state.async);
  const [premiumInfo, setPremiumInfo] = useState(null);
  useAsyncEffect({
    fetch: () => getPremiumInfo(),
    after: setPremiumInfo,
    name: "getPremiumInfo",
    deps: [dispatch]
  });
  if (loading && (!premiumInfo) && !error)
    return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;
  const progressStorageSize = Math.round((premiumInfo.current_usage.books_storage_size / premiumInfo.user_limits.max_space) * 100)
  const progressBookCount = Math.round((premiumInfo.current_usage.books_count / premiumInfo.user_limits.max_books) * 100)

  const get_variant_from_progress = (progress) => {
      if (progress > 85) return "danger";
      else return "info";
  }
    return (
        <Tab.Pane>
        <Grid>
            <Grid.Column width={16}>
                <Header floated='left' icon='user' content={`Plan`} />
                {/* <Button onClick={() => setEditMode(!editMode)} floated='right' basic content={editMode ? 'Cancel': 'Edit'} /> */}
            </Grid.Column>
            <Grid.Column width={16}>
                <strong>Current plan:</strong> {userPlan.plan.capitalize()}
                <Header content="Current limits"/>
        Storage usage: <ProgressBar striped variant={get_variant_from_progress(progressStorageSize)} now={progressStorageSize} label={`${progressStorageSize}%`}  />
        
        {premiumInfo.user_limits.max_books &&
        <ProgressBar striped variant={get_variant_from_progress(progressBookCount)} now={progressBookCount} label={`${progressBookCount}%`}  />
        }
            </Grid.Column>
        </Grid>

        </Tab.Pane>
    )
}
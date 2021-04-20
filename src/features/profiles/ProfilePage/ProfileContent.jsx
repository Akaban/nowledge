import React from "react";
import { Tab } from "semantic-ui-react";
import AboutTab from "./AboutTab";
import PasswordForm from "./PasswordForm";

export default function ProfileContent({ profile, userPlan }) {
  const panes = [
    {
      menuItem: "Plan",
      render: () => <AboutTab profile={profile} userPlan={userPlan} />,
    },
  ];
  if (profile.providerType === "password")
    panes.push({
      menuItem: "Change my password",
      render: () => <PasswordForm />,
    });
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
    />
  );
}

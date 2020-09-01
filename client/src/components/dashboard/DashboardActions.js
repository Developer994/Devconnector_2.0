import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div class="dash-buttons">
      <link to="/edit-profile" class="btn btn-light">
        <i class="fas fa-user-circle text-primary"></i> Edit Profile
      </link>
      <link to="/add-experience" class="btn btn-light">
        <i class="fab fa-black-tie text-primary"></i> Add Experience
      </link>
      <link to="/add-education" class="btn btn-light">
        <i class="fas fa-graduation-cap text-primary"></i> Add Education
      </link>
    </div>
  );
};

export default DashboardActions;

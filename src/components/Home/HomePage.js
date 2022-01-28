import React from "react";
import SignOutBtn from "../SignOutButton/SignOutBtn";

const HomePage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <p>Only authenticated users can access this page</p>
      <SignOutBtn />
    </div>
  );
};

export default HomePage;

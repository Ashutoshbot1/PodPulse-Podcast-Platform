import React, { useState } from "react";
import Header from "../Components/Common/Header/Header";
import SignupForm from "../Components/Forms/SignupForm/SignupForm";
import LoginForm from "../Components/Forms/LoginForm/LoginForm";

const SignupPage = () => {
  const [flag, setFlag] = useState(false);

  return (
    <div>
      <Header />

      <div className="input-wrapper">
        {!flag ? <SignupForm /> : <LoginForm />}
        {!flag ? (
          <p onClick={(e) => setFlag(!flag)}>
            Already have an Account? Click here to Login
          </p>
        ) : (
          <p onClick={(e) => setFlag(!flag)}>
            Don't have an Account? click here to Signup
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;

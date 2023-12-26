import React, { useState } from "react";
import Input from "../../Common/Inputs/Custom Input/Input";
import Button from "../../Common/Button/Button";
import { auth, db } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { setUser } from "../../../slices/userSlice";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle Login Function
  async function handleLogin() {
    try {
      setLoading(true);

      // Authenticating
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Getting User Details
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      // console.log(userData);

      // Storing data in Store
      dispatch(
        setUser({
          name: userData.name,
          email: user.email,
          uid: user.uid,
          profileImage: userData.profileImage,
          profileCoverImage: userData.profileCoverImage,
        })
      );

      //Redirecting to Profile Page
      navigate("/profile");

      toast.success("Login Successful");
      setLoading(false);
    } catch (err) {
      console.log("Login Error", err);
      toast.error(err.message);
      setLoading(false);
    }
  }

  if(loading){
    return <Loader/>
  }

  return (
    <div>
      <h1>Login</h1>

      <Input
        type="email"
        placeholder="Email"
        state={email}
        setState={setEmail}
        required={true}
      />
      <Input
        type="password"
        placeholder="Password"
        state={password}
        setState={setPassword}
        required={true}
      />

      <Button
        text={loading ? "Loading..." : "Login"}
        onClick={handleLogin}
        disabled={loading}
      />
    </div>
  );
};

export default LoginForm;

import React, { useState } from "react";
import Input from "../../Common/Inputs/Custom Input/Input";
import Button from "../../Common/Button/Button";
import "./SignupForm.css";
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import FileInput from "../../Common/Inputs/Custom File Input/FileInput";
import Loader from "../../Common/Loader/Loader";
import "./SignupForm.css";

const SignupForm = () => {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileCoverImage, setProfileCoverImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Submit Fucntion
  async function handleSignup() {
    if (
      password.length >= 6 &&
      password === confirmPassword &&
      profileImage &&
      profileCoverImage
    ) {
      try {
        setLoading(true);

        // Authenticating User Using Firebase
        // And Creating User Data
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;
        // console.log("user-signup", user); // Log

        // Creating path to store user profile images in database
        const profileImageRef = ref(
          storage,
          `userProfileImages/${auth.currentUser.uid}/${Date.now()}`
        );

        // Uploading ProfileImage to Firebase Storage
        await uploadBytes(profileImageRef, profileImage);

        // Getting Profile Image Link
        const profileImageUrl = await getDownloadURL(profileImageRef);

        // Creating path to store user profile cover images in database
        const profileCoverImageRef = ref(
          storage,
          `userProfileImages/${auth.currentUser.uid}/${Date.now()}`
        );

        // Uploading ProfileCoverImage to Firebase Storage
        await uploadBytes(profileCoverImageRef, profileCoverImage);

        // Getting profileCoverImage link
        const profileCoverImageUrl = await getDownloadURL(profileCoverImageRef);

        //Storing User Data to FireStore
        // doc is for creating path-: db/users/user.uid/user's Details
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
          profileImage: profileImageUrl,
          profileCoverImage: profileCoverImageUrl,
        });

        // Storing user's details in store
        dispatch(
          setUser({
            name: fullName,
            email: user.email,
            uid: user.uid,
            profileImage: profileImageUrl,
            profileCoverImage: profileCoverImageUrl,
          })
        );

        // Redirecting to Profile Page
        navigate("/profile");

        toast.success("Signup Successful");
        setLoading(false);
      } catch (err) {
        console.log("error-signup", err);
        toast.error(err.message);
        setLoading(false);
      }
    } else {
      Validate();
      setLoading(false);
    }
  }

  // Validate Function
  function Validate() {
    if (!fullName) {
      toast.error("Please Enter Full-Name");
    } else if (!email) {
      toast.error("Please Enter Email id");
    } else if (!email.includes("@")) {
      toast.error("Please Enter Valid Email Id");
    } else if (!password) {
      toast.error("Please Enter Password");
    } else if (!confirmPassword) {
      toast.error("Please Enter Confirm Password");
    } else if (password !== confirmPassword) {
      toast.error("Password Missmatched");
    } else if (password.length < 6) {
      toast.error("Short Password");
    }
    else if(!profileImage){
      toast.error("PLease Select Profile Image");
    }
    else if(!profileCoverImage){
      toast.error("Please Select Cover Image");
    }  
  }

  //Handling Profile Image
  function handleProfileImage(file) {
    setProfileImage(file);
  }

  // Handling Profile Cover Image
  function handleProfileCoverImage(file) {
    setProfileCoverImage(file);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="signup-form">
      <h1>Sign Up</h1>

      <Input
        type="text"
        placeholder="Full Name"
        state={fullName}
        setState={setFullname}
        required={true}
      />
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
      <Input
        type="password"
        placeholder="Confirm Password"
        state={confirmPassword}
        setState={setConfirmPassword}
        required={true}
      />
      <FileInput
        accept={"image/*"}
        id={"profile-image"}
        text="Profile Image"
        fileHandleFunc={handleProfileImage}
      />
      <FileInput
        accept={"image/*"}
        id={"profile-cover-image"}
        text="Profile Cover Image"
        fileHandleFunc={handleProfileCoverImage}
      />

      <Button
        text={loading ? "Loading..." : "Signup"}
        onClick={handleSignup}
        disabled={loading}
      />
    </div>
  );
};

export default SignupForm;

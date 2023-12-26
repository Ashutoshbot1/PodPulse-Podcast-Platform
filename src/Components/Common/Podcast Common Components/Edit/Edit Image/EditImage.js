import React, { useEffect, useState } from "react";
import { db, storage } from "../../../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../../slices/userSlice";
import { toast } from "react-toastify";
import Loader from "../../../Loader/Loader";

const EditImage = ({
  imageName,
  uid,
  setUpdate,
  loading,
  setLoading,
  update,
  editImage,
  setEditImage,
}) => {
  const [newImage, setNewImage] = useState("");
  const dispatch = useDispatch();

  // Handle onChange
  function onChange(e) {
    setNewImage(e.target.files[0]);
  }

  useEffect(() => {
    let isMounted = true;
    console.log("run1");
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("run2");
        if (imageName === "profileImage" || imageName === "profileCoverImage") {
          console.log("run3", imageName);
          const userDoc = await getDoc(doc(db, "users", uid));
          const userData = userDoc.data();

          console.log("previous user", userData); //clg

          const imageRef = ref(
            storage,
            `userProfileImages/${uid}/${Date.now()}`
          );
          await uploadBytes(imageRef, newImage);
          const imageUrl = await getDownloadURL(imageRef);

          const newUserData = { ...userData, [imageName]: imageUrl };

          console.log("new user data", newUserData); //clg

          if (isMounted) {
            await setDoc(doc(db, "users", uid), newUserData);
            dispatch(setUser(newUserData));
            setUpdate(!update);

            // Call the callback to inform the parent component (ProfilePage) about the image update
            // onImageUpdate(imageUrl,imageName);
          }
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.error("Edit-error-profile", err);
        toast.error(err.message);
      }
    };

    if (editImage && newImage) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [newImage]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <label htmlFor="edit-image">Sure?.Click here</label>
      <input
        type="file"
        accept="image/*"
        id="edit-image"
        style={{ display: "none" }}
        onChange={onChange}
      />
    </div>
  );
};

export default EditImage;

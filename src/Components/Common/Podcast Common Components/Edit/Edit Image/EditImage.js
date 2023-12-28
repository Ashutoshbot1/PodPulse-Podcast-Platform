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
    const fetchData = async () => {
      try {
        setLoading(true);
        if (imageName === "profileImage" || imageName === "profileCoverImage") {
          const userDoc = await getDoc(doc(db, "users", uid));
          const userData = userDoc.data();

          setLoading(true);

          const imageRef = ref(
            storage,
            `userProfileImages/${uid}/${Date.now()}`
          );
          //Uploading Image to Firebase Storage
          await uploadBytes(imageRef, newImage);

          // Geting Image Url
          const imageUrl = await getDownloadURL(imageRef);

          // Creating New Users Data
          const newUserData = { ...userData, [imageName]: imageUrl };

          if (isMounted) {
            // Updating Users Data in Firebase DB
            await setDoc(doc(db, "users", uid), newUserData);
            // Updating User Data in Redux Store
            dispatch(setUser(newUserData));
            setEditImage(false);
            // Triggering Profile Page
            setUpdate(!update);
          }
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.error("Edit-error-profile", err);
        toast.error(err.message);
      }
    };

    // Calling Fetch Data Only when file is present
    if (editImage && newImage) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [newImage]);

  // Triggering Loader if user Data Not Found
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

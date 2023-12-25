import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../Common/Inputs/Custom Input/Input";
import Button from "../../Common/Button/Button";
import FileInput from "../../Common/Inputs/Custom File Input/FileInput";
import { toast } from "react-toastify";
import { auth, db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import Loader from "../../Common/Loader/Loader";

const CreatePodcastForm = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImage, setDisplayImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle Submit
  async function handleSubmit() {
    if (title && desc && displayImage && bannerImage) {
      setLoading(true);

      try {
        //Creating Folder in Firebase Storage
        const bannerImageRef = ref(
          storage,
          // Storage path
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );

        // Uploading Image to Firebase Storage
        await uploadBytes(bannerImageRef, bannerImage);

        // Getting Image Links
        const bannerImageUrl = await getDownloadURL(bannerImageRef);

        //Uploading Display Image
        const displayImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(displayImageRef, displayImage);

        const displayImageUrl = await getDownloadURL(displayImageRef);

        // Creating Document
        const podcastData = {
          title,
          description: desc,
          bannerImage: bannerImageUrl,
          displayImage: displayImageUrl,
          createdBy: auth.currentUser.uid,
        };

        // Uploading Document to fireStore
        const docRef = await addDoc(collection(db, "podcasts"), podcastData);

        //Resetting States
        setTitle("");
        setDesc("");
        setBannerImage(null);
        setDisplayImage(null);

        toast.success("Podcast Created");
        navigate('/profile');
        toast.success('Find Your Podcast Here');
        setLoading(false);
      } catch (err) {
        console.log("CreatePodcast-error", err);
        toast.error(err.message);
        setLoading(false);
      }
    } else {
      toast.error("File is Missing");
      setLoading(false);
    }
  }

  //Handling Display Image
  function displayImagehandle(file) {
    setDisplayImage(file);
  }

  //Handling Banner Image
  function bannerImagehandle(file) {
    setBannerImage(file);
  }

  if(loading){
    return(<Loader/>);
  }

  return (
    <div>
      <h1>Create Podcast</h1>

      <Input
        state={title}
        setState={setTitle}
        placeholder="Title"
        type="text"
        required={true}
      />
      <Input
        state={desc}
        setState={setDesc}
        placeholder="Description"
        type="text"
        required={true}
      />
      <FileInput
        accept={"image/*"}
        id={"display-image-input"}
        text="Display Image Upload"
        fileHandleFunc={displayImagehandle}
      />
      <FileInput
        accept={"image/*"}
        id={"banner-image-input"}
        text="Banner Image Upload"
        fileHandleFunc={bannerImagehandle}
      />

      <Button
        text={loading ? "Loading..." : "Create Podcast"}
        disabled={loading}
        onClick={handleSubmit}
      />
    </div>
  );
};

export default CreatePodcastForm;

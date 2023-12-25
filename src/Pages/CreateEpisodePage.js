import React from "react";
import Header from "../Components/Common/Header/Header";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "../Components/Common/Button/Button";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import FileInput from "../Components/Common/Inputs/Custom File Input/FileInput";
import Input from "../Components/Common/Inputs/Custom Input/Input";

const CreateEpisodePage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function audioFileHandle(file) {
    setAudioFile(file);
  }

  async function handleSubmit() {
    setLoading(true);
    if (title && desc && audioFile && id) {
      try {
        //Creating path in Storage
        const audioRef = ref(
          storage,
          `podcasts-episodes/${auth.currentUser.uid}/${Date.now()}`
        );
        //Uploading file to that path in storage
        await uploadBytes(audioRef, audioFile);

        //Getting links created by firebase storage
        const audioURL = await getDownloadURL(audioRef);
        const episodeData = {
          title,
          description: desc,
          audioFile: audioURL,
        };

        // Storing document in firebase database
        await addDoc(collection(db, "podcasts", id, "episodes"), episodeData);

        setLoading(false);
        toast.success("Episode Created");
        navigate(`/podcasts/${id}`);
        setDesc("");
        setAudioFile(null);
        setTitle("");
      } catch (err) {
        setLoading(false);
        toast.error(err.message);
        console.log("CreatePodCast error", err);
      }
    } else {
      setLoading(false);
      toast.error("All Files Should Be There");
    }
  }
  return (
    <div>
      <Header />

      <div className="input-wrapper">
        <h1>Create An Episode</h1>

        <Input
          state={title}
          setState={setTitle}
          placeholder={"Title"}
          type={"text"}
          required={true}
        />
        <Input
          state={desc}
          setState={setDesc}
          placeholder={"Description"}
          type={"text"}
          required={true}
        />

        <FileInput
          accept={"audio/*"}
          id={"audio-file-input"}
          text="Upload Audio File"
          fileHandleFunc={audioFileHandle}
        />

        <Button
          text={loading ? "Loading..." : "Create Episode"}
          disabled={loading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateEpisodePage;

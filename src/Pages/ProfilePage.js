import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Components/Common/Header/Header";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import Button from "../Components/Common/Button/Button";
import Loader from "../Components/Common/Loader/Loader";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import PodcastCard from "../Components/Common/Podcast Common Components/Podcast Card/PodcastCard";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slices/userSlice";
import EditImage from "../Components/Common/Podcast Common Components/Edit/Edit Image/EditImage";

const ProfilePage = () => {
  const user = useSelector((state) => state.user.user);
  const [userPodcasts, setUserPodcasts] = useState([]);
  const [uid, setUid] = useState("");
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editCoverImage, setEditCoverImage] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState(false);

  useState(() => {
    const intervalId = setInterval(() => {
      setEditCoverImage(false);
      setEditProfileImage(false);
    }, 7000);

    return () => clearInterval(intervalId);
  }, [editCoverImage, editProfileImage]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        retriveData(user.uid);
      } else {
        <Loader />;
      }
    });

    const podcastsData = [];
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapShot) => {
        querySnapShot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });

        // Filtering User's Podcasts
        const filteredPodcasts = podcastsData.filter(
          (podcasts) => podcasts.createdBy === uid
        );
        setUserPodcasts(filteredPodcasts);

        console.log("current uid", user);
        console.log("podcastsData", podcastsData);
        console.log("userPodcasts", filteredPodcasts);
        setEditCoverImage(false);
        setEditProfileImage(false);
      },
      (err) => {
        console.error("Error Profile", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [uid, update]);

  // Retriving data After Reload
  async function retriveData(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    const userData = userDoc.data();
    console.log(userData);

    try {
      // Storing data in Store

      dispatch(
        setUser({
          name: userData.name,
          email: userData.email,
          uid: userData.uid,
          profileImage: userData.profileImage,
          profileCoverImage: userData.profileCoverImage,
        })
      );

      setUserDataLoaded(true);
    } catch (err) {
      console.log("retive Error", err);
    }
  }

  // Handle logout
  function handleLogout() {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out Successful");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }

  // Handle Navigate
  function handleNavigate() {
    navigate("/start-podcast");
  }

  // handleEditCoverImage
  function handleEditCoverImage() {
    setEditCoverImage(true);
    setEditProfileImage(false);
  }

  // Handle Edit ProfileImage
  function handleEditProfileImage() {
    setEditCoverImage(false);
    setEditProfileImage(true);
  }

  if (!userDataLoaded) {
    return <Loader></Loader>;
  }

  return (
    <div className="profile-wrapper">
      <Header />

      <div className="input-wrapper">
        <h1>Profile</h1>
        <div className="banner-wrapper profile-cover">
          <img src={user.profileCoverImage} alt="" />
          <div className="profileCoverEdit" onClick={handleEditCoverImage}>
            {!editCoverImage && "Edit"}
            {editCoverImage && (
              <EditImage
                imageName="profileCoverImage"
                uid={uid}
                setUpdate={setUpdate}
                update={update}
                loading={loading}
                setLoading={setLoading}
                setEditImage={setEditCoverImage}
                editImage={editCoverImage}
              />
            )}
          </div>
        </div>
        <div className="podcast-card profile">
          <img
            className="display-image-podcast profile-image"
            src={user.profileImage}
            alt=""
          />
          <div className="profileEdit" onClick={handleEditProfileImage}>
            {!editProfileImage && "Edit"}
            {editProfileImage && (
              <EditImage
                imageName="profileImage"
                uid={uid}
                setUpdate={setUpdate}
                update={update}
                loading={loading}
                setLoading={setLoading}
                editImage={editProfileImage}
                setEditImage={setEditProfileImage}
              />
            )}
          </div>
        </div>
      </div>

      <div className="input-wrapper">
        <h1>Your Podcasts</h1>
        <div className="podcasts-flex" style={{ margin: "1.5rem" }}>
          {userPodcasts.length > 0 ? (
            userPodcasts.map((pod) => (
              <PodcastCard
                key={pod.id}
                id={pod.id}
                title={pod.title}
                displayImage={pod.displayImage}
              />
            ))
          ) : (
            <p onClick={handleNavigate} style={{ cursor: "pointer" }}>
              No Podcast Found. Click Here To Create Podcast
            </p>
          )}
        </div>
      </div>

      <Button
        text={"Logout"}
        onClick={handleLogout}
        style={{
          position: "absolute",
          right: "60px",
          top: "60px",
          width: "120px",
        }}
      />
    </div>
  );
};

export default ProfilePage;

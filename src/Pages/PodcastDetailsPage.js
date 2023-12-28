import React, { useEffect, useState } from "react";
import Header from "../Components/Common/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../firebase";
import { toast } from "react-toastify";
import Button from "../Components/Common/Button/Button";
import EpisodeDetails from "../Components/Common/Podcast Common Components/Episode Details/EpisodeDetails";
import AudioPlayer from "../Components/Common/Podcast Common Components/Audio Player/AudioPlayer";
import Loader from "../Components/Common/Loader/Loader";

const PodcastDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState({});
  const [episode, setEpisodes] = useState([]);
  const [playingFile, setPlayingFile] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("ID", id);
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  async function getData() {
    try {
      setLoading(true);
      const docRef = doc(db, "podcasts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setPodcast({ id, ...docSnap.data() });
      } else {
        toast.error("No such Document!");
        navigate("/podcasts");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
      console.log("PodcastDetailsPage Error", err);
    }
  }

  useEffect(() => {
    const unsubcribe = onSnapshot(
      query(collection(db, "podcasts", id, "episodes")),
      (querySnapShot) => {
        const episodeData = [];
        querySnapShot.forEach((doc) => {
          episodeData.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(episodeData.reverse());
      },
      (error) => {
        console.error("error fetching episodes", error);
      }
    );

    return () => {
      unsubcribe();
    };
  }, [id]);

  if (loading) {
    <Loader />;
  }
  return (
    <div>
      <Header />
      <div className="input-wrapper" style={{ marginTop: "0rem" }}>
        {podcast.id && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h1 className="podcast-title-heading">{podcast.title}</h1>
              {podcast.createdBy === auth.currentUser.uid && (
                <Button
                  text={"Create Episode"}
                  onClick={() => {
                    navigate(`/podcasts/${id}/create-episode`);
                  }}
                  style={{ width: "200px", margin: 0 }}
                />
              )}
            </div>
            <div className="banner-wrapper">
              <img src={podcast.bannerImage} alt="" />
            </div>
            <p className="podcast-description">{podcast.description}</p>
            <h1 className="podcast-title-heading">Episodes</h1>
            {episode.length > 0 ? (
              <>
                {episode.map((episode, index) => {
                  return (
                    <EpisodeDetails
                      key={index}
                      index={index + 1}
                      title={episode.title}
                      description={episode.description}
                      audioFile={episode.audioFile}
                      onClick={(file) => setPlayingFile(file)}
                    />
                  );
                })}
              </>
            ) : (
              <p>No Episodes</p>
            )}
          </>
        )}
      </div>
      {playingFile && (
        <AudioPlayer
          audioSrc={playingFile}
          image={podcast.displayImage}
          setPlayingFile={setPlayingFile}
        />
      )}
    </div>
  );
};

export default PodcastDetailsPage;

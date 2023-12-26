import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./Pages/SignupPage";
import ProfilePage from "./Pages/ProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "./slices/userSlice";
import PrivateRoutes from "./Components/Common/PrivateRoutes/PrivateRoutes";
import CreatePodcastPage from "./Pages/CreatePodcastPage";
import PodcastsPage from "./Pages/PodcastsPage";
import PodcastDetailsPage from "./Pages/PodcastDetailsPage";
import CreateEpisodePage from "./Pages/CreateEpisodePage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // onAuthStateChanged is used to listen for changes in the authentication state.
    // It takes two parameters: the authentication object (auth in this case) and a callback function.
    // The callback function is executed whenever the authentication state changes.
    // It receives the current user as an argument when the user is authenticated, and null when the user is signed out.
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        //You can listen to a document with the onSnapshot() method.
        //An initial call using the callback you provide
        //creates a document snapshot immediately with the current contents of the single document.
        //Then, each time the contents change, another call updates the document snapshot.
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              // Getting user's Data
              const userData = userDoc.data();

              // Storing data in redux
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                  profileImage: user.profileImage,
                  profileCoverImage: user.profileCoverImage,
                })
              );
            }
          },
          // It is 3rd parameter of onSnapshot function
          (err) => {
            console.log("App-fetching user data", err);
          }
        );

        // Cleanup Code
        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    // Cleanup Code
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/start-podcast" element={<CreatePodcastPage />} />
            <Route path="/podcasts" element={<PodcastsPage />} />
            <Route path="/podcasts/:id" element={<PodcastDetailsPage />} />
            <Route
              path="/podcasts/:id/create-episode"
              element={<CreateEpisodePage />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Anime() {
  //Form state
  const [anime, setAnime] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  //Submit Anime
  const submitAnime = async (e) => {
    e.preventDefault();
    //Run checks for description
    if (!anime.description) {
      toast.error("Description Field empty 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (anime.description.length > 300) {
      toast.error("Description too long 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (anime?.hasOwnProperty("id")) {
      const docRef = doc(db, "movies", anime.id);
      const updatedAnime = { ...anime, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedAnime);
      return route.push("/");
    } else {
      //Make a new anime
      const collectionRef = collection(db, "animes");
      await addDoc(collectionRef, {
        ...anime,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setAnime({ description: "" });
      toast.success("Anime has been made 🚀", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
    }
  };

  //Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setAnime({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitAnime}>
        <h1 className="text-2xl font-bold">
          {anime.hasOwnProperty("id") ? "Edit your anime" : "Create a new anime"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={anime.description}
            onChange={(e) => setAnime({ ...anime, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              anime.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {anime.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

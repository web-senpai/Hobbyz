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

export default function Movies() {
  //Form state
  const [movies, setMovies] = useState({ description: "" ,title:""});
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  //Submit Movies
  const submitMovies = async (e) => {
    e.preventDefault();
    //Run checks for description
    if (!movies.description) {
      toast.error("Description Field empty 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (!movies.title) {
      toast.error("Title Field empty 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (movies.description.length > 300) {
      toast.error("Description too long 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (movies?.hasOwnProperty("id")) {
      const docRef = doc(db, "movies", movies.id);
      const updatedMovies = { ...movies, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedMovies);
      return route.push("/");
    } else {
      //Make a new movies
      const collectionRef = collection(db, "movies");
      await addDoc(collectionRef, {
        ...movies,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setMovies({ description: "" ,title: "" });
      toast.success("Movies has been made 🚀", {
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
      setMovies({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className=" p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitMovies}>
        <h1 className="text-2xl font-bold">
          {movies.hasOwnProperty("id") ? "Edit your movies" : "Create a new movies"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Title</h3>
          <input type="text"   value={movies.title}
            onChange={(e) => setMovies({ ...movies, title: e.target.value })}
            className="bg-gray-800 h-10 w-full text-white rounded-lg p-2 mb-2 text-sm"></input>
            <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={movies.description}
            onChange={(e) => setMovies({ ...movies, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              movies.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {movies.description.length}/300
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

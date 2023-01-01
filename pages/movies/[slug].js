import Message from "../../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useStore } from "../../store/store";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessages] = useState([]);
  const { movie, getMovieDetail } = useStore((state) => ({
    loading: state.loading,
    movie: state.movie,
    getMovieDetail: state.getMovieDetail,
  }));
  console.log(
    "🚀 ~ file: [slug].js:30 ~ const{movie,getMovieDetail}=useStore ~ movie",
    movie
  );

  //Submit a message
  const submitMessage = async () => {
    //Check if the user is logged
    if (!auth.currentUser) return router.push("/auth/login");

    if (!message) {
      console.log(message);
      toast.error("Don't leave an empty message 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "movies", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  const getComments = async () => {
    const docRef = doc(db, "movies", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
    getMovieDetail(routeData.description);
  }, [router.isReady]);

  return (
    <div className=" mb-4">
      <section class="text-gray-600 body-font overflow-hidden">
        <div class="container px-2 ">
          <div class="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              class="md:w-1/2 w-full md:h-auto h-64 object-cover object-center rounded"
              src={movie.Poster}
            />
            <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 class="text-sm title-font text-gray-500 tracking-widest">
                {movie.Genre}
              </h2>
              <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">
                {movie.Title}
              </h1>
              <div class="flex mb-4">
                <span class="flex items-center">
                  <span class="text-blue-500 ">IMDB : { movie?.Rating?.length>0 &&  movie?.Ratings[0].Value}</span>
                </span>
              </div>
              <p class="leading-relaxed">{movie.Plot}.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

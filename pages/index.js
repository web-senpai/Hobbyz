import Head from "next/head";
import Message from "../components/message";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import Movie from "../components/movies/Movies";
import Game from "../components/games/Game";
import Series from "../components/series/series";
import Anime from "../components/animes/Anime";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>Hobbyz</title>
        <meta name="hobbyz" content="tv sereis , games , movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Movie/>
      <Series/>
      <Anime/>
      <Game/>
    </div>
  );
}

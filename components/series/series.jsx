import Head from "next/head";
import Message from "../message";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";

export default function Series() {
  const [allSeriess, setAllSeriess] = useState([]);

  const getSeriess = async () => {
    const collectionRef = collection(db, "series");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllSeriess(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getSeriess();
  }, []);

  return (
    <div>
      <div className="my-12 text-lg font-medium">
        <h2  className="font-semibold p-2  bg-gradient-to-r from-yellow-100 to-neutral-50 shadow-xl mb-1">Series Section</h2>
        {allSeriess.map((series) => (
         <div className="wrapper bg-yellow-100 antialiased text-gray-900 p-4 rounded-b-lg shadow-lg">
         <div>
           <img
             src="https://source.unsplash.com/random/350x350"
             alt=" random imgee"
             className="w-full h-40 p-2 object-cover object-center rounded-lg shadow-md"
           />

           <div className="relative px-4 -mt-16  ">
             <div className="bg-white p-6 rounded-lg shadow-lg">
               <div className="flex items-baseline">
                 <span className="bg-teal-200 text-teal-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
                   Genre
                 </span>
                 <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                   Action &bull; Comedy
                 </div>
               </div>

               <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">
                 {series.description}
               </h4>

               <div className="mt-1">
                 $1800
                 <span className="text-gray-600 text-sm"> /wk</span>
               </div>
               <div className="mt-4">
                 <span className="text-teal-600 text-md font-semibold">
                   4/5 ratings{" "}
                 </span>
                 <span className="text-sm text-gray-600">
                   (based on 234 ratings)
                 </span>
               </div>
               <div className="mt-4">
                 <Link
                   href={{
                     pathname: `movies/${series.id}`,
                     query: { ...series },
                   }}
                 >
                   <button className="bg-yellow-200 text-white rounded-md p-2 font-mono">
                     See more
                   </button>
                 </Link>
               </div>
             </div>
           </div>
         </div>
       </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState, useContext, useRef } from "react";
import FirestoreContext from "../contexts/FirestoreContext";
import useGetCollectionOnChange from "../../hooks/useGetCollectionOnChange";
import SignOutBtn from "../SignOutButton/SignOutBtn";
import { auth } from "../Firebase/firebase";
import { db } from "../Firebase/firebase";
import { storage } from "../Firebase/firebase";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  onSnapshot,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getDocFromCache,
  query,
  where,
  getDocs,
  startAt,
  startAfter,
  orderBy,
  endAt,
  endBefore,
  limit,
  limitToLast,
} from "firebase/firestore";

const HomePage = () => {
  const [cities, setCities] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [books, setBooks] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [documentSnapshotSize, setDocumentSnapshotSize] = useState(null);
  const [progress, setProgress] = useState(0);

  //const [users, setUsers] = useState(null);
  const dbCtx = useContext(FirestoreContext);
  const users = useGetCollectionOnChange("users");

  // useEffect(() => {
  //   const displayCities = async () => {
  //     // Query the first page of docs
  //     const first = query(collection(db, "cities"), orderBy("name"), limit(4));
  //     const documentSnapshots = await getDocs(first);
  //     const firstVis = documentSnapshots.docs[0];
  //     const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  //     setFirstVisible(firstVis);
  //     setLastVisible(lastVis);

  //     const cityArray = [];
  //     documentSnapshots.forEach((doc) => {
  //       cityArray.push({ id: doc.id, ...doc.data() });
  //     });
  //     setCities(cityArray);
  //   };
  //   displayCities();
  // }, []);

  useEffect(() => {
    // Get an image from the storage and display it on the screen
    // const imageRef = ref(storage, "images/eventLoop.png");
    // getDownloadURL(imageRef).then((url) => {
    //   setImageUrl(url);
    // });

    // Get book collection
    // if (books.length) {
    //   return;
    // }

    getDocs(collection(db, "books")).then((qSnapshot) => {
      const docs = [];
      qSnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      docs.forEach((book) => {
        getDownloadURL(ref(storage, book.thumbnail)).then((downloadURL) => {
          book.thumbnail = downloadURL;

          setBooks((prevBooks) => {
            return [...prevBooks, book];
          });
        });
      });
    });

    // const books = await dbCtx.getEntireCollection(db, "books"); // this really makes no sense. Im using await internally and also here
    // console.log(books);

    // setBooks(books);

    // Query the first page of docs
    const first = query(collection(db, "cities"), where("capital", "==", true), limit(11));

    const unsubscribe = onSnapshot(first, (result) => {
      console.log(result);
      const cities = [];
      const firstVis = result.docs[0];
      const lastVis = result.docs[result.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      result.forEach((city) => {
        cities.push({ id: city.id, ...city.data() });
      });
      setCities(cities);
    });
    return unsubscribe;
  }, []);

  const onNextPageHandler = () => {
    const next = query(collection(db, "cities"), orderBy("name"), startAfter(lastVisible), limit(3));
    // Im not unsubscribing because this is not a lifecycle method. I need a realtime listener for every document that the user is looking at, in case someone else reserves the book
    onSnapshot(next, (result) => {
      if (!result.docs.length) {
        return;
      }
      setDocumentSnapshotSize(result.size);
      const firstVis = result.docs[0];
      const lastVis = result.docs[result.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      const cities = [];
      result.forEach((city) => {
        cities.push({ id: city.id, ...city.data() });
      });
      setCities(cities);
    });
  };

  // const onNextPageHandler = async () => {
  //   const next = query(collection(db, "cities"), orderBy("name"), startAfter(lastVisible), limit(4));
  //   const documentSnapshots = await getDocs(next);

  //   // there are no more document in the collection. Stop the next
  //   if (!documentSnapshots.docs.length) {
  //     return;
  //   }
  //   setDocumentSnapshotSize(documentSnapshots.size);
  //   //Keep in mind the possibility of documents being updated by other users as you paginate. How to show updates in real time? Will a book be reserved and be updated on the screen for the other user to see. This is going to be the most difficult implementation for which i havent thought about

  //   const firstVis = documentSnapshots.docs[0];
  //   const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  //   setFirstVisible(firstVis);
  //   setLastVisible(lastVis);

  //   const cityArray = [];
  //   documentSnapshots.forEach((doc) => {
  //     cityArray.push({ id: doc.id, ...doc.data() });
  //   });
  //   setCities(cityArray);
  // };

  const onPreviousPageHandler = async () => {
    if (documentSnapshotSize === 1) {
      const previous = query(
        collection(db, "cities"),
        orderBy("name"),
        endBefore(lastVisible),
        limitToLast(3)
      );
      const documentSnapshots = await getDocs(previous);

      //there are no more previous documents in the collection. Stop the previous
      if (!documentSnapshots.docs.length) {
        return;
      }
      setDocumentSnapshotSize(documentSnapshots.size);
      const firstVis = documentSnapshots.docs[0];
      const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      const cityArray = [];
      documentSnapshots.forEach((doc) => {
        cityArray.push({ id: doc.id, ...doc.data() });
      });
      setCities(cityArray);
    } else {
      const previous = query(
        collection(db, "cities"),
        orderBy("name"),
        endBefore(firstVisible),
        limitToLast(3)
      );

      const documentSnapshots = await getDocs(previous);

      if (!documentSnapshots.docs.length) {
        return;
      }
      setDocumentSnapshotSize(documentSnapshots.size);
      const firstVis = documentSnapshots.docs[0];
      const lastVis = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setFirstVisible(firstVis);
      setLastVisible(lastVis);
      const cityArray = [];
      documentSnapshots.forEach((doc) => {
        cityArray.push({ id: doc.id, ...doc.data() });
      });
      setCities(cityArray);
    }
  };

  const onUpdateHandler = async () => {
    // const docRef = doc(db, "cities", "TOK");
    // dbCtx.updateDocument(docRef, {
    //   country: "Hallall",
    // });
    // subcollections can be used to hide certain data that you dont want a client to be able to access. Of course you need to create two different sets of security rules one for a collection and the other for a subcollection. For example you may control the read of the subcollection only to admin users.
    const docRef = doc(db, "cities", "/BJ/private_data/private");

    //const docRef = doc(db, "cities", "BJ");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const onStorageHandler = () => {
    const storageRef = ref(storage);
    console.log(storageRef); // ref object for root of storage
    console.log(storageRef.fullPath); // nothing comes up for root
    console.log(storageRef.name); // nothing
    console.log(storageRef.bucket); //learning-firestore-with-react.appspot.com

    const eventLoopRef = ref(storage, "images/eventLoop.png");
    console.log(eventLoopRef); // Reference object
    console.log(eventLoopRef.parent); // reference to images object
    console.log("fullPath", eventLoopRef.parent.fullPath); //images
    console.log("bucket", eventLoopRef.parent.bucket); //learning-firestore-with-react.appspot.com
    console.log("name", eventLoopRef.parent.name);
  };
  const fileRef = useRef();

  const onSubmitFile = (ev) => {
    ev.preventDefault();
    const uid = auth.currentUser.uid;
    //const file = fileRef.current.value; // dont know how to make ref work. code below works. I think ref only retun the value of ref not the actual file. That's why we need to get the file from ev target files
    const file = ev.target[0].files[0];
    console.log(file);
    if (!file) {
      return;
    }
    // Think about how you will get the basic metadat of the files being uploaded. getMetadata, updateMetadata
    const storageRef = ref(storage, `files/${uid}`);

    // this is a way to upload a file without showing any progress bar
    // uploadBytes(storageRef, file).then((snapshot) => {
    //   console.log("Uploaded a blob or file!", snapshot);
    // });

    // this is how to show progress bar
    const uploadTask = uploadBytesResumable(storageRef, file);

    // uploadtask(observer,snapshot,error,success)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        console.log(snapshot.bytesTransferred, snapshot.totalBytes);
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(progress);
        setProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );

    console.log(auth.currentUser);
  };

  const uploadFile = () => {
    const file = fileRef.current.value;
    const storageRef = ref(storage, `files/${file}`);

    // uploadBytes(storageRef, file).then((snapshot) => {
    //   console.log("Uploaded a blob or file!", snapshot);
    // });
    console.log(fileRef.current.name);
  };

  return (
    <div>
      <h1>Homepage</h1>
      <p>Only authenticated users can access this page</p>
      {/* <ul>
        {cities.length > 0 &&
          cities.map((doc) => {
            return (
              <div key={doc.id}>
                <li>{doc.name}</li>
              </div>
            );
          })}
      </ul> */}
      <ul>
        {books.length > 0 &&
          books.map((book) => {
            return (
              <div key={book.id}>
                <li>{book.name}</li>
                <img width='350' src={book.thumbnail} />
              </div>
            );
          })}
      </ul>

      <div>
        <form onSubmit={onSubmitFile}>
          <div>
            <input ref={fileRef} type='file'></input>
          </div>
          <button type='submit'>Upload File</button>
        </form>
        <h3>Uploaded:{progress} % </h3>

        {/* {progress === 0 ? "" : <h3>Uploaded:{progress} %</h3>} */}
        <hr />
        <button onClick={onPreviousPageHandler}>Previous</button>
        <button onClick={onNextPageHandler}>Next</button>
        <button onClick={onUpdateHandler}>Update City</button>
        <button onClick={onStorageHandler}>Storage Experiment</button>
      </div>
      <SignOutBtn />
    </div>
  );
};

export default HomePage;

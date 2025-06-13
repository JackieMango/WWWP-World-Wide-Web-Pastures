// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  getDoc, 
  getDocs,
  addDoc, 
  doc, 
  setDoc, 
  deleteDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import User from "./user.js";
import Cow from "./cow.js";
import Chicken from "./chicken.js";
import Goat from "./goat.js";

export const firebaseConfig = {
  apiKey: "x",
  authDomain: "x",
  projectId: "x",
  storageBucket: "x",
  messagingSenderId: "x",
  appId: "x",
  measurementId: "x"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export {deleteDoc,db,doc};
// Create new document in the users collection in firestore
// Takes the uid and username of a new user as parameters
export function newUserDoc(uid, name) {
    // sets user doc with uid as doc ID
  setDoc(doc(db, "Users", uid), {
    username: name,
    coins: 100,
    wheat_stage: 0,
    watermelon_stage: 0,
    carrot_stage: 0
  });
  // wheat doc in Inventory
  setDoc(doc(db, "Users", uid, "Inventory", "wheat"), {
    type: 1, // harvested
    crop: 1,
    count: 0
  });
  // watermelons doc in Inventory
  setDoc(doc(db, "Users", uid, "Inventory", "watermelons"), {
    type: 1,
    crop: 2,
    count: 0
  });
  // carrots doc in Inventory
  setDoc(doc(db, "Users", uid, "Inventory", "carrots"), {
    type: 1,
    crop: 3,
    count: 0
  });
  // wheat_seeds doc in Inventory
  setDoc(doc(db, "Users", uid, "Inventory", "wheat_seeds"), {
    type: 2, // seeds
    crop: 1,
    count: 5
  });
  // watermelon_seeds doc in Inventory
  setDoc(doc(db, "Users", uid, "Inventory", "watermelon_seeds"), {
    type: 2,
    crop: 2,
    count: 0
  });
  // carrot_seeds doc in Inventory
  setDoc(doc(db, "Users", uid, "Inventory", "carrot_seeds"), {
    type: 2,
    crop: 3,
    count: 0
  });

  // creates and adds two new cows to the database
  for (let i = 0; i < 2; i++) {
    setDoc(doc(db, "Users", uid, "Animals", "cow"+i), {
      name: "Cow"+i,
      breed: 1,
      age: 0, // for possible future implementation
      speed: 1,//stats["Speed"],
      smarts: 5,//stats["Smarts"],
      style: 5,//stats["Style"],
      strength: 10,//stats["Strength"],
      texture: "cow",
      breeding: false // for possible future implementation
    }, {merge:true}) // merge:true allows you to add new fields
    .catch(error => {
        console.log(error);
    });
  }
}

// Saves all user data to firestore
// Takes a user ID and User object
export function saveData(user) {
  const uid = user.uid;
  const loader = document.getElementsByClassName("loader")[0];
  if(loader) {
    loader.style.display = "block";
  }

  // sets coins and crop stages in database
  setDoc(doc(db, "Users", uid), {
    coins: user.coins,
    wheat_stage: user.wheatStage,
    watermelon_stage: user.watermelonStage,
    carrot_stage: user.carrotStage
  }, {merge: true}) 
  .then(() => {
    const savedMessage = document.getElementById("saved-message");
    if(savedMessage) {
      let dateNow = new Date();
      savedMessage.innerText = "Last saved " + dateNow.toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    loader.style.display = "none";
  })
  .catch(error => {
      console.log(error);
      if(savedMessage && loader) {
        savedMessage.innerText = "Error: Unable to save data";
        loader.style.display = "none";
      }
  });

  // cycles through crop dictionary, updating count for every crop
  user.crops.forEach((cnt, cropNum) => {
    getDocs(query(collection(db, "Users", uid, "Inventory"), where("type", "==", 1), where("crop", "==", cropNum)))
    .then((docSnap) => {
      if (!docSnap.empty) {
        docSnap.forEach((docSnapDoc) => {
          setDoc(doc(db, "Users", uid, "Inventory", docSnapDoc.id), {
            count: cnt
          },{merge:true});
        }); 
      }
      // if the doc snapshot is empty, the crop is not in the database =>
      // add a new document for the crop (the docID is randomly generated)
      else {
        addDoc(collection(db, "Users", uid, "Inventory"), {
          type: 1,
          crop: cropNum,
          count: cnt
        });
      }
    });
  });

  // cycles through seeds dictionary, updating count for every crop
  user.seeds.forEach((cnt, cropNum) => {
    getDocs(query(collection(db, "Users", uid, "Inventory"), where("type", "==", 2), where("crop", "==", cropNum)))
    .then((docSnap) => {
      if (!docSnap.empty) {
        docSnap.forEach((docSnapDoc) => {
          setDoc(doc(db, "Users", uid, "Inventory", docSnapDoc.id), {
            count: cnt
          },{merge:true});
        }); 
      }
      // if the doc snapshot is empty, the crop is not in the database =>
      // add a new document for the crop (the docID is randomly generated)
      else {
        addDoc(collection(db, "Users", uid, "Inventory"), {
          type: 2,
          crop: cropNum,
          count: cnt
        });
      }
    });
  });

  // push all Cows in User object to database
  for (let i = 0; i < user.getCowCnt(); i++) {
    const curCow = user.getCow(i);
    const stats = curCow.stats;
    setDoc(doc(db, "Users", uid, "Animals", curCow.animalID), {
      name: curCow.name,
      breed: 1,
      age: 0, // for possible future implementation
      speed: stats["Speed"],
      smarts: stats["Smarts"],
      style: stats["Style"],
      strength: stats["Strength"],
      texture: curCow.animalTexture,
      breeding: false // for possible future implementation
    }, {merge:true}) // merge:true allows you to add new fields
    .catch(error => {
        console.log(error);
    });
  }

  // push all Chickens in User object to database
  for (let i = 0; i < user.getChickenCnt(); i++) {
    const curChick = user.getChicken(i);
    const stats = curChick.stats;
    setDoc(doc(db, "Users", uid, "Animals", curChick.animalID), {
      name: curChick.name,
      breed: 2,
      age: 0, // for possible future implementation
      speed: stats["Speed"],
      smarts: stats["Smarts"],
      style: stats["Style"],
      strength: stats["Strength"],
      texture: curChick.animalTexture,
      breeding: false // for possible future implementation
    }, {merge:true}) // merge:true allows you to add new fields
    .catch(error => {
        console.log(error);
    });
  }

  // push all Goats in User object to database
  for (let i = 0; i < user.getGoatCnt(); i++) {
    const curGoat = user.getGoat(i);
    const stats = curGoat.stats;
    setDoc(doc(db, "Users", uid, "Animals", curGoat.animalID), {
      name: curGoat.name,
      breed: 3,
      age: 0, // for possible future implementation
      speed: stats["Speed"],
      smarts: stats["Smarts"],
      style: stats["Style"],
      strength: stats["Strength"],
      texture: curGoat.animalTexture,
      breeding: false // for possible future implementation
    }, {merge:true}) // merge:true allows you to add new fields
    .catch(error => {
        console.log(error);
    });
  }
}

// Loads all user data from firestore
// Takes the user ID and returns a user object
export async function loadData(uid, scene) {
  // Initialize new User object
  let thisUser = new User(uid);

  // Set coins and crop stages
  let docSnap = await getDoc(doc(db, "Users", uid));
    thisUser.username = docSnap.data().username;
    thisUser.coins = docSnap.data().coins;
    thisUser.wheatStage = docSnap.data().wheat_stage;
    thisUser.watermelonStage = docSnap.data().watermelon_stage;
    thisUser.carrotStage = docSnap.data().carrot_stage;

  // Update crop dictionary in User object
  docSnap = await getDocs(query(collection(db, "Users", uid, "Inventory"), where("type", "==", 1)));
      docSnap.forEach((doc) => {
        thisUser.addCrop(doc.data().crop, doc.data().count);
      });

  // Update seed dictionary in User object
  docSnap = await getDocs(query(collection(db, "Users", uid, "Inventory"), where("type", "==", 2)));
    docSnap.forEach((doc) => {
      thisUser.addSeeds(doc.data().crop, doc.data().count);
    });

  // Retrieve and initialize cows
  docSnap = await getDocs(query(collection(db, "Users", uid, "Animals"), where("breed", "==", 1)));
    docSnap.forEach((doc) => {
      let newCow = new Cow(scene, 0, 0, doc.data().texture, doc.id);
      newCow.name = doc.data().name;
      newCow.setStats("Speed", doc.data().speed);
      newCow.setStats("Strength", doc.data().strength);
      newCow.setStats("Smarts", doc.data().smarts);
      newCow.setStats("Style", doc.data().style);
      thisUser.addCow(newCow);
    }); 

  // Retrieve and initialize chickens
  docSnap = await getDocs(query(collection(db, "Users", uid, "Animals"), where("breed", "==", 2)));
    docSnap.forEach((doc) => {
      let newChick = new Chicken(scene, 0, 0, doc.data().texture, doc.id);
      newChick.name = doc.data().name;
      newChick.setStats("Speed", doc.data().speed);
      newChick.setStats("Strength", doc.data().strength);
      newChick.setStats("Smarts", doc.data().smarts);
      newChick.setStats("Style", doc.data().style);
      thisUser.addChicken(newChick);
    }); 

  // Retrieve and initialize goats
  docSnap = await getDocs(query(collection(db, "Users", uid, "Animals"), where("breed", "==", 3)));
    docSnap.forEach((doc) => {
      let newGoat = new Goat(scene, 0, 0, doc.data().texture, doc.id);
      newGoat.name = doc.data().name;
      newGoat.setStats("Speed", doc.data().speed);
      newGoat.setStats("Strength", doc.data().strength);
      newGoat.setStats("Smarts", doc.data().smarts);
      newGoat.setStats("Style", doc.data().style);
      thisUser.addGoat(newGoat);
    }); 

  return thisUser;
}
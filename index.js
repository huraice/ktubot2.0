const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

// Firebase configuration (replace with your Firebase project details)
const firebaseConfig = {
    apiKey: "AIzaSyCjNT-R-2YBB5OPtRau3xWjaXn6Gsovf4w",
    authDomain: "ktubot-2.firebaseapp.com",
    projectId: "ktubot-2",
    storageBucket: "ktubot-2.appspot.com",
    messagingSenderId: "442977003500",
    appId: "1:442977003500:web:221c297810cfe4662402c9",
    measurementId: "G-Q4RZ2TVWGR",
    databaseURL: "https://ktubot-2-default-rtdb.asia-southeast1.firebasedatabase.app"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
const database = getDatabase(app);

const client = new Client({
   authStrategy: new LocalAuth()
});

// Generate QR code for authentication
client.on('qr', (qr) => {
   qrcode.generate(qr, { small: true });
});

// Log when bot is ready
client.on('ready', () => {
   console.log('Bot is ready!');
});

// Listen for incoming messages
client.on('message', message => {
   // Check if the message starts with a "/"
   if (message.body.startsWith('/')) {
      const requestedCode = message.body.slice(1).trim().toUpperCase(); // Remove the "/" and trim spaces

      // Retrieve the note link from Firebase Realtime Database
      const noteRef = ref(database, `notes/${requestedCode}`);
      get(noteRef)
         .then((snapshot) => {
            if (snapshot.exists()) {
               const noteLink = snapshot.val();
               message.reply(`Here is the link to your requested note: ${noteLink}`);
            } else {
               message.reply('Sorry, the code you entered is not valid. Please check and try again.');
            }
         })
         .catch((error) => {
            console.error(error);
            message.reply('There was an error retrieving the note. Please try again later.');
         });
   }
});

// Initialize WhatsApp client
client.initialize();

// //
// // Import Firebase and required modules (Firebase SDK v9+)
// const { initializeApp } = require('firebase/app');
// const { getDatabase, ref, set, get, child } = require('firebase/database');

// // Firebase configuration (replace with your Firebase project details)
// const firebaseConfig = {
//     apiKey: "AIzaSyCjNT-R-2YBB5OPtRau3xWjaXn6Gsovf4w",
//     authDomain: "ktubot-2.firebaseapp.com",
//     projectId: "ktubot-2",
//     storageBucket: "ktubot-2.appspot.com",
//     messagingSenderId: "442977003500",
//     appId: "1:442977003500:web:221c297810cfe4662402c9",
//     measurementId: "G-Q4RZ2TVWGR"
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Database and get a reference to the service
// const database = getDatabase(app);

// // Function to add or update a note in the database
// function storeNoteInFirebase(noteCode, noteLink) {
//    const noteRef = ref(database, 'notes/' + noteCode);
//    set(noteRef, noteLink)
//       .then(() => {
//          console.log(`Note with code ${noteCode} has been added/updated successfully.`);
//       })
//       .catch((error) => {
//          console.error('Error storing note:', error);
//       });
// }

// // Function to retrieve a note from the database
// function getNoteFromFirebase(noteCode) {
//    const dbRef = ref(database);
//    get(child(dbRef, `notes/${noteCode}`)).then((snapshot) => {
//       if (snapshot.exists()) {
//          console.log(`Note for ${noteCode}: `, snapshot.val());
//       } else {
//          console.log('No data available');
//       }
//    }).catch((error) => {
//       console.error('Error retrieving note:', error);
//    });
// }
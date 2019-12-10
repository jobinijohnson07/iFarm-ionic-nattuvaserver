var admin = require("firebase-admin");
var serviceAccount = require("./key/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://us-central1-nattuvaagri-1267b.cloudfunctions.net/app"
});
const functions = require("firebase-functions");

var db = admin.firestore();
var data = {
  name: "Los Angeles",
  state: "CA",
  country: "USA"
};

// Add a new document in collection "cities" with ID 'LA'
var setDoc = db
  .collection("cities")
  .doc("LA")
  .set(data);
setDoc;

let express = require("express"),
  cookieParser = require("cookie-parser")(),
  cors = require("cors")({ origin: true }),
  app = express(),
  validateFirebaseIdToken = require("./middlewares/validateToken"),
  productRoutes = require("./routes/productRoutes"),
  userRoutes = require("./routes/userRoutes"),
  functions = require("firebase-functions"),
  admin = require("./config/firebaseConfig"),
  db = admin.firestore();
(bodyParser = require("body-parser")),
  (request = require("request")),
  app.use(cors);
app.use(bodyParser.json());
app.use(cookieParser);
app.use("/products", validateFirebaseIdToken, productRoutes);
app.use("/users", validateFirebaseIdToken, userRoutes);

exports.addUser = functions.auth.user().onCreate(user => {
  console.log("user from addUser cloud function is ", user);
  db.collection("users")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      role: "buyer",
      overallRating: 0.0,
      bought: Array(),
      sold: Array(),
      uploads: Array(),
      pendingTransactions: Array(),
      cart: Array(),
      wishlist: Array(),
      uid: user.uid
    })
    .then(newUser => {
      console.log("new user is created and boarded to database ", newUser);
      return newUser;
    })
    .catch(err => {
      console.log("error in user onboarding ", err);
      return err;
    });
  return user;
});

exports.app = functions.https.onRequest(app);

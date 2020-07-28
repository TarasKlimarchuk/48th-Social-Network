const { db, admin } = require('../util/admin')

const config = require('../util/config')

// TODO delete this package =====!!! const { uuid } = require("uuidv4"); !!!====
/*
const gcconfig = {
    projectId: "social-apppp",
    keyFilename: 'social-apppp-firebase-adminsdk-bdv68-e267ca92e6.json'
}

const gcs = require('@google-cloud/storage')(gcconfig);*/
const cors = require('cors')({origin: true})

const uuid = require('uuidv4')
/*
const os = require("os");
const path = require("path");
const Busboy = require("busboy");
const fs = require("fs");
*/

const firebase = require('firebase');
firebase.initializeApp(config)

function isEmpty(value){
    if(value.trim() === '') return true
    else return false
}

function isEmailValid(email){
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!email.match(regEx);
}


// TODO add image handler
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let errors = {}
    if(isEmpty(newUser.handle)) errors.userHandle = 'Must not be empty'
    if(isEmpty(newUser.email)) errors.email = 'Must not be empty'
    if(!isEmailValid(newUser.email)) errors.email = 'Email is invalid'
    if(isEmpty(newUser.password)) errors.password = 'Must not be empty'
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'passwords do not match'

    if(Object.keys(errors).length !== 0){
        return res.status(400).json(errors)
    }

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ handle: "this handle is already taken" });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/social-apppp.appspot.com/o/no-img-avatar.jpg?alt=media&token=5bc7ea6b-dea3-42ab-976d-ac70260b25a4',
                userId,
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(200).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({ email: "Email is already is use" });
            } else {
                return res
                    .status(500)
                    .json({ general: "Something went wrong, please try again" });
            }
        });
};

exports.login = (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    let errors = {}
    if(isEmpty(user.email)) errors.handle = 'Must not be empty';
    if(!isEmailValid(user.email)) errors.email = 'Email is invalid'
    if(Object.keys(errors).length > 0){
        return res.status(400).json(errors)
    }

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err)
            if(err.code === 'auth/wrong-password'){
                return res.status(400).json({general: 'Wrong credentials, please try again'})
            } else {
                return res.status(500).json({error: err.code})
            }
        })
}

// Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = {};

    if (!isEmpty(req.body.bio.trim())) userDetails.bio = req.body.bio;
    if (!isEmpty(req.body.website.trim())) {
        // https://website.com
        if (req.body.website.trim().substring(0, 4) !== 'http') {
            userDetails.website = `http://${req.body.website.trim()}`;
        } else userDetails.website = req.body.website;
    }
    if (!isEmpty(req.body.location.trim())) userDetails.location = req.body.location;
    
    db.doc(`/users/${req.user.handle}`)
        .update(userDetails)
        .then(() => {
            return res.json({ message: "Details added successfully" });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Get any user's details
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.user = doc.data();
                return db
                    .collection("posts")
                    .where("userHandle", "==", req.params.handle)
                    .get();
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        })
        .then((data) => {
            userData.posts = [];
            data.forEach((doc) => {
                userData.posts.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    postId: doc.id,
                });
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db
                    .collection("likes")
                    .where("userHandle", "==", req.user.handle)
                    .get();
            }
        })
        .then((data) => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data());
            });
            return res.json(userData);
           /* return db
                .collection("notifications")
                .where("recipient", "==", req.user.handle)
                .orderBy("createdAt", "desc")
                .limit(10)
                .get();*/
        })
        /*.then((data) => {
            userData.notifications = [];
            data.forEach((doc) => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    postId: doc.data().postId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id,
                });
            });
            return res.json(userData);
        })*/
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch
        .commit()
        .then(() => {
            return res.json({ message: "Notifications marked read" });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

/*exports.uploadImage = (req,res) => {

        if (req.method !== "POST") {
            return res.status(500).json({
                message: "Not allowed"
            });
        }
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = { file: filepath, type: mimetype };
            file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on("finish", () => {
            const bucket = gcs.bucket("gs://social-apppp.appspot.com");
            bucket
                .upload(uploadData.file, {
                    uploadType: "media",
                    metadata: {
                        metadata: {
                            contentType: uploadData.type
                        }
                    }
                })
                .then(() => {
                    res.status(200).json({
                        message: "It worked!"
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
        busboy.end(req.rawBody);

}*/

/*exports.uploadImage = (req,res) => {
    cors(req,res, () => {
        const BusBoy = require("busboy");
        const path = require("path");
        const os = require("os");
        const fs = require("fs");

        const busboy = new BusBoy({ headers: req.headers });

        let imageToBeUploaded = {};
        let imageFileName;
        // String for image token
        let generatedToken = uuid();

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            console.log(fieldname, file, filename, encoding, mimetype);
            if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
                return res.status(400).json({ error: "Wrong file type submitted" });
            }
            // my.image.png => ['my', 'image', 'png']
            const imageExtension = filename.split(".")[filename.split(".").length - 1];
            // 32756238461724837.png
            imageFileName = `${Math.round(
                Math.random() * 1000000000000
            ).toString()}.${imageExtension}`;
            const filepath = path.join(os.tmpdir(), imageFileName);
            imageToBeUploaded = { filepath, mimetype };
            file.pipe(fs.createWriteStream(filepath));
        });
        busboy.on("finish", () => {
            admin
                .storage()
                .bucket(config.storageBucket)
                .upload(imageToBeUploaded.filepath, {
                    resumable: false,
                    metadata: {
                        metadata: {
                            contentType: imageToBeUploaded.mimetype,
                            //Generate token to be appended to imageUrl
                            firebaseStorageDownloadTokens: generatedToken,
                        },
                    },
                })
                .then(() => {
                    // Append token to url
                    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
                    return db.doc(`/users/taras`).update({ imageUrl });
                })
                .then(() => {
                    return res.json({ message: "image uploaded successfully" });
                })
                .catch((err) => {
                    console.error(err);
                    return res.status(500).json({ error: "something went wrong" });
                });
        });
        busboy.end(req.rawBody);
    })
}*/



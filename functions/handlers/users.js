const { db } = require('../util/admin')

const config = require('../util/config')

const firebase = require('firebase');
firebase.initializeApp(config)

function isEmpty(value){
    if(value.trim() === '') return true
    else return false
}

function isMaxLength(value, maxLength) {
    if(value.length > maxLength) return true
    return false
}

function isEmailValid(email){
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!email.match(regEx);
}

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    if (!isEmailValid(newUser.email)) return res.status(400).send({error: 'Email is invalid'})
    if (newUser.password !== newUser.confirmPassword) return res.status(400).send({error: 'Passwords do not match'})

    let token, userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).send({handle: "this handle is already taken"});
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
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
                imageUrl: 'https://firebasestorage.googleapis.com/v0/b/type-reacttracks.appspot.com/o/no-img-avatar.jpg?alt=media&token=a4365ea0-77b1-493c-9f08-61a90dbd13f8',
                userId,
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(200).send({token});
        })
        .catch((err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).send({error: "Email is already is use"});
            } else if (err.code === "auth/weak-password") {
                return res.status(400).send({error: "Password is too weak"});
            } else {
                return res
                    .status(500)
                    .send({error: err.code});
            }
        });
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    if (!isEmailValid(user.email)) {
        return res.status(400).json({error: 'Email is invalid'})
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err => {
            console.error(err)
            if (err.code === 'auth/wrong-password') {
                return res.status(400).json({error: 'Wrong password, please try again'})
            }
            if (err.code === 'auth/user-not-found') {
                return res.status(400).json({error: 'User is not found, please try again'})
            } else {
                return res.status(500).json({error: err.code})
            }
        })
}

exports.logout = (req, res) => {
    firebase.auth().signOut().then(() => {
        return res.status(200).json({message: 'logout success'})
    }).catch((err) => {
        return res.status(500).json({error: err.code})
    })
}



// Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = {};

    if (!isEmpty(req.body.bio.trim())) userDetails.bio = req.body.bio;
    if (!isEmpty(req.body.location.trim())) userDetails.location = req.body.location;

    if(!isMaxLength(req.body.bio,150)){
        userDetails.bio = req.body.bio;
    } else {
        return res.status(400).json({error: 'Max length of the biography has to be 150'})
    }

    if(!isMaxLength(req.body.location,30)){
        userDetails.location = req.body.location;
    } else {
        return res.status(400).json({error: 'Max length of the location has to be 30'})
    }

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
                return res.status(400).json({ error: "User not found" });
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
            return res.status(200).json(userData);
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
            return db
                .collection("notifications")
                .where("recipient", "==", req.user.handle)
                .orderBy("createdAt", "desc")
                .limit(10)
                .get();
        })
        .then((data) => {
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
            return res.status(200).json(userData);
        })
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
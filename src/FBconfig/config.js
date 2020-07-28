import firebase from "firebase" 
import 'firebase/storage'

export const app = firebase.initializeApp({
    apiKey: "AIzaSyDPbMMe9DAGTo36ulfKPHfN18XwILSQtLQ",
    authDomain: "social-app-portfolio.firebaseapp.com",
    databaseURL: "https://social-app-portfolio.firebaseio.com",
    projectId: "social-app-portfolio",
    storageBucket: "social-app-portfolio.appspot.com",
    messagingSenderId: "291676968032",
    appId: "1:291676968032:web:20cde625b2e6fcb055df05"
})
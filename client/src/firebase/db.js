import { db } from './firebase';

//User API

export const createUserDB = (id,zipcode) => 
    db.ref(`users/${id}`).set({
        zipcode: zipcode
    });
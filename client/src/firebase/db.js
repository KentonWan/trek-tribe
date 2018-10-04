import { db } from './firebase';

//User API

export const createUserDB = (id,zipcode) => 
    db.ref(`users/${id}`).set({
        zipcode: zipcode
    });

export const createTribeDB = (name, date, time, hike, owner) => 
    db.ref(`tribes`).push({
        name: name,
        date: date,
        time: time,
        hike: hike,
        owner: owner
    });
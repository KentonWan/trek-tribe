import { db } from './firebase';

//User API

export const createUserDB = (id,username,zipcode) => 
    db.ref(`users/${id}`).set({
        username: username,
        zipcode: zipcode
    });

export const createTribeDB = (hikeId, name, date, hike, owner) => 
    db.ref(`tribes/${hikeId}/upcoming/`).push({
        name: name,
        date: date,
        hike: hike,
        owner: owner
    });

export const addToPastTribes = (tribeID,hikeId, name, date, time, hike, owner) => 
    db.ref(`tribes/${hikeId}/past/${tribeID}`).set({
        name: name,
        date: date,
        time: time,
        hike: hike,
        owner: owner
    });

export const addTribeMember = (tribeId,uid) => 
    db.ref(`tribeMembers/${tribeId}`).push({
        uid: uid
    });

export const createTribeChief = (tribeId, uid) => 
    db.ref(`tribeChiefs/${tribeId}`).set({
        uid: uid
    });
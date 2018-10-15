import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { firebase } from '../firebase';


import TrailAPI from '../externalAPIs/trailAPI.js';
import "./HikesList.css";

// import { auth, db } from '../firebase';

class HikesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hikes: [],

        }
    }

    componentDidMount () {
        let userZipcode;
        let trailAPI = new TrailAPI();
        let hikes = [];
        
        firebase.auth.onAuthStateChanged(user => {
            if(!user) {
                window.alert("Please Sign Up or Sign In to see a List of Hikes")
            } else {
            firebase.db.ref('users/' + user.uid + '/zipcode').once('value').then((snapshot) => {
                userZipcode = snapshot.val();

                trailAPI.getByZip(userZipcode).then((results) => {
                    hikes = results.data.trails;
                    this.setState({hikes: hikes});
                })
            });
            }
          });

    }

    render() {
  
        return (

            <div className="container">
            <h1>Treks in Your Area</h1>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="name-header" >Name</th>
                            <th className="distance-header"  >Distance(mi)</th>
                            <th className="location-header" >Location</th>
                            <th className="picture-header"  >Picture</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.hikes.map((hike,index) => 
                            <tr>
                                
                                        <td className="hike-link">
                                            <NavLink to={`/hike/${hike.id}`} key={index} className="hike-link">
                                                {hike.name}                                
                                            </NavLink>
                                        </td>
                                        <td  >{hike.length}</td>
                                        <td >{hike.location}</td>
                                        <td ><img src={hike.imgSmall} alt="small image of hike" /></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}


export default HikesList;
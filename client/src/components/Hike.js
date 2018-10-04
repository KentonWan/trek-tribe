import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import axios from 'axios';
import { firebase } from '../firebase';


import TrailAPI from '../externalAPIs/trailAPI.js';

import Tribes from './Tribes.js';

class Hike extends Component {
    constructor(props){
        super(props);

        this.state = {
            hike: []
        };
    }

    componentDidMount () {
        let userZipcode;
        let trailAPI = new TrailAPI();
        let hikes = [];
        
        firebase.auth.onAuthStateChanged(user => {
            firebase.db.ref('users/' + user.uid + '/zipcode').once('value').then((snapshot) => {
                userZipcode = snapshot.val();
                trailAPI.getByZip(userZipcode).then((results) => {
                    hikes = results.data.trails;
                    const hike = hikes.find(hike => {
                        return hike.id === parseInt(this.props.match.params.id);
                    })
                    this.setState({hike: hike});
                })
            });
          });
    }

    render() {
        return (
            <div className="container">
                <div className="hike-info">
                    <h1>{this.state.hike.name}</h1>
                    <img id="hike-image" src={this.state.hike.imgMedium} />
                    <h3>Distance: {this.state.hike.length} miles</h3>
                    <h3>Ascent: {this.state.hike.ascent} feet</h3>
                    <h3>Location: {this.state.hike.location}</h3>
                    <p>{this.state.hike.summary}</p>
                </div>
                <div className="trek-tribes">
                    <Tribes 
                        hike={this.state.hike.name}
                    />
                </div>
            </div>
        )
    }
}

export default Hike;
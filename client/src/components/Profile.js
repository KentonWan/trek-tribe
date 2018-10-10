import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import axios from 'axios';
import { firebase } from '../firebase';


import TrailAPI from '../externalAPIs/trailAPI.js';

import Tribes from './Tribes.js';

class Profile extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: "",
            username: "",
            zipcode: "",
            updatedZipcode: "",
            tribesAsChiefs: []
        };
    }

    componentDidMount () {
        
        firebase.auth.onAuthStateChanged(user => {

            this.setState({user: user});

            firebase.db.ref('users/' + user.uid).once('value').then((snapshot) => {
                this.setState({username: snapshot.val().username, zipcode: snapshot.val().zipcode})
            });
            
            // searching for all tribes that current user is chief of
            firebase.db.ref('tribeChiefs').once('value').then((snapshot) => {
                let obj = snapshot.val();
    
                let tribesArray = Object.keys(obj).map(i => [i,obj[i]]);

                for(let i = 0; i < tribesArray.length; i ++){
                    
                    if(tribesArray[i][1].uid == user.uid){

                        this.setState({tribesAsChiefs: this.state.tribesAsChiefs.concat(tribesArray[i][0])});

                    }
                }
            });


          });

        //   firebase.db.ref('tribes').once('value').then((snapshot) => {
        //       let tribeArray = Object.values(snapshot.val());

        //       for(let i = 0; i < tribeArray.length; i++){
        //           console.log(Object.values(tribeArray[i]));
        //       }
        //   })

        firebase.db.ref('tribes').orderByChild("name").on("value", snapshot => {
           console.log(snapshot.val());
       });

          
          
    };

    handleZipcodeChange(e){
        e.preventDefault();
        this.setState({updatedZipcode: e.target.value})
    };

    onSubmit = (e) => {

        firebase.db.ref('users/' + this.state.user.uid).update({
            zipcode: this.state.updatedZipcode
        });
        this.setState({zipcode: this.state.updatedZipcode});
        this.setState({updatedZipcode: ''})
        e.preventDefault();

    }


    render() {

        const {updatedZipcode} = this.state;

        return (
            <div className="container">
                <h3>{this.state.username}'s Profile Page</h3>
                <p>Email: {this.state.user.email}</p>
                <p>Zipcode: {this.state.zipcode}</p>
                <form className="zipcodeForm" onSubmit={this.onSubmit}>
                    <div className="form-group row">
                    <div className="col-sm-10">
                            <input
                                value={updatedZipcode}
                                onChange={(e)=> this.handleZipcodeChange(e)}
                                type="text"
                                placeholder="Update Zipcode"
                            />
                            <button type="submit"> Submit</button>
                    </div>
                    </div>
                </form>
                <h5>Tribes I lead:</h5>
                <h5>Tribes I'm a member of:</h5>
            </div>
        )
    }
}

export default Profile;
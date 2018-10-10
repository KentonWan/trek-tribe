import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import axios from 'axios';
import { firebase, db } from '../firebase';



class Tribe extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentUser: '',
            tribe: '',
            chief: '',
            tribeMembers: [],
        };
    }

    componentDidMount() {

        firebase.auth.onAuthStateChanged(user => {
            this.setState({currentUser: user});
        });

        firebase.db.ref('tribes/'+ this.props.match.params.hikeID + '/upcoming/' + this.props.match.params.tribeID).once('value').then((snapshot) => {
            let tribe = snapshot.val();
            console.log(tribe);
            this.setState({tribe: tribe});

            firebase.db.ref('users/'+ tribe.owner).once('value').then((snapshot) => {
                let owner = snapshot.val().username;
                this.setState({chief: owner});
            })
        });

        firebase.db.ref('tribeMembers/' + this.props.match.params.tribeID).on('child_added', snapshot => {
            const tribeMemberUID = snapshot.val().uid;

            firebase.db.ref('users/'+ tribeMemberUID).once('value').then((snapshot)=> {
                const tribeMember = snapshot.val().username;
                this.setState({tribeMembers: this.state.tribeMembers.concat(tribeMember )});

            })
            
        });


    };

    onClick = (e) => {

        db.addTribeMember(this.props.match.params.tribeID, this.state.currentUser.uid).then(() => {
            console.log("added member")
        })
        .catch(error => {
            console.log(error);
        })
        e.preventDefault();
    }

    

    render() {
        return (
            <div className="container">
                <h1>{this.state.tribe.name}</h1>
                <div className="tribe-info">
                    <h4><strong>Hike:</strong> {this.state.tribe.hike}</h4>
                    <h6><strong>Date:</strong> {this.state.tribe.date}</h6>
                    <h6><strong>Time:</strong> {this.state.tribe.time}</h6>
                    <h6><strong>Tribe Chief:</strong> {this.state.chief}</h6>
                    <h6><strong>Tribe Members:</strong></h6>
                        <ul className="tribe-members">
                        {
                            this.state.tribeMembers.map((member,index) =>
                                    <li key={index}>{member}</li>
                            )
                        }
                        </ul>
                    {
                        this.state.currentUser.uid === this.state.tribe.owner ? null : 
                        <button type="button" className="btn btn-success" onClick={this.onClick}>Join Tribe</button>
                    }
                </div>
            </div>
        )
    }
}

export default Tribe;
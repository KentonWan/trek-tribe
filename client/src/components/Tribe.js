import React, { Component } from 'react';
import { firebase, db } from '../firebase';



class Tribe extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentUser: '',
            tribe: '',
            chief: '',
            tribeMembers: [],
            isMember: ''
        };
    }

   listTribeMembers = () => {
        firebase.db.ref('tribeMembers/' + this.props.match.params.tribeID).on('child_added', snapshot => {
        const tribeMemberUID = snapshot.val().uid;

        if(tribeMemberUID === this.state.currentUser.uid){
            this.setState({isMember: true});
        };

        firebase.db.ref('users/'+ tribeMemberUID).once('value').then((snapshot)=> {
            const tribeMember = snapshot.val().username;
            this.setState({tribeMembers: this.state.tribeMembers.concat(tribeMember )});

            })  
        })
    };

    componentDidMount() {

        firebase.auth.onAuthStateChanged(user => {
            this.setState({currentUser: user});
        });

        firebase.db.ref('tribes/'+ this.props.match.params.hikeID + '/upcoming/' + this.props.match.params.tribeID).once('value').then((snapshot) => {
            let tribe = snapshot.val();
            console.log(tribe);
            this.setState({tribe: tribe});

            // setting chief to owner
            firebase.db.ref('users/'+ tribe.owner).once('value').then((snapshot) => {
                let owner = snapshot.val().username;
                this.setState({chief: owner});
            })
        });

        // Populating list of tribe members
        this.listTribeMembers();


    };

    onClick = (e) => {

        db.addTribeMember(this.props.match.params.tribeID, this.state.currentUser.uid).then(() => {
            console.log("added member")
            this.setState({isMember: true});
        })
        .catch(error => {
            console.log(error);
        })
        e.preventDefault();
    };

    onDelete = (e) => {
        
        
        firebase.db.ref('tribeMembers/'+ this.props.match.params.tribeID).orderByChild('uid').equalTo(this.state.currentUser.uid).on("child_added", snapshot => {
            let userKey = snapshot.key;

            firebase.db.ref('users/' + this.state.currentUser.uid).once('value').then(snapshot => {

                let updatedTribeMembers = this.state.tribeMembers.filter(name => name !== snapshot.val().username); // deleting username from tribe members stored in state
                this.setState({tribeMembers: updatedTribeMembers});
                this.setState({isMember: false});
            })
            //deleting user as tribe member from firebase
            firebase.db.ref('tribeMembers/' + this.props.match.params.tribeID + '/' + userKey).remove();

        });
        
        e.preventDefault();

    };

    

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
                        this.state.currentUser.uid === this.state.tribe.owner || this.state.isMember ? null : 
                        <button type="button" className="btn btn-success" onClick={this.onClick}>Join Tribe</button>
                    }
                    {
                        this.state.isMember ? 
                        <button type="button" className="btn btn-danger" onClick={this.onDelete}>Leave Tribe</button>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Tribe;
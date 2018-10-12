import React, { Component } from 'react';
import { firebase } from '../firebase';


class Profile extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: "",
            username: "",
            zipcode: "",
            updatedZipcode: "",
            tribesLeading: [],
            tribesMember: []
        };
    }

    componentDidMount () {
        
        firebase.auth.onAuthStateChanged(user => {

            this.setState({user: user});

            firebase.db.ref('users/' + user.uid).once('value').then((snapshot) => {
                this.setState({username: snapshot.val().username, zipcode: snapshot.val().zipcode})
            });
            
            // searching for all tribes that current user is/was chief of to list out
            firebase.db.ref('tribeChiefs').orderByChild('uid').equalTo(user.uid).on('child_added', snapshot => {
                let tribeID = snapshot.key;

                firebase.db.ref('tribeNames/'+ tribeID).once('value').then(snapshot => {
                    let tribeName = snapshot.val().name;
                    this.setState({tribesLeading: this.state.tribesLeading.concat(tribeName)})
                })
                
            });


          // generate list of tribes current user is/has been a member of 
          firebase.db.ref('tribeMembers').once('value').then((snapshot) => {
              let tribesArray = Object.keys(snapshot.val()); //generate list of all tribes with members

              for (let i = 0; i < tribesArray.length; i++)   {
                    //sort through all those tribes and query to see if current user id is a child
                    firebase.db.ref('tribeMembers/'+ tribesArray[i]).orderByChild('uid').equalTo(user.uid).on('child_added', snapshot => {                        
                        
                        //convert tribeID to tribe name
                        firebase.db.ref('tribeNames/'+ tribesArray[i]).once('value').then((snapshot)=> {
                            let tribeName = snapshot.val().name;
                            this.setState({tribesMember: this.state.tribesMember.concat(tribeName)});
                        })
                    })
                    
                }                     
             })
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
            (!this.state.user) ? null :
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
                <h5>Tribes I'm Leading:</h5>
                    <ul className="tribes-leading">
                        {
                            this.state.tribesLeading.map((tribe,index) =>
                                    <li key={index}>{tribe}</li>
                            )
                        }
                    </ul>
                <h5>Tribes I'm a member of:</h5>
                    <ul className="tribes-member">
                        {
                            this.state.tribesMember.map((tribe,index) =>
                                    <li key={index}>{tribe}</li>
                            )
                        }
                    </ul>
            </div>
        )
    }
}

export default Profile;
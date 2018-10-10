import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import { auth, db } from '../firebase';

// import axios from 'axios';
import { firebase } from '../firebase';

import Tribe from './Tribe.js';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    tribeName: '',
    dateTime: '',
    error: null
};


class Tribes extends Component {
    constructor(props) {
      super(props);

        this.state = {
            tribes: [],
            user: '',
            tribeName: '',
            dateTime: '',
            error: null
        };

    }


    componentDidMount() {

        firebase.auth.onAuthStateChanged(user => {
            if(user){
                this.setState({user: user});
            } else {
                console.log("please sign in");
            }
        });

        firebase.db.ref('tribes/' + this.props.hike.id + '/upcoming/').on('child_added', snapshot => {
            const tribe = snapshot.val();
            tribe.key = snapshot.key;

            let currentDate = new Date();

            let tribeDate = new Date(tribe.date)

            if(tribeDate.getTime() < currentDate.getTime()){

                db.addToPastTribes(tribe.key, this.props.hike.id, tribe.name, tribe.date, tribe.time, tribe.hike, tribe.owner)
                .then(()=> {
                    console.log("added to past tribes")
                })
                .catch((err)=> {
                    console.log(err);
                });
                firebase.db.ref('tribes/' + this.props.hike.id + '/upcoming/' + tribe.key).remove();

            } else {
                this.setState({tribes: this.state.tribes.concat(tribe )});
            }

            
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const {
            tribeName,
            dateTime,
        } = this.state;


        db.createTribeDB(this.props.hike.id,tribeName,dateTime,this.props.hike.name, this.state.user.uid)
        .then((res)=> {
            let tribeID = res.path.pieces_[3];
            db.createTribeChief(tribeID, this.state.user.uid).then(()=> console.log("chief created")).catch(error => console.log(error));
            
            this.setState({...INITIAL_STATE});
            console.log("started a tribe");
        })
        .catch(error => {
            this.setState(byPropKey('error', error));
        });

    };

    handleTribeNameChange(e){
        e.preventDefault();
        this.setState(byPropKey('tribeName', e.target.value));
    }; 
    
    handleDateTimeChange(e){
        e.preventDefault();
        this.setState(byPropKey('dateTime', e.target.value));
    }; 
    
    // handleTimeChange(e){
    //     e.preventDefault();
    //     this.setState(byPropKey('time', e.target.value));
    // };




    render() {

        const {
            tribeName,
            dateTime,
            error
        } = this.state;

        return (
            <div className="container">
                <h4>Find Tribes for this Trek:</h4>
                <div className="tribes">
                    <ul className="tribe-list">
                    {
                        this.state.tribes.map((tribe,index) =>
                            <Link to={`/hike/${this.props.hike.id}/tribes/${tribe.key}`} key={index} className="tribe-link">
                                <li value={tribe.key}>Tribe: {tribe.name}  Date: {tribe.date}</li>
                            </Link>
                        )
                    }
                    </ul>
                </div>

                <form className="tribeForm" onSubmit={this.onSubmit}>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <input
                                value={tribeName}
                                onChange={(e)=> this.handleTribeNameChange(e)}
                                type="text"
                                placeholder="Tribe Name"
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                    <div className="col-sm-10" date-date-start-date="+1d">
                            <input
                                value= {dateTime}
                                onChange={(e)=> this.handleDateTimeChange(e)}
                                type="datetime-local"
                            />
                        </div>
                    </div>
                    {/* <div className="form-group row">
                    <div className="col-sm-10">
                            <input
                                value={time}
                                onChange={(e)=> this.handleTimeChange(e)}
                                type="time"
                                placeholder="13:00:00"
                            />
                        </div>
                    </div> */}
                    <button type="submit"> Start Tribe</button>
                    {error && <p>{error.message}</p>}
                
                </form>

            </div>
        )
    }
}

export default Tribes;
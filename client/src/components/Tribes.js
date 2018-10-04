import React, { Component } from 'react';
import { Link, Router } from 'react-router-dom';
import { auth, db } from '../firebase';

// import axios from 'axios';
import { firebase } from '../firebase';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    tribeName: '',
    date: '',
    time: '',
    error: null
};


class Tribes extends Component {
    constructor(props){

        firebase.db.ref('tribes').on('child_added', snapshot => {
            const tribe = snapshot.val();
            tribe.key = snapshot.key;
            console.log(tribe);
            if(tribe.hike == this.props.hike){
                this.setState({tribes: this.state.tribes.concat(tribe )});
            }
        });

        super(props);
        this.state = {
            tribes: [],
            user: '',
            tribeName: '',
            date: '',
            time: '',
            error: null
        }

    };


    componentDidMount() {

        console.log(this.state.tribes);

        firebase.auth.onAuthStateChanged(user => {
            if(user){
                this.setState({user: user});
            } else {
                console.log("please sign in");
            }
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const {
            tribeName,
            date,
            time,
        } = this.state;

        db.createTribeDB(tribeName,date,time,this.props.hike, this.state.user.uid)
        .then(()=> {
            this.setState({...INITIAL_STATE});
            console.log("started a tribe");
        })
        .catch(error => {
            this.setState(byPropKey('error', error));
        })
    };

    handleTribeNameChange(e){
        e.preventDefault();
        this.setState(byPropKey('tribeName', e.target.value));
    }; 
    
    handleDateChange(e){
        e.preventDefault();
        this.setState(byPropKey('date', e.target.value));
    }; 
    
    handleTimeChange(e){
        e.preventDefault();
        this.setState(byPropKey('time', e.target.value));
    };




    render() {

        const {
            tribeName,
            date,
            time,
            error
        } = this.state;

        return (
            <div className="container">
                <h4>Find Tribes for this Trek:</h4>
                <div className="tribes">
                    <ul className="tribe-list">
                    {
                        this.state.tribes.map((tribe,index) =>
                            <li key={index} value={tribe.key}>Tribe: {tribe.name}  Date: {tribe.date}</li>
                        )
                    }
                    </ul>
                </div>

                <form className="tribeForm" onSubmit={this.onSubmit}>
                    <div class="form-group row">
                        <div class="col-sm-10">
                            <input
                                value={tribeName}
                                onChange={(e)=> this.handleTribeNameChange(e)}
                                type="text"
                                placeholder="Tribe Name"
                            />
                        </div>
                    </div>
                    <div class="form-group row">
                    <div class="col-sm-10">
                            <input
                                value= {date}
                                onChange={(e)=> this.handleDateChange(e)}
                                type="date"
                            />
                        </div>
                    </div>
                    <div class="form-group row">
                    <div class="col-sm-10">
                            <input
                                value={time}
                                onChange={(e)=> this.handleTimeChange(e)}
                                type="time"
                                placeholder="13:00:00"
                            />
                        </div>
                    </div>
                    <button type="submit"> Start Tribe</button>
                    {error && <p>{error.message}</p>}
                
                </form>

            </div>
        )
    }
}

export default Tribes;
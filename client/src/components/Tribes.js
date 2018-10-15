import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

import { firebase } from '../firebase';

import './Tribes.css';


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

    this.ref = firebase.db.ref('tribes/' + this.props.hike.id + '/upcoming/');
    }


    componentDidMount() {


        firebase.auth.onAuthStateChanged(user => {
            if(user){
                this.setState({user: user});
            } else {
                console.log("please sign in");
            }
        });

        this.ref.on('child_added', snapshot => {
            const tribe = snapshot.val();
            tribe.key = snapshot.key;

            let currentDate = new Date();

            let tribeDate = new Date(tribe.date)
            
            // if tribe date already passed it will push it to past branch and delete it from upcoming branch
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
                this.setState(prevState => ({
                    tribes: [...prevState.tribes, tribe]
                  }))            
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
            db.addTribeName(tribeID,tribeName).then(()=> console.log("tribe name added")).catch(error => console.log(error))
            
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
        let date = e.target.value;

        this.setState(byPropKey('dateTime', date));
    }; 
    
    // handleTimeChange(e){
    //     e.preventDefault();
    //     this.setState(byPropKey('time', e.target.value));
    // };




    render() {

        console.log(this.state.tribes);

        // const tribeName dateTime, error

        return (
            <div className="container">
                <h4 className="tribes-header">Upcoming Trek Tribes:</h4>
                <div className="tribes">
                    {
                        this.state.tribes.map((tribe,index) =>
                            <p value={tribe.key} key={index}>
                                <Link to={`/hike/${this.props.hike.id}/tribes/${tribe.key}`} className="tribe-link">
                                    {tribe.name}
                                </Link>
                            </p>
                        )
                    }
                </div>
                
                <form className="tribeForm" onSubmit={this.onSubmit}>
                    <p><strong>Start Your Own Trek Tribe:</strong></p>
                    <div className="form-row">
                        <div className="form-group col-md-6 offset-md-3">
                            <input
                                // value={tribeName}
                                onChange={(e)=> this.handleTribeNameChange(e)}
                                type="text"
                                placeholder="New Tribe Name"
                                className="tribe-name"
                            />
                        </div>
                        
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6 offset-md-3">
                            <input
                                // value= {dateTime}
                                onChange={(e)=> this.handleDateTimeChange(e)}
                                type="datetime-local"
                                data-date-start-date="+1d"
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
                    <button type="submit" className="btn btn-success"> Start Tribe</button>
                    {/* {error && <p>{error.message}</p>} */}
                
                </form>

            </div>
        )
    }
}

export default Tribes;
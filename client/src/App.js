import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import { firebase } from './firebase';

import Landing from './components/Landing.js';
import SignUp from './components/SignUp.js';
import SignIn from './components/SignIn.js';
import Navigation from './components/Navigation.js';
import HikesList from './components/HikesList.js';
import Hike from './components/Hike.js';
import Profile from './components/Profile.js';
import Tribe from './components/Tribe.js';






class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      response: '',
      user: null,
      userId: null,

    };
  }
 
  componentDidMount() {

    firebase.auth.onAuthStateChanged(user => {
      user ? this.setState({ user: user, userId: user.uid})
      : this.setState({ user: null, userId: null});
    })

    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  setUser(currentUser){
    this.setState({user: currentUser});
    console.log(currentUser);
  }

  render() {
    return (
      <div className="App">
        <Navigation user={this.state.user} />
        
        <div className="main-container">
          <Route exact path="/" component={ Landing } />
          <Route path="/SignUp" component= { SignUp } />
          <Route path="/SignIn" component = { SignIn } />
          <Route path="/HikesList" component = { HikesList } />
          <Route path="/Profile" component = { Profile } />
          <Route exact path="/hike/:id" component = { Hike } />
          <Route exact path="/hike/:hikeID/tribes/:tribeID" component = { Tribe } />
        </div>


        <p className="App-intro">
          {this.state.response}
        </p>
      </div>
    );
  }
}

export default App;

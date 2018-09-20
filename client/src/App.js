import React, { Component } from 'react';
import { Route,Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing.js';
import SignUp from './components/SignUp.js';
import SignIn from './components/SignIn.js';
import SignOut from './components/SignOut.js';
import Navigation from './components/Navigation.js';
import { firebase } from './firebase';




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
        </div>


        <p className="App-intro">
          {this.state.response}
        </p>
      </div>
    );
  }
}

export default App;

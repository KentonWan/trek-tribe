import React, { Component } from 'react';
import { Route,Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing.js';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
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
  render() {
    return (
      <div className="App">
          <nav className="navbar navbar-expand-md fixed-top">
            <div className="container text-center">
              <img src={require('./trek_tribe_logo.png')} width="100" alt="logo" className="logo" />
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarResponsive">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="link" to='/hikes'>Explore</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="link" to='/signUp'>Sign Up</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        
        <div className="main-container">
          <Route exact path="/" component={ Landing } />
        </div>


        <p className="App-intro">
          {this.state.response}
        </p>
      </div>
    );
  }
}

export default App;

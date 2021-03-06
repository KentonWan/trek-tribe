import React from 'react';
import { Route, Link } from 'react-router-dom';

import SignOut from './SignOut';
import Landing from './Landing';
import SignUp from './SignUp';
import SignIn from './SignIn';
import HikesList from './HikesList';
import './Navigation.css';


const Navigation = ({ user }) => 
    <nav className="navbar navbar-expand-md fixed-top">
        <div className="container text-center">
            <Link className="link" to="/"><img src={require('./trek_tribe_logo.png')} width="100" alt="logo" className="logo" /></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div>
                { user ? <NavigationAuth /> : <NavigationNonAuth /> }
            </div>
        </div>
    </nav>

const NavigationAuth = () => 
    <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="link" to='/Profile'>Profile</Link>
            </li>
            <li className="nav-item">
                <Link className="link" to='/HikesList'>Explore</Link>
            </li>
            <li className="nav-item">
                <SignOut />
            </li>
        </ul>
    </div>

const NavigationNonAuth = () => 
<div className="collapse navbar-collapse" id="navbarResponsive">
    <ul className="navbar-nav ml-auto">
        <li className="nav-item">
            <Link className="link" to='/HikesList'>Explore</Link>
        </li>
        <li className="nav-item">
            <Link className="link" to='/SignUp'>Sign Up</Link>
        </li>
        <li className="nav-item">
            <Link className="link" to='/SignIn'>Sign In</Link>
        </li>
    </ul>
</div>

export default Navigation;
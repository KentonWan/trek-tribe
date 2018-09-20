import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { SignUpLink } from "./SignUp";
import { auth } from "../firebase";


const SignIn = ({history}) => 
    <div>
        <h2>Please Sign In</h2>
        <SignInForm history={history} />
        <SignUpLink />
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null

        }
    }

    onSubmit = (e) => {
        const {
            email,
            password
        } = this.state;

        const { history } = this.props;

        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            this.setState({...INITIAL_STATE});
            history.push("/")

        })
        .catch(error => {
            this.setState(byPropKey('error', error))
        });
        e.preventDefault();
    };

    handleEmailChange(e){
        e.preventDefault();
        this.setState(byPropKey('email', e.target.value))
    };

    handlePasswordChange(e){
        e.preventDefault();
        this.setState(byPropKey('password', e.target.value))
    };

    render() {
        const {
            email,
            password,
            error
        } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <div className="container col-md-4 col-md-offset-4">
                <form className="signInForm" onSubmit={this.onSubmit}>
                    <div class="form-group row">
                        <div class="col-sm-10">
                            <input
                                value={email}
                                onChange={(e)=> this.handleEmailChange(e)}
                                type="text"
                                placeholder="Email Address"
                            />
                        </div>
                    </div>
                    <div class="form-group row">
                    <div class="col-sm-10">
                            <input
                                value={password}
                                onChange={(e)=> this.handlePasswordChange(e)}
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <button disabled={isInvalid} type="submit"> Sign In</button>
                    {error && <p>{error.message}</p>}
                
                </form>
            </div>
        )
    }
}

export default withRouter(SignIn);

export {
    SignInForm,
}
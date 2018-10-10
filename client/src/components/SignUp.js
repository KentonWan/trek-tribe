import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth, db } from '../firebase';

const SignUpPage = ({history}) => 
    <div>
        <h1>Join Now & Start Trekking</h1>
        <SignUpForm history={history} />
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    username: '',
    email: '',
    zipcode: '',
    password: '',
    error: null,
};

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            zipcode:'',
            error: null

        }
    }

    onSubmit = (e) => {
        const {
            username,
            email,
            zipcode,
            password
        } = this.state;

        const { history } = this.props;

        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            authUser.displayName = this.state.username;
            console.log(authUser);
            db.createUserDB(authUser.user.uid, authUser.displayName, zipcode)
            .then(() => {
                this.setState({...INITIAL_STATE});
                history.push("/");
                window.alert("You have successfully joined! Join a tribe and start exploring!");
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });
        })
        .catch(error => {
            this.setState(byPropKey('error', error))
        });
        e.preventDefault();
    };

    handleUsernameChange(e){
        e.preventDefault();
        this.setState(byPropKey('username', e.target.value))
    };

    handleEmailChange(e){
        e.preventDefault();
        this.setState(byPropKey('email', e.target.value))
    };

    handleZipcodeChange(e){
        e.preventDefault();
        this.setState(byPropKey('zipcode', e.target.value))
    };

    handlePasswordChange(e){
        e.preventDefault();
        this.setState(byPropKey('password', e.target.value))
    };

    render() {
        const {
            username,
            email,
            zipcode,
            password,
            error
        } = this.state;

        return (
            <div className="container col-md-4 col-md-offset-4">
                <form className="signUpForm" onSubmit={this.onSubmit}>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <input
                                value={username}
                                onChange={(e)=> this.handleUsernameChange(e)}
                                type="text"
                                placeholder="Full Name"
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <input
                                value={email}
                                onChange={(e)=> this.handleEmailChange(e)}
                                type="text"
                                placeholder="Email Address"
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <input
                                value={zipcode}
                                onChange={(e)=> this.handleZipcodeChange(e)}
                                type="integer"
                                placeholder="Zipcode"
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                    <div className="col-sm-10">
                            <input
                                value={password}
                                onChange={(e)=> this.handlePasswordChange(e)}
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <button type="submit"> Sign Up</button>
                    {error && <p>{error.message}</p>}
                
                </form>
            </div>
        )
    }
}

const SignUpLink = () => 
    <p>
        Don't have an account?
        {' '}
        <Link to="/SignUp">Sign Up</Link>
    </p>

export default withRouter(SignUpPage);

export {
    SignUpForm,
    SignUpLink
}
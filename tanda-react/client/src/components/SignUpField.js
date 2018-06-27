import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

class SignUpField extends React.Component {
    state = {
        email: '',
        password: '',
        name: '',
    };

    onEmailChange  = (event) => {
        this.setState({
            email: event.target.value,
        })
    };

    onPasswordChange = (event) => {
        event.preventDefault();
        this.setState({
            password: event.target.value,
        })
    };

    onNameChange = (event) => {
        event.preventDefault();
        this.setState({
            name: event.target.value,
        })
    };

    onSubmit = () => {
        axios.post(
            'http://social.workshops.tanda.co/users',
            {
                email: this.state.email,
                name: this.state.name,
                password: this.state.password
            }
        ).then((res) => {
            console.log(res);
        }).catch((e) => {
            console.log(e);
            console.log('sign up failed');
        });
    };

    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <input onChange={this.onEmailChange}
                       value={this.state.email}
                       placeholder='Email'/>
                <br />
                <input onChange={this.onNameChange}
                       value={this.state.name}
                       placeholder='Name'/>
                <br />
                <input onChange={this.onPasswordChange}
                       value={this.state.password}
                       type='password'
                       placeholder='password'/>
                <br />
                <button onClick={this.onSubmit}>Submit</button>
            </div>
        )
    };
}

export default SignUpField
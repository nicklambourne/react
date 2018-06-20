import React from 'react';
import axios from 'axios';

class LoginField extends React.Component {
    state = {
        email: '',
        password: '',
        token: null
    };

    onEmailChange  = (event) => {
        this.setState({
            email: event.target.value,
        })
    };

    onPasswordChange = (event) => {
        event.preventDefault()
        this.setState({
            password: event.target.value
        })
    };

    onSubmit = () => {
        axios.post(
            'http://social.workshops.tanda.co/login',
            {
                email: this.state.email,
                password: this.state.password
            }
        ).then((res) => {
            this.setState({
                token: res.data.token
            });
            console.log(this.state.token)
        }).catch((e) => {
            console.log('login failed');
        });
    };

    render() {
        return (
            <div>
                <h1>Login</h1>
                <input onChange={this.onEmailChange} value={this.state.email}/>
                <br />
                <input onChange={this.onPasswordChange} value={this.state.password} type='password'/>
                <br />
                <button onClick={this.onSubmit}>Submit</button>
            </div>
        )
    };
}

export default LoginField
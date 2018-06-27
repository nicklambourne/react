import React from 'react';
import {Switch, Route} from 'react-router-dom';
import LoginField from './LoginField';
import SignUpField from './SignUpField';
import HomePage from './HomePage';


class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={HomePage}/>
                <Route path='/login' component={LoginField}/>
                <Route path='/signup' component={SignUpField}/>
            </Switch>
        )
    }
}

export default App;

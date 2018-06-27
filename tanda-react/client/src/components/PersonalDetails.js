import React from 'react';


class PersonalDetails extends React.Component {
    state = {firstName: '',
             lastName: ''}

    updateFirstName = (e) => {
        this.setState({firstName: e.target.value});
    };

    updateLateName = (e) => {
        this.setState({lastName: e.target.value});
    };

    render() {
        const fullName = `${this.state.firstName} ${this.state.lastName}`;
        const childProps = {
            ...this.state,
            fullName,
            updateFirstName,
            updateLastName,
        };
        this.props.children(childProps);
    }
}

export default PersonalDetails;
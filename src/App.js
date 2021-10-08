import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ChatRoom } from './components/Chatroom';
import { Login } from './components/Login';

const ENDPOINT = "chatroom-backend-team4-chatroom-backend.itzroks-100000kr1k-c03bri-6ccd7f378ae819553d37d5f2ee142bd6-0000.us-east.containers.appdomain.cloud"

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.server = new WebSocket(`wss://${ENDPOINT}`);
        this.state = {
            loggedUsername: null
        }
    }

    loggedinAs(username) {
        this.setState({
            loggedUsername: username
        });
    }

    render() {
        return (
            <div className="wrapper">
                <h1 className="title">Chatroom App</h1>
                <BrowserRouter>
                    <Switch>
                        <Route path="/chatroom">
                            <ChatRoom server={this.server} username={this.state.loggedUsername} />
                        </Route>
                        <Route path="/">
                            <Login server={this.server} loggedinAs={(username) => this.loggedinAs(username)}/>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}


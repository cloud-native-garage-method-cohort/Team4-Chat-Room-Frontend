import React from 'react';
import './Login.css'

import * as proto from '../chatproto/proto'
import { Redirect } from 'react-router';

export class Login extends React.Component {
    constructor(props) {
        super(props)
        this.username = null;
        this.state = {
            logged : false,
            error : null
        };
    }

    connect() {
        if(!this.username) return;

        let server = this.props.server;
        proto.sendMessage(server, new proto.ConnectMessage(this.username));
        server.onmessage = ({data}) => {
            let connectMsg = proto.parseMessage(data);

            switch(connectMsg.status) {
            case proto.Status.CONNECT_OK:
                this.props.onLogin(this.username);
                this.setState({
                    logged : true,
                });
                break;
            default:
                this.setState({
                    error : connectMsg.status
                });
                break;
            }
        }
    }

    updateUsername(username) {
        this.username = username;
    }

    render() {
        if(this.state.logged) {
            return <Redirect to="/chatroom" />
        }

        let error;
        if(this.state.error) {
            error = (<h2>{this.state.error}</h2>);
        }

        return (
            <div className="login-wrapper">
                {error}
                <h2>Enter a Username</h2>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => this.updateUsername(e.target.value.trim())}/>
                </label>
                <div>
                    <button onClick={() => this.connect()}>Submit</button>
                </div>
            </div>
        );
    }
}
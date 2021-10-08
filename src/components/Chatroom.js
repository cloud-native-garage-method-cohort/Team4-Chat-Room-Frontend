import React from 'react';
import { Redirect } from 'react-router';
import './Chatroom.css'

import * as proto from '../chatroom/proto'

export class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.message = "";
        this.state = {
            messages : [],
            inputText : ""
        };

        this.props.server.onmessage = ({data}) => {
            let message = proto.parseMessage(data);
            this.appendMessage(message);
        }
    }

    appendMessage(chatMessage) {
        let newMessages = this.state.messages.concat(chatMessage);
        this.setState({
            messages: newMessages
        });
    }

    updatedInputText(text) {
        this.setState({
            inputText : text
        });
    }

    sendMessage() {
        let chatMessage = new proto.ChatMessage(this.props.username, this.state.inputText);
        this.updatedInputText("");
        this.appendMessage(chatMessage);
        proto.sendMessage(this.props.server, chatMessage);
    }

    render() {
        if (!this.props.username) {
            return <Redirect to="/"/>
        }

        return (
            <div className="chatroom-wrapper">
                <h2>Logged as: {this.props.username}</h2>
                
                <div className="input-wrapper">
                    <pre className="messages">
                        {this.state.messages.map((chatMessage, idx) => (
                            <h2 key={`message ${idx}`}>
                                {chatMessage.name + ": " + chatMessage.message}
                            </h2>
                        ))}
                    </pre>

                    <input type="text" value={this.state.inputText} className="input-text" 
                        placeholder="Type your message here"
                        onChange={e => this.updatedInputText(e.target.value)} />

                    <button className="send-button" title="Send Message!"
                        onClick={e => this.sendMessage(e.target.value)}>
                        Send Message
                    </button>
                </div>
            </div>
        );
    }
}
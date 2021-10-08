import React from 'react';
import { Redirect } from 'react-router';
import './Chatroom.css'

import * as proto from '../chatproto/proto'

export class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.message = "";
        this.state = {
            messages : [],
            clients : [],
            inputText : ""
        };

        this.props.server.onmessage = ({data}) => {
            this.handleMessage(data);
        }
    }
    
    handleMessage(data) {
        let message = proto.parseMessage(data);
        switch(message.type) {
        case proto.MessageType.MESSAGE_DATA:
            this.appendChatMessage(message);
            break;
        case proto.MessageType.CLIENT_LIST:
            this.updateClients(message.clients);
            break;
        default:
            console.assert(false, `Received message ${message.type} while in chatroom.`);
        }
    }

    appendChatMessage(chatMessage) {
        let newMessages = this.state.messages.concat(chatMessage);
        this.setState({
            messages: newMessages
        });
    }

    updateClients(clients) {
        this.setState({
            clients : clients
        });
    }

    updatedInputText(text) {
        this.setState({
            inputText : text
        });
    }

    sendChatMessage() {
        let chatMessage = new proto.ChatMessage(this.props.username, this.state.inputText);
        this.updatedInputText("");
        this.appendChatMessage(chatMessage);
        proto.sendMessage(this.props.server, chatMessage);
    }

    loggedIn() {
        return this.props.username != null; // Yeah...
    }

    render() {
        if (!this.loggedIn()) {
            return <Redirect to="/"/>
        }

        console.log(this.state.clients);

        return (
            <div className="chatroom-wrapper">
                <h2>Hi {this.props.username}</h2>

                <div className="input-wrapper">

                {/* <tr><td>LIST</td><td>MESSAGE</td></tr>
<tr><td colspan="2" >TEXTINPUT</td></tr>
</table> */}
                    <table className="main-table">
                        <tr> 
                            <td className="messages-pane">
                                <div className="messages">
                                    {this.state.messages.map((chatMessage, idx) => (
                                        <h2 key={`message ${idx}`}>
                                            {chatMessage.name + ": " + chatMessage.message}
                                        </h2>
                                    ))}
                                </div>
                            </td>
                            <td className="client-list-pane">
                                <div className="user-list">
                                    {this.state.clients.map(client => (
                                        <h2 key={client}>{client}</h2>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    </table>

                    <input type="text" value={this.state.inputText} className="input-text" 
                        placeholder="Type your message here"
                        onChange={e => this.updatedInputText(e.target.value)} />

                    <button className="send-button" title="Send Message!"
                        onClick={e => this.sendChatMessage(e.target.value)}>
                        Send Message
                    </button>
                </div>
            </div>
        );
    }
}
import React, {Component} from 'react';

class Message extends Component {
  render() {
    let messageList; //is an array
    messageList = this.props.parentStates.messageList.map((msg)=>{
      if(msg.type==='incomingMessage'){
        return(
          <div className="message" key ={msg.id}>
            <span className="message-username">{msg.username}</span>
            <span className="message-content">{msg.content}</span>
          </div>
        )
      }else if (msg.type==='incomingNotification') {
        return(
          <div className="message system" key ={msg.id}>
            {msg.previoususer} changed name to {msg.currentusername}
          </div>
          )
        }else{
          return(<div></div>)
        }
    })
    return (
      <div>
      {messageList}
      </div>
      );
    }
  }
export default Message;

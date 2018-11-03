import React, {Component} from 'react';

class ChatBar extends Component {
  render() {

    return (
      <div className="chatbar">
        <input onKeyUp={this.props.tx.newMessageHandler} onChange={this.props.tx.inputHandler} name = 'username'className="chatbar-username" value={this.props.parentStates.currentUser} placeholder='Your Name (Optional)' />
        <input onKeyUp={this.props.tx.newMessageHandler} onChange={this.props.tx.inputHandler} name = 'content'className="chatbar-message" value={this.props.parentStates.currentContent} placeholder='Type a message and hit ENTER' />
      </div>
    );
  }
}
export default ChatBar;


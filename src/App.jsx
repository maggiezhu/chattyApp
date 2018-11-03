import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';


function getMessages() {
  return new Promise(resolve => {
    setTimeout(resolve, 500);
  }).then(() => {
    return true;
  });
}

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:true,
      currentUser: '',
      currentContent:'',
      messageList: [],
      previousUser:'',
      numClient:1
    };
    this.tx={};
  }

  componentDidMount(){
    // Initiate WS client connection and store in state
    this.socket= new WebSocket("ws://localhost:3001");
    this.socket.onopen = function() {
    };
    this.socket.onmessage = (event) => {
      //get number of clients connected
      if(JSON.parse(event.data).type==='ClientNumber'){
        this.setState({numClient:JSON.parse(event.data).clientNum});
        console.log('in if type is client number',this.state.messageList);
      }else{
      // handle incoming messages from server
      // Add to this.state.messageList to be rendered.
      const messages = this.state.messageList.concat(JSON.parse(event.data));
      //reset the input field placeholder
      this.setState({messageList: messages});
      this.setState({currentContent:''});
      this.setState({numClient:JSON.parse(event.data).clientNum});
      console.log('in else, type is message',this.state.messageList);
      }
    };

    getMessages().then(()=>{this.setState({loading:false})});
    //Receive user input for ever input change, name and content
    const inputHandler=(event)=>{

      if(event.target.name==='username'){
        this.setState({currentUser:event.target.value});
        }else{
          this.setState({currentContent:event.target.value});
        }
    };
    // Change state variable on Enter key press, based on input
    const newMessageHandler=(event)=>{
      if(event.key === 'Enter'){
        //make a new message obj and push into messageList
        let newMessage;
        if(this.state.currentUser===''){
          //put anonymous if user did't input name
          newMessage={type:'incomingMessage',username:'Anonymous',content:this.state.currentContent};
          this.socket.send(JSON.stringify(newMessage));
        }else{
          //if the username is changed
          if(this.state.currentUser!== this.state.previousUser){
            //if no input content
            if(this.state.currentContent===''){
              //send notification
              newMessage = {type:'incomingNotification',previoususer:this.state.previousUser,currentuser:this.state.currentUser}
              this.socket.send(JSON.stringify(newMessage));
            }else{
              //send notification and new message
              newMessage = {type:'incomingNotification',previoususer:this.state.previousUser,currentuser:this.state.currentUser}
              this.socket.send(JSON.stringify(newMessage));
              newMessage = {type:'incomingMessage',username:this.state.currentUser,content:this.state.currentContent}
              this.socket.send(JSON.stringify(newMessage));
            }
        }else{
          //username stays the same, send new message
          newMessage = {type:'incomingMessage',username:this.state.currentUser,content:this.state.currentContent};
          this.socket.send(JSON.stringify(newMessage));
        }
      }
      //store username before change
      this.setState({previousUser:this.state.currentUser});
    }
  };
  this.tx.inputHandler=inputHandler;
  this.tx.newMessageHandler=newMessageHandler;
}

  render(){
    let MessageDiv = this.state.loading? (<p>Loading Messages...</p>) : (
        <div className ='messages'>
          <Message className='message' parentStates={this.state}/>
        </div>
      );
    let NumClient=this.state.numClient;
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <p className='navbar-clientNum'> {NumClient} Users Online</p>
        </nav>
        {MessageDiv}
        <footer className="chatbar">
          <ChatBar className='chatbar' parentStates={this.state} tx={this.tx}/>
        </footer>
      </div>
    );
  }
}
export default App;



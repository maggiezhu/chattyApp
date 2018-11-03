const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');//import randome generate id function

// Set server port to 3001
const PORT = 3001;

//Create an express server
const server = express()
  //Make the express server serve static assets from public folder
  .use(express.static('public'))
  .listen(PORT,'0.0.0.0','localhost',() => console.log(`Listening on ${PORT}`));

//Create WevSockets Server
const wss = new SocketServer({server});
//callback for client connection and disconnection
wss.on('connection',(ws)=>{
  console.log('Client Connected')
  //send all clients number of currently connected clients
  let numOfClient={type:'ClientNumber',clientNum:wss.clients.size};
  wss.clients.forEach(function each(client){
    client.send(JSON.stringify(numOfClient));
  });
  ws.on('message', (msg)=> {
    let message = JSON.parse(msg);
    let newMessage;
    //if type = incomingNotification
    //response with notification
    if(message.type==='incomingNotification'){
      newMessage={clientNum:wss.clients.size,type:'incomingNotification',id:uuidv1(),previoususer:message.previoususer,currentusername:message.currentuser};
      //send to all connected client- broadcast
      wss.clients.forEach(function each(client){
        client.send(JSON.stringify(newMessage));
      });
    }else if (message.type==='incomingMessage') {
      newMessage={clientNum:wss.clients.size,type:'incomingMessage',id:uuidv1(),username:message.username,content:message.content};
      //send to all connected client- broadcast
      wss.clients.forEach(function each(client){
        client.send(JSON.stringify(newMessage));
      });
    }
  });
  ws.on('close',()=> {
    console.log('Client disconnected');
    let numOfClient={type:'ClientNumber',clientNum:wss.clients.size};
    wss.clients.forEach(function each(client){
    client.send(JSON.stringify(numOfClient));
  });

  });
});

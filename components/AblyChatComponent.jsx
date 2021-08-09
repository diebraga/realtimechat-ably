import React, { useEffect, useState } from 'react';
import { useChannel } from "./AblyReactEffect";
import styles from './AblyChatComponent.module.css';

const users = [
  {id: '1', name: 'Diego Braga', email: 'diebraga.developer@gmail.com', src: "https://bit.ly/dan-abramov"},
  {id: '2', name: 'Joseph Seph', email: 'joshephserphty@gmail.com', src: "https://bit.ly/code-beast"},
  {id: '3', name: "Sarah O'Shea", email: 'diebraga.jegssson@gmail.com', src: "https://bit.ly/ryan-florence"},
]

const AblyChatComponent = () => {
const [myChannel, setMyChanel] = useState('')
  let inputBox = null;
  let messageEnd = null;

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const messageTextIsEmpty = messageText.trim().length === 0;


  const [channel, ably] = useChannel(myChannel, (message) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText) => {
    channel.publish({ name: 'Diego', data: messageText });
    setMessageText("");
    inputBox.focus();
  }

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  }

  const handleKeyPress = (event) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  }

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "Eu" : `${message.name}`;
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();

    return (
      <div key={index} style={{display: 'flex'}}>
        &nbsp;&nbsp;
        <span className={styles.message} data-author={author}>
          {message.data}
        </span>
        &nbsp;&nbsp;
        <div>
        <span>{author}:</span> <span>{hours}:{minutes}</span>
        </div>
      </div>
    )
  });

  useEffect(() => {
    messageEnd.scrollIntoView({ behaviour: "smooth" });
  });

  return (
    <>
    <div style={{display: 'flex', cursor: 'pointer', justifyContent: 'space-around', marginTop: '20px'}} 
    >
      <div onClick={() => setMyChanel('Global')} style={{display: 'flex'}}>
      <img 
       src='https://images.theconversation.com/files/378097/original/file-20210111-23-bqsfwl.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop'
       height='100px'
       style={{
         borderRadius: '80px', marginRight: '50px'
       }}
       />
      <h1>Chat Global</h1>
      </div>
      <button 
        onClick={() => setMyChanel('')}
        className={myChannel !== 'Global' ? styles.invisible : null}
        style={{background: 'red', color: 'white', fontWeight: 'bold', fontSize: '40px', height: '80px' }}>
        X
      </button>
    </div>
    <hr size="3" color='black'/>  
    {users.map(user => {
      return (
        <div style={{display: 'flex', cursor: 'pointer', justifyContent: 'space-around', marginTop: '20px'}} 
          key={user.id}
        >
          <div onClick={() => setMyChanel(user.email)} style={{display: 'flex'}} onClick={() => setMyChanel(user.email)}>

          <img 
          src={user.src}
          height='100px'
          style={{
            borderRadius: '80px', marginRight: '50px'
          }}
          />
          <h1>Chat do {user.name}</h1>
          </div>
          <button 
            onClick={() => setMyChanel('')}
            className={myChannel !== user.email ? styles.invisible : null}
            style={{background: 'red', color: 'white', fontWeight: 'bold', fontSize: '40px', height: '80px' }}>
            X
          </button>
        </div>  
      )
    })}
      <div className={myChannel.length > 0 ? styles.chatHolder : styles.invisible}>
        <div className={styles.chatText}>
          {messages}
          <div ref={(element) => { messageEnd = element; }}></div>
        </div>
        <form onSubmit={handleFormSubmission} className={styles.form}>
          <textarea
            ref={(element) => { inputBox = element; }}
            value={messageText}
            placeholder="Type a message..."
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.textarea}
          ></textarea>
          <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>Send</button>
        </form>
      </div>
    
    </>
  )
}

export default AblyChatComponent;
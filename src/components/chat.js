import React, { useEffect, useState } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';


export default function Chat( {socket, userName, room}) {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);


    const sendMessage = async () => {
        if (currentMessage) {
            const messageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time: 
                    new Date(Date.now()).getHours() + 
                    ":" + 
                    new Date(Date.now()).getMinutes()
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);

            setCurrentMessage("");

          
        }
    }

    useEffect(() => {

        const receiveMessage = (data) => {
            setMessageList((list) => [...list, data])
        };
        socket.on("receive_message", receiveMessage);
        if (!isChatOpen) {
            // Increase unread count if the chat is not open
            setUnreadCount((count) => count + 1);
          }
        return () => {
            socket.off("receive_message", receiveMessage);
        };

    }, [socket, messageList]);

    return (
        <div className={`chat-window${isChatOpen ? ' open' : ''}`}>
            <div className="chat-header" onClick={() => {
                setIsChatOpen(!isChatOpen);
                setUnreadCount(0);}}>
                {!isChatOpen && unreadCount > 0 ?
                    <p style={{backgroundColor:'green'}}>Live Chat ({unreadCount})</p>
                    :
                    <p>Live Chat</p>}
            </div> 
            {isChatOpen && (
                <>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return(
                        <div
                        className="message"
                        id={userName === messageContent.author ? "you" : "other"}
                        >
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className="message-meta">
                                <p>{messageContent.time}</p>
                                <p>{messageContent.author}</p>
                            </div>
                        </div>
                    )
                })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input 
                type="text"
                value={currentMessage}
                placeholder="Hey..."
                onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                    event.key === 'Enter' && sendMessage();
                }}
                >
                </input>
                <button onClick={sendMessage}>&#9658;</button>
            </div>
                </>
            )}

        </div>

    )
}
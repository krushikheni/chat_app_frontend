import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../src/App.css";

const server = io("http://localhost:5500");

const App = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [name, setName] = useState(sessionStorage.getItem("name"));
  const [isNameIsEmpty, setIsNameIsEmpty] = useState(true);
  const messageRef = useRef();

  const hendleSendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    server.emit("chat-message", { message, name });
    setMessage("");
  };

  useEffect(() => {
    server.on("send-chats", (data) => {
      setChats(data);
    });

    if (sessionStorage.getItem("name")) {
      setIsNameIsEmpty(false);
    }
  }, []);

  useEffect(() => {
    messageRef.current?.scrollIntoView();
  }, [chats]);
  return (
    <div className="mainDIv">
      {isNameIsEmpty ? (
        <>
          <div>
            <input
              type="text"
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <button
              onClick={() => {
                setIsNameIsEmpty(false);
                sessionStorage.setItem("name", name);
              }}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div>
          <form onSubmit={hendleSendMessage}>
            <div className="formDiv">
              <input
                type="text"
                placeholder="Enter Message"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <button type="submit">Send</button>
            </div>
          </form>
          <div className="chats">
            {chats.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={msg.name == name ? "currentUserList" : "userList"}
                >
                  {msg.name == name ? (
                    <>
                      <p>{msg.message}</p>
                      <h3>{msg.name.split("")[0]}</h3>
                    </>
                  ) : (
                    <>
                      <h3>{msg.name.split("")[0]}</h3>
                      <p>{msg.message}</p>
                    </>
                  )}
                </div>
              );
            })}
            <div ref={messageRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

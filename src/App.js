import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createMessage, processIncomingMsg } from "./utils";
import "./App.css";

// const serverAddress = "ws://localhost:8080";
const serverAddress = "ws://chatroom-ws-server.herokuapp.com";
const KEEP_ALIVE_INTERVAL_IN_MS = 10000;

function App() {
  const name = useSelector((state) => state.name);
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [ws, setWs] = useState();
  const disableSendingMsg = !text || !name;

  useEffect(() => {
    const socket = new WebSocket(serverAddress);
    setWs(socket);

    socket.onmessage = (event) => {
      const msg = processIncomingMsg(event.data);
      if (!msg) {
        return;
      }
      dispatch({ type: "ADD_MESSAGE", payload: msg });
    };

    let keepAliveInterval;

    socket.onopen = () => {
      keepAliveInterval = setInterval(() => {
        // Our websocket server is hosted by Heroku on a free plan.
        // It will shut down if inactive for a certain period of time.
        // This is meant to keep it always active so it won't close.
        socket.send("keep alive");
      }, KEEP_ALIVE_INTERVAL_IN_MS);
    };

    return () => {
      socket.close();
      clearInterval(keepAliveInterval);
    };
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">Chat Room</header>
      <main>
        <div className="flex-center">
          <label>
            Your Name:&nbsp;
            <input
              value={name}
              onChange={(e) => {
                dispatch({ type: "SET_NAME", payload: e.target.value });
              }}
            />
          </label>
        </div>
        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.timestamp}
              className={message.sender === name ? "my-msg" : undefined}
            >
              <b>
                [{message.timestamp}] [{message.sender}]
              </b>
              &nbsp;
              <span>{message.msg}</span>
            </div>
          ))}
        </div>
        <form
          className="flex-center"
          style={{ background: "lightgreen" }}
          disabled={disableSendingMsg}
          onSubmit={(event) => {
            event.preventDefault();
            console.log("submitting message:", text);
            ws.send(createMessage(text, name));
            setText("");
          }}
        >
          <label>
            Write a Message:&nbsp;
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit" disabled={disableSendingMsg}>
              Submit
            </button>
          </label>
        </form>
      </main>
    </div>
  );
}

export default App;

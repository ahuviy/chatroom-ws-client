import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createMessage, processIncomingMsg } from "./utils";
import "./App.css";

function App() {
  const name = useSelector((state) => state.name);
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [ws, setWs] = useState(() => new WebSocket("ws://localhost:8080"));
  const disableSendingMsg = !text || !name;

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onmessage = (event) => {
      const msg = processIncomingMsg(event.data);
      if (!msg) {
        return;
      }
      dispatch({ type: "ADD_MESSAGE", payload: msg });
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">Chat Room</header>
      <main>
        <div>
          <label>
            Your Name:
            <input
              value={name}
              onChange={(e) => {
                dispatch({ type: "SET_NAME", payload: e.target.value });
              }}
            />
          </label>
        </div>
        <form
          disabled={disableSendingMsg}
          onSubmit={(event) => {
            event.preventDefault();
            console.log("submitting message:", text);
            ws.send(createMessage(text, name));
            setText("");
          }}
        >
          <label>
            Write a Message:
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit" disabled={disableSendingMsg}>
              Submit
            </button>
          </label>
        </form>
        {messages.map((message) => (
          <div key={message.timestamp}>
            <b>
              [{message.timestamp}] [{message.sender}]
            </b>
            &nbsp;
            <span>{message.msg}</span>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;

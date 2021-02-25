export function createMessage(text, name) {
  return JSON.stringify({
    type: "TEXT_MSG",
    msg: text,
    sender: name,
  });
}

export function processIncomingMsg(data) {
  const msg = tryParseJSON(data);
  console.log("Message from server ", msg);

  const isValidTextMsg =
    msg && msg.type === "TEXT_MSG" && msg.sender && msg.timestamp && msg.msg;

  return isValidTextMsg
    ? { ...msg, timestamp: new Date(msg.timestamp).toISOString() }
    : undefined;
}

function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}

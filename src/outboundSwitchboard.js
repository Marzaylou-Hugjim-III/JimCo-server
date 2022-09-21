import { emitToOthers, getClientByID } from "./emit.js";

export function outboundSwitchboard(message) {
  const key = message?.intendedReciever;
  switch (key) {
    case 'sender':
      getClientByID(message.id)?.emit("pong", message);
      break;
    case 'others':
      emitToOthers(message.id, message);
      break;
    case 'all':
      io.emit(message);
    default:
      break;
  }
}
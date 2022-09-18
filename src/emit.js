import { allClients } from '..server';

export function getClientByID(id) {
  let output;
  allClients.forEach((client) => {// use allClients.find
    client.id === id ? (output = client) : null;
  });
  return output;
} // this could instead directly emit to client witth error handling

export function emitToOthers(ignoredId, message) {
  for (const client of allClients) {
    if (client.id === ignoredId) {
      continue;
    }
    client.emit(message);
  }
}

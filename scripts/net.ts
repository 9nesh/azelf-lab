import type { Server } from 'node:http';
export async function listen(server:Server,port=0):Promise<string>{await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>resolve());});const address=server.address();if(!address||typeof address==='string')throw Error('No listener');return `http://127.0.0.1:${address.port}`;}
export async function close(server:Server){server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));}

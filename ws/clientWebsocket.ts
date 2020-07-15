/// <reference lib="dom" />


import { green } from "https://deno.land/std/fmt/colors.ts";

const endpoint = 'ws://localhost:3500/ws';
console.log('endpoint', endpoint);

try {
  
  console.log('Client connection starting');
  let sock = new WebSocket(endpoint);

  // dom refs
  const nameForm = document.querySelector('.name-form') as HTMLFormElement;
  const chatroom = document.querySelector('.chatroom') as HTMLFormElement;
  const chatList = document.querySelector('.chat-list') as HTMLFormElement;
  const chatForm = document.querySelector('.chat-form') as HTMLFormElement;

  let name = 'anon'

  // enter chatroom with name
  nameForm?.addEventListener('submit', (e: any) => {
    console.log('nameform event')
    e.preventDefault();
    
    name = nameForm.nickname.value ?? "";
    console.log('name', name);
    nameForm.classList.add('hidden');
    chatroom?.classList.remove('hidden');
  });

  // send a new chat message
  chatForm?.addEventListener('submit', (e: any) => {
    e.preventDefault();

    let mssg = chatForm.mssg.value ?? "";
    console.log('mssg', mssg);
    sock.send(JSON.stringify({ name, mssg }));
    if (chatForm !== null && chatForm !== undefined) {
      chatForm.reset();
    }
  });

  // output event to dom
  const outputMessage = ({ data }: MessageEvent) => {
    const { name, mssg } = JSON.parse(data);

    let template = `
      <li>
        <div class='name'>${name}</div>
        <div class='mssg'>${mssg}</div>
      </li>
    `;
    chatList.innerHTML += template;
  };

  // setup listener
  sock.addEventListener('message', outputMessage);

} catch (err) {
  throw new Error(err)
}
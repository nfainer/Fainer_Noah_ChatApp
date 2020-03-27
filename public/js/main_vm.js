// imports always go first - if we're importing anything

import ChatMessage from "./modules/ChatMessage.js";
import greetMessage from "./modules/greetMessage.js";


const socket = io();

//the packet is whatever data we send through with the connect event
//from the server


// this is data destructuring. Go look it up on MDN
function setUserId({sID}){
    // debugger;
    console.log(sID);
    vm.socketID = sID;
}

function showDisconnectMessage(){
    console.log('a user disconnected');
}

function appendMessage(message) {
    vm.messages.push(message);
}

function showGreetMsg(nickname){
    vm.messages.push(nickname)
}


const vm = new Vue({

    data: {
        socketID: "",
        message: "",
        nickname: "",
        messages: []
    },

    methods: {

        //emit a message event to the server so that it
        //can in turn send this to anyone whos connected
        dispatchMessage(){
            console.log('handle emit message');

            // the double pipe || is an "or" operator
            // if the first value is set, use it. else use
            // whatever comes after the "or" operator
            socket.emit('chat_message', {
                name: this.nickname || "anonymous",
                content: this.message

            })

            this.message = "";
        },

        submitNickname(){
            console.log('nickname button clicked');

            socket.emit('new_user', {
                name: this.nickname || "anonymous",
            })

            document.querySelector('.bg-modal').classList.add('hidden');
    
        }
    },

    mounted:  function(){
        console.log('vue is done mounting');
    },

    components: {
        newmessage: ChatMessage,
        greetmsg: greetMessage
    }

}).$mount('#app');

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);
socket.addEventListener('greeting', showGreetMsg);

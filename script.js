// ==========================================
// ИИ-ПОМОЩНИК ДАЧНЫЙ КОМФОРТ
// AI Assistant Widget V4.0
// Client Side Core
// ==========================================



// ===============================
// Настройки
// ===============================


const ALBATO_WEBHOOK_URL = 
"https://h.albato.ru/wh/38/1lf2f6v/6wzofj70-4O_Jbhmy46bCzOgyrB9zeZI66EFr_M52sQ/";



// ===============================
// Элементы
// ===============================


const chatButton =
document.getElementById("ai-widget-button");


const chatWindow =
document.getElementById("ai-widget-window");


const chatHistory =
document.getElementById("chat-history");


const optionsPanel =
document.getElementById("options-panel");


const userInput =
document.getElementById("user-input");


const sendButton =
document.getElementById("send-button");



// ===============================
// Состояние
// ===============================


let session = {


id:
"dc_" + Date.now(),


messages: [],


clientData:{}


};




let opened=false;



// ===============================
// Открытие чата
// ===============================


chatWindow.style.display="none";



chatButton.onclick=function(){


opened=!opened;


if(opened){


chatWindow.style.display="flex";


if(session.messages.length===0){

startAssistant();

}


}else{


chatWindow.style.display="none";


}


};





// ===============================
// Старт
// ===============================


function startAssistant(){


addAIMessage(

"Здравствуйте! 👋\n\n"+
"Я ИИ-помощник компании «Дачный комфорт».\n\n"+
"Помогу подобрать оборудование, "+
"ответить на вопросы или оформить заявку."

);



showOptions([


{
text:"🏠 Купить оборудование",
value:"BUY_PRODUCT"
},


{
text:"🔧 Заказать услугу",
value:"SERVICE"
},


{
text:"🛠 Уже есть система, нужна помощь",
value:"EXISTING_PROBLEM"
},


{
text:"⚠️ Аварийная ситуация",
value:"EMERGENCY"
}


]);


}






// ===============================
// Добавление сообщения AI
// ===============================


function addAIMessage(text){


let div=document.createElement("div");


div.className=
"message assistant";


div.innerText=text;


chatHistory.appendChild(div);



session.messages.push({

role:"assistant",

content:text

});



scrollChat();


}






// ===============================
// Добавление сообщения клиента
// ===============================


function addClientMessage(text){


let div=document.createElement("div");


div.className=
"message client";


div.innerText=text;


chatHistory.appendChild(div);



session.messages.push({

role:"user",

content:text

});



scrollChat();


}






function scrollChat(){


chatHistory.scrollTop =
chatHistory.scrollHeight;


}
// ==========================================
// AI COMMUNICATION LAYER
// Связь Widget → Albato → GigaChat
// ==========================================



// ===============================
// Отправка сообщения
// ===============================


sendButton.onclick=function(){


let text =
userInput.value.trim();



if(!text)
return;



addClientMessage(text);



userInput.value="";



// отправляем AI


sendToAI(text);



};






// ===============================
// Отправка в Albato
// ===============================


async function sendToAI(message){



showTyping();



let payload = {


session_id:
session.id,


message:
message,


history:
session.messages,


client_data:
session.clientData



};



console.log(
"Отправляем в AI:",
payload
);





try{


let response =
await fetch(
ALBATO_WEBHOOK_URL,
{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:
JSON.stringify(payload)


}

);





let data =
await response.json();




hideTyping();




receiveAIResponse(data);



}

catch(error){



hideTyping();



console.error(
"Ошибка AI:",
error
);



addAIMessage(

"Извините, произошла ошибка соединения. Попробуйте ещё раз."

);



}




}







// ===============================
// Получение ответа AI
// ===============================



function receiveAIResponse(data){



console.log(
"Ответ AI:",
data
);





if(data.answer){


addAIMessage(
data.answer
);


}




if(data.buttons){



showOptions(
data.buttons
);



}



if(data.client_data){


session.clientData =
{

...session.clientData,

...data.client_data

};


}



}







// ===============================
// Кнопки от AI
// ===============================



function showOptions(options){



optionsPanel.innerHTML="";





options.forEach(option=>{



let button =
document.createElement("button");



button.className=
"scenario-button";



button.innerText=
option.text;



button.onclick=function(){



addClientMessage(
option.text
);



optionsPanel.innerHTML="";





sendToAI(
option.value
);



};



optionsPanel.appendChild(button);



});



}







// ===============================
// Индикатор печати
// ===============================


let typingElement=null;



function showTyping(){



typingElement =
document.createElement("div");



typingElement.className=
"message assistant";



typingElement.innerText=
"Печатает...";



chatHistory.appendChild(
typingElement
);



scrollChat();


}






function hideTyping(){



if(typingElement){


typingElement.remove();


typingElement=null;


}



}
// ==========================================
// AI RESPONSE HANDLER V4.0
// TOP-3 + LEAD DATA + ALBATO FORMAT
// ==========================================



// ===============================
// Улучшенный ответ AI
// ===============================


function receiveAIResponse(data){



console.log(
"AI RESPONSE:",
data
);



// если пришла строка

if(typeof data==="string"){


addAIMessage(data);


return;


}




// обычный ответ AI


if(data.assistant_message){


addAIMessage(
data.assistant_message
);


}




// поддержка старого формата

if(data.answer){


addAIMessage(
data.answer
);


}




// кнопки от AI


if(data.buttons){


showOptions(
data.buttons
);


}




// сохранение intent


if(data.intent){


session.clientData.intent =
data.intent;


}




// сохранение статуса


if(data.status){


session.clientData.status =
data.status;


}





// TOP-3 товары


if(data.products){


showProducts(
data.products
);


}





// данные клиента


if(data.lead){


session.clientData =
{

...session.clientData,

...data.lead

};


}





}




// ===============================
// TOP-3 вывод
// ===============================


function showProducts(products){



addAIMessage(

"Подобрал для вас подходящие варианты 👇"

);



products.forEach(
(product,index)=>{


let number="🥇";


if(index===1)
number="🥈";


if(index===2)
number="🥉";



addAIMessage(

number+
" "+
product.name+
"\n\n"+
(product.description || "")

);



}

);



}







// ===============================
// Сохранение контактов
// ===============================


function updateClientData(data){



session.clientData =
{

...session.clientData,

...data

};



console.log(
"CLIENT DATA:",
session.clientData
);



}






// ===============================
// Подготовка финальной заявки
// ===============================


function prepareLead(){



let lead = {


session_id:
session.id,


messages:
session.messages,


client:
session.clientData



};



console.log(
"FINAL LEAD:",
lead
);



return lead;


}






// ===============================
// Защита URL
// ===============================


function checkWebhook(){



if(
ALBATO_WEBHOOK_URL.includes(
"ВАШ_WEBHOOK"
)

){


console.warn(
"Webhook Albato еще не вставлен"
);


return false;


}


return true;


}

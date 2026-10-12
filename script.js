// ==========================================
// ИИ-ПОМОЩНИК "ДАЧНЫЙ КОМФОРТ"
// Frontend widget
// Версия 2.0
// Подготовлено для интеграции Albato
// ==========================================


// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================


document.addEventListener("DOMContentLoaded", function(){


// ==========================================
// ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
// ==========================================


const chatButton = document.getElementById("ai-widget-button");

const chatWindow = document.getElementById("ai-widget-window");

const messagesBox = document.getElementById("chat-messages");

const buttonsBox = document.getElementById("scenario-buttons");

const inputField = document.getElementById("user-input");

const sendButton = document.getElementById("send-button");



// ==========================================
// ДАННЫЕ КЛИЕНТА
// Будут отправляться в Albato
// ==========================================


let clientData = {

    session_id:
    "dc_" + Date.now(),

    name:null,

    phone:null,

    location:null,

    intent:null,

    category:null,

    product:null,

    answers:{}

};



// ==========================================
// ОТКРЫТИЕ ОКНА
// ==========================================


if(chatButton){


chatButton.addEventListener("click", function(){


chatWindow.style.display="block";


if(messagesBox.innerHTML===""){

startDialog();

}


});


}



// ==========================================
// ДОБАВЛЕНИЕ СООБЩЕНИЙ
// ==========================================


function addMessage(text,type="ai"){


let message=document.createElement("div");


message.className=
"message " + type;


message.innerHTML=text;


messagesBox.appendChild(message);


messagesBox.scrollTop =
messagesBox.scrollHeight;


}



// ==========================================
// СОЗДАНИЕ КНОПОК
// ==========================================


function showButtons(buttons){


buttonsBox.innerHTML="";


buttons.forEach(function(item){


let button =
document.createElement("button");


button.className="scenario-btn";


button.innerHTML=item.text;



button.onclick=function(){


addMessage(
item.text,
"client"
);


buttonsBox.innerHTML="";


if(item.action){

item.action();

}


};



buttonsBox.appendChild(button);


});


}



// ==========================================
// ПЕРВОЕ ПРИВЕТСТВИЕ
// ==========================================


function startDialog(){


addMessage(`

👋 Здравствуйте!

Я — ИИ-помощник компании
<strong>«Дачный комфорт»</strong>.

Помогу подобрать оборудование,
разобраться с услугами или принять заявку.

Выберите, что вас интересует:

`);



showButtons([


{

text:"🏠 Купить оборудование",

action:function(){

buyProductStart();

}

},


{

text:"🛠 Услуги",

action:function(){

serviceStart();

}

},


{

text:"⚠️ Аварийная ситуация",

action:function(){

emergencyStart();

}

},


{

text:"🔧 Проблема с существующей системой",

action:function(){

problemStart();

}

}


]);


}



// ==========================================
// ЭКСПОРТ ФУНКЦИИ ДЛЯ ПРОВЕРКИ
// ==========================================


window.startDialog=startDialog;



});

// ==========================================
// ИИ-помощник "Дачный комфорт"
// Основная логика виджета
// Версия 1.1
// ==========================================


document.addEventListener("DOMContentLoaded", function(){


// -------------------------------
// Элементы интерфейса
// -------------------------------

const chatButton = document.getElementById("ai-widget-button");

const chatWindow = document.getElementById("ai-widget-window");

const messagesBox = document.getElementById("chat-messages");

const buttonsBox = document.getElementById("scenario-buttons");

const inputField = document.getElementById("user-input");

const sendButton = document.getElementById("send-button");


// -------------------------------
// Открытие окна
// -------------------------------

chatButton.onclick = function(){

chatWindow.style.display = "block";

startDialog();

};


// -------------------------------
// Добавление сообщения
// -------------------------------

function addMessage(text,type="ai"){

let message=document.createElement("div");

message.className="message "+type;

message.innerHTML=text;

messagesBox.appendChild(message);

messagesBox.scrollTop=messagesBox.scrollHeight;

}


// -------------------------------
// Создание кнопок
// -------------------------------

function createButtons(items){

buttonsBox.innerHTML="";


items.forEach(item=>{


let btn=document.createElement("button");

btn.className="scenario-btn";

btn.innerHTML=item.text;


btn.onclick=function(){

addMessage(item.text,"client");

buttonsBox.innerHTML="";


if(item.action){

item.action();

}

};


buttonsBox.appendChild(btn);


});


}



// -------------------------------
// Первое приветствие
// -------------------------------

function startDialog(){


if(messagesBox.innerHTML!=="") return;


addMessage(
`
👋 Здравствуйте!

Я — ИИ-помощник компании «Дачный комфорт».

Помогу подобрать оборудование, разобраться с услугами или принять заявку.

Выберите, что вас интересует:
`
);



createButtons([


{
text:"🏠 Купить оборудование",

action:function(){

productStart();

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
text:"❓ Проблема с существующей системой",

action:function(){

problemStart();

}

}


]);

}



// -------------------------------
// Покупка оборудования
// -------------------------------


function productStart(){


addMessage(
"Какое оборудование вас интересует?"
);


createButtons([


{
text:"♻️ Автономная канализация",
action:function(){

addMessage(
"Уточним параметры для подбора оптимального варианта."
);

}

},


{
text:"🚽 Септик",
action:function(){

addMessage(
"Уточним параметры для подбора септика."
);

}

},


{
text:"🛢 Накопительная емкость",
action:function(){

addMessage(
"Уточним параметры накопителя."
);

}

},


{
text:"🏡 Погреб",
action:function(){

addMessage(
"Уточним параметры погреба."
);

}

},


{
text:"🔧 Кессон",
action:function(){

addMessage(
"Уточним параметры кессона."
);

}

},


{
text:"🍽 Жироуловитель",
action:function(){

addMessage(
"Уточним параметры жироуловителя."
);

}

},


{
text:"🏭 Промышленная установка",
action:function(){

addMessage(
"Уточним параметры промышленной станции."
);

}

}


]);


}



// -------------------------------
// Услуги
// -------------------------------


function serviceStart(){


addMessage(
"Какая услуга вам требуется?"
);


createButtons([


{
text:"💧 Дренаж",
action:function(){

addMessage("Уточним параметры участка.");

}

},


{
text:"🌧 Водоотведение",
action:function(){

addMessage("Уточним особенности задачи.");

}

},


{
text:"🔧 Ремонт",
action:function(){

addMessage("Опишите проблему.");

}

}


]);


}




// -------------------------------
// Авария
// -------------------------------


function emergencyStart(){


addMessage(
"⚠️ Опишите аварийную ситуацию. Что произошло?"
);


}




// -------------------------------
// Существующая система
// -------------------------------


function problemStart(){


addMessage(
"Какая проблема возникла с существующей системой?"
);


createButtons([


{
text:"🔧 Ремонт",
action:function(){

addMessage("Опишите неисправность.");

}

},


{
text:"🔍 Диагностика",
action:function(){

addMessage("Опишите ситуацию.");

}

},


{
text:"🛠 Обслуживание",
action:function(){

addMessage("Уточним детали.");

}

}

]);


}




// -------------------------------
// Отправка текста
// -------------------------------


sendButton.onclick=function(){


let text=inputField.value.trim();


if(text==="") return;


addMessage(text,"client");


inputField.value="";


};


window.startDialog = startDialog;


});

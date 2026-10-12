// =====================================
// AI-помощник "Дачный комфорт"
// Основная логика виджета
// Версия 1.0
// Подготовлено под интеграцию Albato
// =====================================


// ------------------------------
// Элементы интерфейса
// ------------------------------

const chatButton = document.getElementById("ai-widget-button");

const chatWindow = document.getElementById("ai-widget-window");

const messagesBox = document.getElementById("chat-messages");

const buttonsBox = document.getElementById("scenario-buttons");

const inputField = document.getElementById("user-input");

const sendButton = document.getElementById("send-button");


// ------------------------------
// Данные клиента
// Будут отправляться в Albato
// ------------------------------

let clientData = {

    session_id:
    "session_" + Date.now(),

    name: null,

    phone: null,

    location: null,

    intent: null,

    product_category: null,

    service_type: null,

    problem_type: null,

    emergency_type: null,

    answers: []

};



// ------------------------------
// Открытие / закрытие окна
// ------------------------------

chatButton.onclick = function(){


    if(chatWindow.style.display === "none"
       ||
       chatWindow.style.display === ""){


        chatWindow.style.display = "flex";


        startAssistant();


    } else {


        chatWindow.style.display = "none";


    }

};



// ------------------------------
// Первое приветствие
// ------------------------------

function startAssistant(){


    if(messagesBox.innerHTML !== "") return;


    addAIMessage(

    `👋 Здравствуйте!

Я ИИ-помощник компании «Дачный комфорт».

Помогу подобрать оборудование, выбрать услугу или разобраться с проблемой вашей системы.

Что вас интересует?`

    );


    showMainButtons();


}




// ------------------------------
// Добавление сообщения ИИ
// ------------------------------

function addAIMessage(text){


    let message =
    document.createElement("div");


    message.className =
    "ai-message";


    message.innerHTML =
    text.replace(/\n/g,"<br>");


    messagesBox.appendChild(message);


    messagesBox.scrollTop =
    messagesBox.scrollHeight;


}



// ------------------------------
// Добавление сообщения клиента
// ------------------------------

function addUserMessage(text){


    let message =
    document.createElement("div");


    message.className =
    "user-message";


    message.innerHTML = text;


    messagesBox.appendChild(message);


    messagesBox.scrollTop =
    messagesBox.scrollHeight;


}




// ------------------------------
// Главные кнопки сценариев
// Согласовано по Albato
// ------------------------------

function showMainButtons(){


buttonsBox.innerHTML="";


createButton(
"🏠 Купить оборудование",
"BUY_PRODUCT"
);


createButton(
"🔧 Услуги",
"SERVICE"
);


createButton(
"⚠️ Проблема с существующей системой",
"EXISTING_PROBLEM"
);


createButton(
"🚨 Аварийная ситуация",
"EMERGENCY"
);



}




// ------------------------------
// Создание кнопки
// ------------------------------

function createButton(text,value){


let button =
document.createElement("button");


button.className =
"scenario-button";


button.innerHTML =
text;



button.onclick=function(){


    selectScenario(
        text,
        value
    );


};



buttonsBox.appendChild(button);


}




// ------------------------------
// Выбор сценария
// ------------------------------

function selectScenario(text,value){


addUserMessage(text);



clientData.intent=value;



buttonsBox.innerHTML="";


if(value==="BUY_PRODUCT"){


    addAIMessage(

    "Отлично! Какое оборудование вас интересует?"

    );


    showEquipmentButtons();


}



if(value==="SERVICE"){


    addAIMessage(

    "Выберите, какая услуга вам нужна."

    );


}



if(value==="EXISTING_PROBLEM"){


    addAIMessage(

    "Опишите, пожалуйста, проблему с вашей существующей системой."

    );


}



if(value==="EMERGENCY"){


    addAIMessage(

    "Опишите аварийную ситуацию. Что произошло?"

    );


}




}




// ------------------------------
// Оборудование
// Подготовка под ветки Albato
// ------------------------------

function showEquipmentButtons(){


createButton(
"♻️ Автономная канализация",
"AUTONOMOUS_SEWAGE"
);


createButton(
"🚽 Септик",
"SEPTIC"
);


createButton(
"🛢 Накопительная ёмкость",
"STORAGE"
);


createButton(
"🏠 Погреб",
"CELLAR"
);


createButton(
"⚙️ Кессон",
"CAISSON"
);


createButton(
"🍴 Жироуловитель",
"GREASE_TRAP"
);


createButton(
"🏭 Промышленная станция",
"INDUSTRIAL"
);



}




// ------------------------------
// Отправка сообщения вручную
// Пока локально
// Позже подключаем webhook Albato
// ------------------------------

sendButton.onclick=function(){


let text =
inputField.value.trim();


if(!text) return;



addUserMessage(text);



clientData.answers.push(text);



inputField.value="";



};

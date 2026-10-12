// ======================================
// ИИ-ПОМОЩНИК ДАЧНЫЙ КОМФОРТ
// Widget Core V2.1 FINAL
// Сценарии Albato
// ======================================


// ==============================
// Элементы
// ==============================


const chatButton = document.getElementById(
    "ai-widget-button"
);


const chatWindow = document.getElementById(
    "ai-widget-window"
);


const messagesBox = document.getElementById(
    "chat-messages"
);


const buttonsBox = document.getElementById(
    "scenario-buttons"
);



// ==============================
// Состояние клиента
// ==============================


let session = {

    session_id:
        "session_" + Date.now(),

    intent:null,

    product_category:null,

    service_type:null,

    problem_type:null,

    client_comment:null,

    name:null,

    phone:null,

    location:null

};



// ==============================
// Состояние окна
// ==============================


let isOpen=false;

let started=false;



chatWindow.style.display="none";



// ==============================
// Открытие окна
// ==============================


chatButton.onclick=function(){


    isOpen=!isOpen;



    if(isOpen){


        chatWindow.style.display="block";



        if(!started){

            startAssistant();

            started=true;

        }


    }

    else{


        chatWindow.style.display="none";

    }


};




// ==============================
// Сообщения
// ==============================


function addMessage(text,type="assistant"){


    let message=document.createElement("div");


    message.className="message "+type;


    message.innerText=text;


    messagesBox.appendChild(message);



    messagesBox.scrollTop =
        messagesBox.scrollHeight;


}




// ==============================
// Кнопки
// ==============================


function createButton(text,callback){


    let btn=document.createElement("button");


    btn.className="scenario-button";


    btn.innerText=text;


    btn.onclick=callback;


    buttonsBox.appendChild(btn);


}




function clearButtons(){


    buttonsBox.innerHTML="";


}




// ==============================
// Стартовый экран
// ==============================


function startAssistant(){



addMessage(
"Здравствуйте! 👋\n\nЯ ИИ-помощник компании «Дачный комфорт».\n\nПомогу подобрать оборудование, выбрать услугу или решить проблему с существующей системой."
);



createButton(
"🏠 Купить оборудование",
buyProduct
);



createButton(
"🔧 Заказать услугу",
serviceStart
);



createButton(
"🛠 Уже есть система, нужна помощь",
existingProblemStart
);



createButton(
"⚠️ Аварийная ситуация",
emergencyStart
);



}



// ==============================
// BUY PRODUCT
// ==============================


function buyProduct(){


session.intent="BUY_PRODUCT";


clearButtons();



addMessage(
"Какое оборудование вас интересует?"
);



createButton(
"💧 Автономная канализация",
function(){

session.product_category="СБО";

addMessage(
"Вы выбрали автономную канализацию."
);

nextProductQuestions();

}

);



createButton(
"🚽 Септик",
function(){

session.product_category="СЕПТИК";

addMessage(
"Вы выбрали септик."
);

nextProductQuestions();

}

);



createButton(
"🛢 Накопительная емкость",
function(){

session.product_category="НАКОПИТЕЛЬ";

addMessage(
"Вы выбрали накопительную емкость."
);

nextProductQuestions();

}

);



createButton(
"🏠 Погреб",
function(){

session.product_category="ПОГРЕБ";

addMessage(
"Вы выбрали погреб."
);

nextProductQuestions();

}

);



createButton(
"🔧 Кессон",
function(){

session.product_category="КЕССОН";

addMessage(
"Вы выбрали кессон."
);

nextProductQuestions();

}

);



createButton(
"🍴 Жироуловитель",
function(){

session.product_category="ЖИРОУЛОВИТЕЛЬ";

addMessage(
"Вы выбрали жироуловитель."
);

nextProductQuestions();

}

);



createButton(
"🏭 Промышленная установка",
function(){

session.product_category="ПРОМ";

addMessage(
"Вы выбрали промышленную установку."
);

nextProductQuestions();

}

);



}
// ==============================
// Вопросы по оборудованию
// ==============================


function nextProductQuestions(){


clearButtons();


addMessage(
"Отлично 👍 Чтобы подобрать подходящий вариант, уточню несколько вопросов."
);



createButton(
"👥 1-2 человека",
function(){

session.users="1-2";

askSeason();

}
);



createButton(
"👥 3-4 человека",
function(){

session.users="3-4";

askSeason();

}
);



createButton(
"👥 5-6 человек",
function(){

session.users="5-6";

askSeason();

}
);



createButton(
"👥 Более 6 человек",
function(){

session.users="7+";

askSeason();

}
);



}



function askSeason(){


clearButtons();


addMessage(
"Как часто вы проживаете или планируете проживать в доме?"
);



createButton(
"🏡 Постоянное проживание",
function(){

session.seasonality="ПОСТОЯННО";

askElectricity();

}
);



createButton(
"🌿 Сезонное проживание",
function(){

session.seasonality="СЕЗОННО";

askElectricity();

}
);



}



function askElectricity(){


clearButtons();


addMessage(
"Есть ли электричество на участке?"
);



createButton(
"⚡ Да",
function(){

session.electricity_status="YES";

finishProduct();

}
);



createButton(
"🔋 Нет",
function(){

session.electricity_status="NO";

finishProduct();

}
);



createButton(
"❓ Не знаю",
function(){

session.electricity_status="UNKNOWN";

finishProduct();

}
);



}



function finishProduct(){


clearButtons();


addMessage(
"Спасибо! Я подготовил предварительный подбор вариантов. Специалист компании свяжется с вами для уточнения деталей."
);


sendToAlbato();


}



// ==============================
// SERVICE
// ==============================


function serviceStart(){


session.intent="SERVICE";


clearButtons();


addMessage(
"Какая услуга вам необходима?"
);



createButton(
"🔧 Установка оборудования",
()=>serviceSelect("INSTALLATION")
);



createButton(
"🛠 Обслуживание системы",
()=>serviceSelect("MAINTENANCE")
);



createButton(
"🌱 Дренаж участка",
()=>serviceSelect("DRAINAGE")
);



createButton(
"🌧 Ливневая канализация",
()=>serviceSelect("STORM_WATER")
);



createButton(
"💬 Консультация специалиста",
()=>serviceSelect("CONSULTATION")
);



}



function serviceSelect(type){


session.service_type=type;


clearButtons();


addMessage(
"Спасибо. Опишите подробнее вашу задачу."
);


}



// ==============================
// EXISTING PROBLEM
// ==============================


function existingProblemStart(){


session.intent="EXISTING_PROBLEM";


clearButtons();


addMessage(
"Какая проблема возникла с вашей системой?"
);



createButton(
"🔧 Ремонт",
()=>problemSelect("REPAIR")
);



createButton(
"🛠 Обслуживание",
()=>problemSelect("MAINTENANCE")
);



createButton(
"🔍 Диагностика",
()=>problemSelect("DIAGNOSTICS")
);



createButton(
"❓ Другая проблема",
()=>problemSelect("OTHER_PROBLEM")
);



}



function problemSelect(type){


session.problem_type=type;


clearButtons();


addMessage(
"Опишите, пожалуйста, что произошло."
);



}



// ==============================
// EMERGENCY
// ==============================


function emergencyStart(){


session.intent="EMERGENCY";


clearButtons();


addMessage(
"⚠️ Опишите аварийную ситуацию.\nНапример: перелив, затопило участок, система перестала работать."
);



}



// ==============================
// Получение текста клиента
// ==============================


const inputField=document.getElementById(
"user-input"
);


const sendButton=document.getElementById(
"send-button"
);



sendButton.onclick=function(){


let text=inputField.value.trim();



if(text==="") return;



addMessage(text,"client");



inputField.value="";



session.client_comment=text;



console.log(
"SESSION:",
session
);



};




// ==============================
// Подготовка отправки Albato
// ==============================


function sendToAlbato(){


console.log(
"DATA FOR ALBATO:",
session
);


// Здесь позже добавим webhook Albato

}

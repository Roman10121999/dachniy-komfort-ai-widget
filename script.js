// ========================================
// ИИ-ПОМОЩНИК "ДАЧНЫЙ КОМФОРТ"
// Frontend сценарий AI Lead Qualifier
// Версия 1.0
// Подготовка под Albato webhook
// ========================================


// Элементы интерфейса

const chatButton = document.getElementById("ai-widget-button");
const chatWindow = document.getElementById("ai-widget-window");

const messagesBox = document.getElementById("chat-messages");
const buttonsBox = document.getElementById("scenario-buttons");

const inputField = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");


// ========================================
// Данные клиента
// ========================================

let clientData = {

    session_id:
    "session_" + Date.now(),

    name:null,
    phone:null,
    location:null,

    intent:null,
    product_category:null,

    answers:{}

};


// ========================================
// Состояние
// ========================================

let currentStep = "start";


// ========================================
// Открытие / закрытие окна
// ========================================


chatWindow.style.display="none";


chatButton.onclick=function(){

    if(chatWindow.style.display==="none"){

        chatWindow.style.display="flex";

        if(messagesBox.innerHTML===""){

            startDialog();

        }

    }
    else{

        chatWindow.style.display="none";

    }

};



// ========================================
// Добавление сообщения
// ========================================


function addMessage(text,type="assistant"){


    let div=document.createElement("div");


    div.className=
    "message " + type;


    div.innerHTML=text;


    messagesBox.appendChild(div);


    messagesBox.scrollTop=
    messagesBox.scrollHeight;


}



// ========================================
// Кнопки
// ========================================


function showButtons(buttons){


    buttonsBox.innerHTML="";


    buttons.forEach(item=>{


        let btn=document.createElement("button");


        btn.innerHTML=item.text;


        btn.onclick=function(){

            item.action();

        };


        buttonsBox.appendChild(btn);


    });


}




// ========================================
// Стартовый экран
// ========================================


function startDialog(){


addMessage(`

👋 Здравствуйте!

Я — ИИ-помощник компании 
<b>«Дачный комфорт»</b>.

Помогу подобрать оборудование,
разобраться с услугами или принять заявку.

Выберите, что вас интересует:

`);


showButtons([


{
text:"🏠 Купить оборудование",

action:function(){

clientData.intent="BUY_PRODUCT";

productMenu();

}

},



{
text:"🛠 Услуги",

action:function(){

clientData.intent="SERVICE";

serviceMenu();

}

},



{
text:"⚠️ Аварийная ситуация",

action:function(){

clientData.intent="EMERGENCY";

emergencyDialog();

}

},



{
text:"🔧 Проблема с существующей системой",

action:function(){

clientData.intent="EXISTING_PROBLEM";

problemDialog();

}

}



]);


}



// ========================================
// Покупка оборудования
// ========================================


function productMenu(){


addMessage(
"Отлично 👍<br><br>Какое оборудование вас интересует?"
);


showButtons([


{
text:"♻️ Автономная канализация",
action:function(){

clientData.product_category=
"Автономная канализация";

collectPeople();

}

},



{
text:"🚽 Септик",
action:function(){

clientData.product_category=
"Септик";

collectPeople();

}

},



{
text:"🛢 Накопительная емкость",

action:function(){

clientData.product_category=
"Накопитель";

collectPeople();

}

},



{
text:"🏠 Погреб",

action:function(){

clientData.product_category=
"Погреб";

finishQuestion();

}

},



{
text:"🔩 Кессон",

action:function(){

clientData.product_category=
"Кессон";

finishQuestion();

}

},



{
text:"🧴 Жироуловитель",

action:function(){

clientData.product_category=
"Жироуловитель";

finishQuestion();

}

}



]);


}




// ========================================
// Вопросы автономной канализации
// ========================================


function collectPeople(){


addMessage(
"Сколько человек будет проживать в доме?"
);



showButtons([


{
text:"1-2 человека",
action:function(){

clientData.answers.people="1-2";

nextLiving();

}

},



{
text:"3-4 человека",
action:function(){

clientData.answers.people="3-4";

nextLiving();

}

},



{
text:"5-6 человек",
action:function(){

clientData.answers.people="5-6";

nextLiving();

}

},



{
text:"Более 6 человек",
action:function(){

clientData.answers.people="6+";

nextLiving();

}

}


]);


}




function nextLiving(){


addMessage(
"Как часто вы проживаете или планируете проживать в доме?"
);



showButtons([


{
text:"🏡 Постоянно",

action:function(){

clientData.answers.living="Постоянно";

finishQuestion();

}

},


{
text:"🌿 Сезонно",

action:function(){

clientData.answers.living="Сезонно";

finishQuestion();

}

}



]);


}



// ========================================
// Услуги
// ========================================


function serviceMenu(){


addMessage(
"Какая услуга вас интересует?"
);


showButtons([


{
text:"💧 Дренаж",

action:function(){

clientData.answers.service="Дренаж";

finishQuestion();

}

},


{
text:"🌧 Водоотведение",

action:function(){

clientData.answers.service="Водоотведение";

finishQuestion();

}

},


{
text:"🔧 Обслуживание",

action:function(){

clientData.answers.service="Обслуживание";

finishQuestion();

}

}


]);


}



// ========================================
// Авария
// ========================================


function emergencyDialog(){


addMessage(

"Опишите ситуацию. Что произошло?"

);


}




// ========================================
// Проблема существующей системы
// ========================================


function problemDialog(){


addMessage(

"Расскажите, какая проблема возникла с вашей системой?"

);


}




// ========================================
// Завершение
// ========================================


function finishQuestion(){


addMessage(

"Спасибо! Осталось оставить ваши контактные данные, чтобы специалист мог связаться с вами."

);


showButtons([]);


}



// ========================================
// Отправка текста клиента
// ========================================


sendButton.onclick=function(){


let text=inputField.value.trim();


if(text==="") return;



addMessage(text,"client");


inputField.value="";



// сюда позже подключим Albato webhook



console.log(clientData);


};

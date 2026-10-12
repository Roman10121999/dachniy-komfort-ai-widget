// ======================================
// ИИ-ПОМОЩНИК ДАЧНЫЙ КОМФОРТ
// Widget Core V2.0
// ======================================


// ------------------------------
// Элементы страницы
// ------------------------------

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


// ------------------------------
// Состояние
// ------------------------------

let isOpen = false;

let started = false;


// ------------------------------
// Открытие / закрытие окна
// ------------------------------

chatWindow.style.display = "none";


chatButton.onclick = function(){

    isOpen = !isOpen;


    if(isOpen){

        chatWindow.style.display = "block";


        if(!started){

            startAssistant();

            started = true;

        }


    } else {


        chatWindow.style.display = "none";

    }

};



// ------------------------------
// Добавление сообщения
// ------------------------------

function addMessage(text, type="assistant"){


    let message = document.createElement("div");


    message.className =
        "message " + type;


    message.innerText = text;


    messagesBox.appendChild(message);


    messagesBox.scrollTop =
        messagesBox.scrollHeight;

}



// ------------------------------
// Кнопки сценариев
// ------------------------------

function createButton(text, callback){


    let btn=document.createElement("button");


    btn.className="scenario-button";


    btn.innerText=text;


    btn.onclick=callback;


    buttonsBox.appendChild(btn);

}



// очистка кнопок

function clearButtons(){

    buttonsBox.innerHTML="";

}



// ------------------------------
// Первый запуск
// ------------------------------

function startAssistant(){


    addMessage(
        "Здравствуйте! 👋\nЯ ИИ-помощник компании «Дачный комфорт».\n\nПомогу подобрать оборудование, ответить на вопросы или принять заявку."
    );


    createButton(
        "🏠 Купить оборудование",
        function(){

            addMessage(
                "Отлично! Какое оборудование вас интересует?"
            );


            clearButtons();


            createButton(
                "♻️ Автономная канализация",
                ()=>addMessage("Вы выбрали автономную канализацию")
            );


            createButton(
                "🚽 Септик",
                ()=>addMessage("Вы выбрали септик")
            );


            createButton(
                "🛢 Накопительная емкость",
                ()=>addMessage("Вы выбрали накопительную емкость")
            );


        }
    );



    createButton(
        "🔧 Услуги",
        function(){

            addMessage(
                "Расскажите, какая услуга вам нужна?"
            );

        }
    );



    createButton(
        "⚠️ Аварийная ситуация",
        function(){

            addMessage(
                "Опишите, пожалуйста, что произошло."
            );

        }
    );



    createButton(
        "❓ Задать вопрос",
        function(){

            addMessage(
                "Напишите ваш вопрос, я помогу разобраться."
            );

        }
    );


}

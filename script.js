// ==========================================
// ИИ-ПОМОЩНИК ДАЧНЫЙ КОМФОРТ
// AI Assistant Widget V4.1 FINAL
// Frontend Client
// ==========================================



// ==========================================
// ALBATO WEBHOOK
// ==========================================


const ALBATO_WEBHOOK_URL =
"https://h.albato.ru/wh/38/1lf2f6v/_6fxBemtxuMWEUMK8RtHU2n8WCC4U8Vb-uDcVZbsdlA/";

const TOP3_WEBHOOK_URL =
"https://h.albato.ru/wh/38/1lf2f6v/k24CiuQE_9MNAkLQa0fJJRGduEENH0zP9fA2gQg5WIU/";




// ==========================================
// ЭЛЕМЕНТЫ
// ==========================================


const chatButton =
document.getElementById(
"ai-widget-button"
);



const chatWindow =
document.getElementById(
"ai-widget-window"
);



const chatHistory =
document.getElementById(
"chat-history"
);



const optionsPanel =
document.getElementById(
"options-panel"
);



const productsContainer =
document.getElementById(
"products-container"
);



const typingIndicator =
document.getElementById(
"typing-indicator"
);



const userInput =
document.getElementById(
"user-input"
);



const sendButton =
document.getElementById(
"send-button"
);




// ==========================================
// SESSION
// ==========================================


const session = {


session_id:

"dc_" + Date.now(),



messages: [],



client_data:{},



intent:null,



status:null


};





// ==========================================
// СОСТОЯНИЕ
// ==========================================


let isOpen=false;



let aiStarted=false;





// ==========================================
// ОТКРЫТИЕ / ЗАКРЫТИЕ
// ==========================================


chatWindow.style.display="none";




chatButton.onclick=function(){



isOpen=!isOpen;




if(isOpen){



chatWindow.style.display="flex";




if(!aiStarted){



startAssistant();


aiStarted=true;


}




}else{



chatWindow.style.display="none";



}



};






// ==========================================
// СТАРТ AI
// ==========================================


function startAssistant(){



addAIMessage(

"Здравствуйте! 👋\n\n"+
"Я ИИ-помощник компании «Дачный комфорт».\n\n"+
"Помогу подобрать оборудование, "+
"ответить на вопросы или оформить заявку."

);



showAIButtons([


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






// ==========================================
// СООБЩЕНИЕ AI
// ==========================================


function addAIMessage(text){



createMessage(
text,
"assistant"
);



session.messages.push({

role:"assistant",

content:text

});



}






// ==========================================
// СООБЩЕНИЕ КЛИЕНТА
// ==========================================


function addClientMessage(text){



createMessage(
text,
"client"
);



session.messages.push({

role:"user",

content:text

});


}





// ==========================================
// СОЗДАНИЕ BUBBLE
// ==========================================


function createMessage(
text,
type
){



let message =
document.createElement("div");



message.className =
"message " + type;



message.innerText = text;
message.style.whiteSpace = "pre-line";



chatHistory.appendChild(
message
);



chatHistory.scrollTop =
chatHistory.scrollHeight;



}
// ==========================================
// ОТПРАВКА СООБЩЕНИЯ AI
// Widget → Albato → GigaChat
// ==========================================



// ==========================================
// ОТПРАВКА СООБЩЕНИЯ AI
// Widget → Albato → GigaChat
// ==========================================

// Автоматическая высота — только если поле является textarea.
// Для обычного input стили высоты не меняем.
function resizeUserInput() {
  if (!userInput || userInput.tagName !== "TEXTAREA") {
    return;
  }

  userInput.style.height = "auto";
  userInput.style.height =
    Math.min(userInput.scrollHeight, 180) + "px";

  userInput.style.overflowY =
    userInput.scrollHeight > 180 ? "auto" : "hidden";
}

// Одна функция отправки для кнопки и клавиатуры.
function sendUserMessage() {
  let text = userInput.value.trim();

  if (text === "") {
    return;
  }

  // Убираем стартовые кнопки после собственного сообщения клиента.
  if (optionsPanel) {
    optionsPanel.innerHTML = "";
  }

  addClientMessage(text);

  userInput.value = "";

  // Возвращаем исходную высоту, если используется textarea.
  resizeUserInput();

  sendToAI(text);
}

// Существующая кнопка отправки.
sendButton.onclick = sendUserMessage;

// Enter отправляет сообщение.
// Ctrl+Enter и Shift+Enter оставляют перенос строки по умолчанию.
userInput.addEventListener("keydown", function(event) {
  if (
    event.key === "Enter" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  ) {
    event.preventDefault();
    sendUserMessage();
  }
});

// Автоувеличение включается только для textarea.
// Не меняем размеры обычного input.
if (userInput && userInput.tagName === "TEXTAREA") {
  userInput.addEventListener("input", resizeUserInput);
  resizeUserInput();
}





// ==========================================
// ОТПРАВКА В ALBATO
// ==========================================


async function sendToAI(message){



showTyping();



const payload={


session_id:
session.session_id,


message:
message,


history:
session.messages,


client_data:
session.client_data


};




console.log(
"ALBATO REQUEST:",
payload
);




try{



const response =
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






const rawResponse = await response.text();

let result;

try {
    // Обычный корректный JSON обрабатываем без изменений.
    result = JSON.parse(rawResponse);

} catch (parseError) {
    // Если в JSON внутри текстового поля оказались
    // необработанные управляющие символы, исправляем
    // только их внутри строковых значений.
    let repaired = "";
    let insideString = false;
    let escaped = false;

    for (const char of rawResponse) {
        const code = char.charCodeAt(0);

        if (!insideString) {
            repaired += char;

            if (char === '"') {
                insideString = true;
            }

            continue;
        }

        if (code < 32) {
            repaired += "\\u" +
                code.toString(16).padStart(4, "0");
            escaped = false;
            continue;
        }

        repaired += char;

        if (escaped) {
            escaped = false;
        } else if (char === "\\") {
            escaped = true;
        } else if (char === '"') {
            insideString = false;
        }
    }

    // Если ответ повреждён сильнее, ошибка попадёт
    // в существующий catch функции sendToAI().
    result = JSON.parse(repaired);
}




console.log(
"ALBATO RESPONSE:",
result
);




hideTyping();



handleAIResponse(result);



}




catch(error){



console.error(
"ALBATO ERROR:",
error
);



hideTyping();



addAIMessage(

"Не удалось получить ответ. Попробуйте ещё раз."

);



}



}





// ==========================================
// ОБРАБОТКА ОТВЕТА AI
// ==========================================



function handleAIResponse(data){



console.log(
"AI DATA:",
data
);





// если пришёл обычный текст


if(typeof data==="string"){


addAIMessage(data);


return;


}





// основной формат


if(data.assistant_message){


addAIMessage(
data.assistant_message
);


}




// альтернативный формат


if(data.answer){


addAIMessage(
data.answer
);


}




// сохраняем intent


if(data.intent){


session.intent =
data.intent;


}





// сохраняем статус


if(data.status){


session.status =
data.status;


}





// данные клиента


if(data.client_data){


session.client_data =
{


...session.client_data,


...data.client_data


};


}





// кнопки AI


if(data.buttons){


showAIButtons(
data.buttons
);


}






    // TOP-3 товары из ответа Workflow 1
    if (data.products) {
        showProducts(data.products);
    }

    // Получаем TOP-3 из Workflow 3 после выбора оборудования
    if (
        session.intent === "BUY_PRODUCT" &&
        !top3Received
    ) {
        pollTop3();
    }
}








// ==========================================
// КНОПКИ AI
// ==========================================



function showAIButtons(buttons){



optionsPanel.innerHTML="";





buttons.forEach(
buttonData=>{



let button =
document.createElement(
"button"
);



button.className =
"scenario-button";



button.innerText =
buttonData.text;



button.onclick=function(){



addClientMessage(
buttonData.text
);



optionsPanel.innerHTML="";



sendToAI(
buttonData.value
);



};



optionsPanel.appendChild(
button
);



}

);



}







// ==========================================
// ИНДИКАТОР ПЕЧАТИ
// ==========================================



function showTyping(){



if(typingIndicator){


typingIndicator.innerText =
"ИИ-помощник печатает...";


}



}





function hideTyping(){



if(typingIndicator){


typingIndicator.innerText =
"";


}



}
// ==========================================
// ЧАСТЬ 3/3
// TOP-3 + CONTACTS + LEAD
// ==========================================




// ==========================================
// TOP-3 ТОВАРЫ
// ==========================================


function showProducts(products) {
    if (!productsContainer || !Array.isArray(products)) {
        return;
    }

    productsContainer.innerHTML = "";

    const title = document.createElement("div");
    title.className = "products-title";
    title.innerText = "Подобрал для вас подходящие варианты 👇";
    productsContainer.appendChild(title);

    const validProducts = products
        .map(product => ({
            model: product.model || product.name || "",
            series: product.series || "",
            price: product.price || "",
            performance: product.performance || product.description || "",
            users: product.users || "",
            electricity: product.electricity || "",
            reason: product.reason || ""
        }))
        .filter(product => product.model.trim() !== "")
        .slice(0, 3);

    validProducts.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const medals = ["🥇", "🥈", "🥉"];

        const heading = document.createElement("div");
        heading.className = "product-name";
        heading.innerText = `${medals[index]} ${product.model}`;
        card.appendChild(heading);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "14px";

        const rows = [
            ["Серия", product.series],
            ["Цена оборудования", product.price],
            ["Производительность", product.performance],
            ["Количество пользователей", product.users],
            ["Электричество", product.electricity],
            ["Почему подходит", product.reason]
        ];

        rows.forEach(([label, value]) => {
            if (!value || !String(value).trim()) {
                return;
            }

            const row = document.createElement("tr");

            const labelCell = document.createElement("th");
            labelCell.innerText = label;
            labelCell.style.textAlign = "left";
            labelCell.style.verticalAlign = "top";
            labelCell.style.padding = "8px";
            labelCell.style.width = "40%";
            labelCell.style.borderBottom = "1px solid #e5e7eb";
            labelCell.style.color = "#52615c";

            const valueCell = document.createElement("td");
            valueCell.innerText = String(value);
            valueCell.style.padding = "8px";
            valueCell.style.verticalAlign = "top";
            valueCell.style.borderBottom = "1px solid #e5e7eb";
            valueCell.style.overflowWrap = "anywhere";

            row.appendChild(labelCell);
            row.appendChild(valueCell);
            table.appendChild(row);
        });

        card.appendChild(table);

        card.style.background = "#ffffff";
        card.style.border = "1px solid #dce7e2";
        card.style.borderRadius = "12px";
        card.style.padding = "14px";
        card.style.marginBottom = "14px";
        card.style.boxShadow = "0 2px 7px rgba(0,0,0,0.05)";

        productsContainer.appendChild(card);
    });

    if (validProducts.length === 0) {
        const message = document.createElement("div");
        message.innerText = "Пока не удалось отобразить модели. Попробуйте проверить подбор чуть позже.";
        productsContainer.appendChild(message);
    }
}




let top3Polling = false;
let top3Received = false;

async function pollTop3() {
    if (top3Polling || top3Received) {
        return;
    }

    top3Polling = true;

    try {
        for (let attempt = 0; attempt < 24; attempt++) {
            if (attempt > 0) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            let response;

            try {
                response = await fetch(TOP3_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_id: session.session_id
                    })
                });
            } catch (error) {
                console.error("TOP-3 connection error:", error);
                continue;
            }

            if (!response.ok) {
                console.error("TOP-3 HTTP error:", response.status);
                continue;
            }

            let result;

            try {
                result = await response.json();
            } catch (error) {
                console.error("TOP-3 response is not JSON:", error);
                continue;
            }

            console.log("TOP-3 RESPONSE:", result);

            if (result.session_id !== session.session_id) {
                console.error("TOP-3 session_id mismatch");
                return;
            }

            if (result.scenario2_status !== "RESULT_READY") {
                continue;
            }

            let parsedModels;

            try {
                parsedModels =
                    typeof result.recommended_models_json === "string"
                        ? JSON.parse(result.recommended_models_json)
                        : result.recommended_models_json;
            } catch (error) {
                console.error("TOP-3 models JSON error:", error);
                continue;
            }

            const products = Array.isArray(parsedModels)
                ? parsedModels
                : parsedModels?.recommended_models;

            if (!Array.isArray(products) || products.length === 0) {
                console.error("TOP-3 models are empty or invalid");
                continue;
            }

            const validProducts = products.filter(product =>
                product &&
                typeof product.model === "string" &&
                product.model.trim() !== ""
            );

            if (validProducts.length === 0) {
                console.error("TOP-3 contains no valid models");
                continue;
            }

            showProducts(validProducts);
            top3Received = true;
            return;
        }

        addAIMessage(
            "Подбор занимает больше времени, чем обычно. " +
            "Пожалуйста, напишите «Проверить подбор», и я попробую получить результат ещё раз."
        );
    } finally {
        top3Polling = false;
    }
}


// ==========================================
// СОХРАНЕНИЕ ДАННЫХ КЛИЕНТА
// ==========================================



function saveClientData(
key,
value
){



session.client_data[key]=value;



console.log(
"CLIENT DATA:",
session.client_data
);



}






// ==========================================
// ФИНАЛЬНЫЙ LEAD
// ==========================================


function createLead(){



const lead = {


session_id:
session.session_id,


intent:
session.intent,


status:
"READY",


messages:
session.messages,


client:
session.client_data



};



console.log(
"FINAL LEAD:",
lead
);



return lead;


}







// ==========================================
// ЗАПРОС КОНТАКТОВ
// ==========================================


function requestContacts(){



addAIMessage(

"Спасибо 👍\n\n"+
"Чтобы специалист мог подготовить предложение, "+
"оставьте ваши контактные данные."

);



addAIMessage(

"Как вас зовут?"

);



session.contactStep =
"NAME";


}








// ==========================================
// ОБРАБОТКА КОНТАКТОВ
// ==========================================


function processContact(text){



if(
session.contactStep==="NAME"
){


saveClientData(
"name",
text
);



session.contactStep="PHONE";



addAIMessage(
"Укажите ваш номер телефона."
);



return;


}






if(
session.contactStep==="PHONE"
){


saveClientData(
"phone",
text
);



session.contactStep="LOCATION";



addAIMessage(
"Где находится объект?"
);



return;


}





if(
session.contactStep==="LOCATION"
){


saveClientData(
"location",
text
);



addAIMessage(

"Спасибо 👍\n"+
"Заявка передана специалисту."

);



createLead();



session.contactStep=null;



}



}





// ==========================================
// ЭКСПОРТ ДЛЯ ПРОВЕРКИ
// ==========================================


console.log(
"AI Widget V4.1 Loaded"
);

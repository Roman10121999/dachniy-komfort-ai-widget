// ==========================================
// ИИ-ПОМОЩНИК "ДАЧНЫЙ КОМФОРТ"
// Widget Core V3.0
// AI Lead Qualifier Frontend
// По таблице AI_DIALOG_MAP FINAL v3
// ==========================================


// ==========================================
// ЭЛЕМЕНТЫ
// ==========================================


const chatButton =
document.getElementById("ai-widget-button");


const chatWindow =
document.getElementById("ai-widget-window");


const messagesBox =
document.getElementById("chat-messages");


const buttonsBox =
document.getElementById("scenario-buttons");


const inputField =
document.getElementById("user-input");


const sendButton =
document.getElementById("send-button");



// ==========================================
// СОСТОЯНИЕ WIDGET
// ==========================================


let opened = false;


let started = false;


// текущая ветка

let currentBranch = "START";


// история

let history = [];


// SESSION для Albato

let SESSION = {


    session_id:
    "session_" + Date.now(),


    intent:null,


    product_category:null,


    service_type:null,


    users:null,


    seasonality:null,


    electricity_status:null,


    budget:null,


    requested_model:null,


    soil_known:null,


    existing_communications:null,


    purpose:null,


    volume:null,


    dimensions:null,


    well_status:null,


    object_type:null,


    load:null,


    problem_type:null,


    client_comment:null,


    client_name:null,


    client_phone:null,


    location:null

};




// ==========================================
// ОТКРЫТИЕ / ЗАКРЫТИЕ
// ==========================================


chatWindow.style.display="none";



chatButton.onclick=function(){


opened=!opened;



if(opened){


chatWindow.style.display="flex";



if(!started){


startAssistant();


started=true;


}



}else{


chatWindow.style.display="none";


}



};





// ==========================================
// ДОБАВЛЕНИЕ СООБЩЕНИЙ
// ==========================================



function addMessage(text,type="assistant"){



let div=document.createElement("div");



div.className=
"message "+type;



div.innerText=text;



messagesBox.appendChild(div);



history.push({

role:type,

message:text

});



messagesBox.scrollTop=
messagesBox.scrollHeight;



}




// ==========================================
// СООБЩЕНИЕ КЛИЕНТА
// ==========================================


function clientMessage(text){


addMessage(
text,
"client"
);


}





// ==========================================
// КНОПКИ
// ==========================================


function clearButtons(){


buttonsBox.innerHTML="";


}



function createButton(
text,
callback
){


let button=
document.createElement("button");


button.className=
"scenario-button";


button.innerText=text;



button.onclick=function(){


clientMessage(text);



clearButtons();



callback();



};



buttonsBox.appendChild(button);


}





// ==========================================
// НАЗАД
// ==========================================


function backButton(callback){


createButton(
"⬅️ Назад",
callback
);


}





// ==========================================
// ПЕРЕДАЧА SESSION
// ==========================================


function setField(
field,
value
){


SESSION[field]=value;



console.log(
"SESSION UPDATE",
SESSION
);


}





// ==========================================
// ТЕКСТОВЫЙ ВВОД
// ==========================================


sendButton.onclick=function(){


let text =
inputField.value.trim();



if(text==="")
return;



clientMessage(text);



inputField.value="";



// аварийная ветка

if(currentBranch==="EMERGENCY"){


setField(
"client_comment",
text
);


showContacts();


return;

}



// обычный вопрос

addMessage(
"Спасибо 👍 Я учту информацию."
);



};
// ==========================================
// СЦЕНАРИИ
// ЧАСТЬ 2
// START + BUY_PRODUCT
// ==========================================


// ==========================================
// СТАРТОВОЕ МЕНЮ
// ==========================================


function startAssistant(){


currentBranch="START";


addMessage(
"👋 Здравствуйте!\n\nЯ ИИ-помощник компании «Дачный комфорт».\n\nПомогу подобрать оборудование, решить проблему или выбрать услугу."
);


showStartMenu();


}




function showStartMenu(){


clearButtons();


currentBranch="START";



createButton(
"🏠 Купить оборудование",
function(){

setField(
"intent",
"BUY_PRODUCT"
);


showProductCategories();


}

);



createButton(
"🔧 Заказать услугу",
function(){

setField(
"intent",
"SERVICE"
);


showServices();


}

);



createButton(
"🛠 Уже есть система, нужна помощь",
function(){

setField(
"intent",
"EXISTING_PROBLEM"
);


showProblems();


}

);



createButton(
"⚠️ Аварийная ситуация",
function(){

setField(
"intent",
"EMERGENCY"
);


currentBranch="EMERGENCY";


addMessage(
"Опишите, что произошло ⚠️"
);


}

);


}




// ==========================================
// КАТЕГОРИИ ОБОРУДОВАНИЯ
// ==========================================


function showProductCategories(){


currentBranch="BUY_PRODUCT";


addMessage(
"Какое оборудование вас интересует?"
);



clearButtons();



createButton(
"💧 Автономная канализация",
function(){

setField(
"product_category",
"СБО"
);


showSBO();


}

);



createButton(
"🚽 Септик",
function(){

setField(
"product_category",
"СЕПТИК"
);


showSeptic();


}

);



createButton(
"🛢 Накопительная емкость",
function(){

setField(
"product_category",
"НАКОПИТЕЛЬ"
);


showStorage();


}

);



createButton(
"🏠 Погреб",
function(){

setField(
"product_category",
"ПОГРЕБ"
);


showCellar();


}

);



createButton(
"🔧 Кессон",
function(){

setField(
"product_category",
"КЕССОН"
);


showCaisson();


}

);



createButton(
"🍴 Жироуловитель",
function(){

setField(
"product_category",
"ЖИРОУЛАВЛИВАТЕЛЬ"
);


showGrease();


}

);



createButton(
"🏭 Промышленная установка",
function(){

setField(
"product_category",
"ПРОМ_УСТАНОВКИ"
);


showIndustrial();


}

);



backButton(
showStartMenu
);


}





// ==========================================
// ВЕТКА СБО
// Автономная канализация
// ==========================================


function showSBO(){


currentBranch="СБО";


addMessage(
"Сколько человек будет пользоваться системой?"
);



clearButtons();



createButton(
"1-2",
()=>showSeasonality("1-2")
);


createButton(
"3-4",
()=>showSeasonality("3-4")
);


createButton(
"5-6",
()=>showSeasonality("5-6")
);


createButton(
"7-8",
()=>showSeasonality("7-8")
);


createButton(
"Более 8",
()=>showSeasonality("Более 8")
);


}




function showSeasonality(value){


setField(
"users",
value
);


addMessage(
"Как планируете использовать дом?"
);



clearButtons();



createButton(
"🏡 Постоянно",
()=>showElectricity("Постоянно")
);


createButton(
"🌿 Сезонно",
()=>showElectricity("Сезонно")
);


}




function showElectricity(value){


setField(
"seasonality",
value
);



addMessage(
"Есть ли электричество на участке?"
);



clearButtons();



createButton(
"⚡ Есть",
()=>showSoil("Есть")
);


createButton(
"🔌 Нет",
()=>showSoil("Нет")
);


createButton(
"⏳ Планируется",
()=>showSoil("Планируется")
);


}



function showSoil(value){


setField(
"electricity_status",
value
);



addMessage(
"Знаете особенности участка?"
);



clearButtons();



createButton(
"Да",
()=>showCommunications("Да")
);


createButton(
"Нет",
()=>showCommunications("Нет")
);



}



function showCommunications(value){


setField(
"soil_known",
value
);



addMessage(
"Есть ли существующие коммуникации?"
);



clearButtons();



createButton(
"🏠 Дом готов",
()=>showModel("Дом готов")
);



createButton(
"🏗 Строится",
()=>showModel("Строится")
);



createButton(
"📌 Планируется",
()=>showModel("Планируется")
);



}



function showModel(value){


setField(
"existing_communications",
value
);



addMessage(
"Какую модель рассматриваете?"
);



clearButtons();



createButton(
"Название модели",
()=>showBudget("Название модели")
);



createButton(
"Не знаю",
()=>showBudget("Не знаю")
);



}



function showBudget(value){


setField(
"requested_model",
value
);



addMessage(
"Какой бюджет рассматриваете?"
);



clearButtons();



createButton(
"До 200 000 ₽",
()=>finishQualification("До 200 000 ₽")
);



createButton(
"200 000 - 300 000 ₽",
()=>finishQualification("200 000 - 300 000 ₽")
);



createButton(
"Более 300 000 ₽",
()=>finishQualification("Более 300 000 ₽")
);



}



function finishQualification(value){


setField(
"budget",
value
);



addMessage(
"Спасибо 👍 Подготовлю подходящие варианты."
);



showContacts();


}
// ==========================================
// ЧАСТЬ 3
// Остальные товарные ветки + услуги + проблемы
// ==========================================


// ==========================================
// СЕПТИК
// ==========================================

function showSeptic(){

currentBranch="СЕПТИК";

addMessage(
"Сколько человек будет пользоваться?"
);

clearButtons();


createButton(
"1-2",
()=>septicUsers("1-2")
);

createButton(
"3-4",
()=>septicUsers("3-4")
);

createButton(
"5-6",
()=>septicUsers("5-6")
);

createButton(
"7-8",
()=>septicUsers("7-8")
);

backButton(showProductCategories);

}



function septicUsers(value){

setField(
"users",
value
);


addMessage(
"Как часто проживаете?"
);


clearButtons();


createButton(
"🏡 Постоянно",
()=>septicSeason("Постоянно")
);


createButton(
"🌿 Сезонно",
()=>septicSeason("Сезонно")
);


}



function septicSeason(value){

setField(
"seasonality",
value
);


addMessage(
"Есть ли электричество?"
);


clearButtons();


createButton(
"⚡ Есть",
()=>septicElectricity("Есть")
);


createButton(
"🔌 Нет",
()=>septicElectricity("Нет")
);


}



function septicElectricity(value){

setField(
"electricity_status",
value
);


addMessage(
"Спасибо 👍 Подготовлю подбор."
);


showContacts();

}



// ==========================================
// НАКОПИТЕЛЬ
// ==========================================


function showStorage(){

currentBranch="НАКОПИТЕЛЬ";


addMessage(
"Для чего нужна накопительная емкость?"
);


clearButtons();


createButton(
"🏠 Дом",
()=>storagePurpose("Дом")
);


createButton(
"🌿 Дача",
()=>storagePurpose("Дача")
);


createButton(
"🏢 Другой объект",
()=>storagePurpose("Другой объект")
);


}



function storagePurpose(value){

setField(
"purpose",
value
);


addMessage(
"Какой объем нужен?"
);


clearButtons();


createButton(
"До 3 м³",
()=>storageVolume("До 3 м³")
);


createButton(
"3-5 м³",
()=>storageVolume("3-5 м³")
);


createButton(
"5-10 м³",
()=>storageVolume("5-10 м³")
);


createButton(
"Не знаю",
()=>storageVolume("Не знаю")
);


}



function storageVolume(value){

setField(
"volume",
value
);


addMessage(
"Спасибо 👍 Подготовлю варианты."
);


showContacts();

}




// ==========================================
// ПОГРЕБ
// ==========================================


function showCellar(){

currentBranch="ПОГРЕБ";


addMessage(
"Для чего нужен погреб?"
);


clearButtons();


createButton(
"🥫 Хранение продуктов",
()=>cellarPurpose("Хранение продуктов")
);


createButton(
"🌿 Дача",
()=>cellarPurpose("Дача")
);


createButton(
"Другое",
()=>cellarPurpose("Другое")
);


}



function cellarPurpose(value){

setField(
"purpose",
value
);


addMessage(
"Какой размер нужен?"
);


clearButtons();


createButton(
"Компактный",
()=>cellarSize("Компактный")
);


createButton(
"Средний",
()=>cellarSize("Средний")
);


createButton(
"Большой",
()=>cellarSize("Большой")
);


createButton(
"Не знаю",
()=>cellarSize("Не знаю")
);


}



function cellarSize(value){

setField(
"dimensions",
value
);


showContacts();

}




// ==========================================
// КЕССОН
// ==========================================


function showCaisson(){

currentBranch="КЕССОН";


addMessage(
"Для чего нужен кессон?"
);


clearButtons();


createButton(
"💧 Для скважины",
()=>caissonPurpose("Для скважины")
);


createButton(
"⚙️ Для оборудования",
()=>caissonPurpose("Для оборудования")
);


createButton(
"Не знаю",
()=>caissonPurpose("Не знаю")
);


}



function caissonPurpose(value){

setField(
"purpose",
value
);


addMessage(
"Скважина уже есть?"
);


clearButtons();


createButton(
"Да",
()=>caissonWell("Да")
);


createButton(
"Планируется",
()=>caissonWell("Планируется")
);


}



function caissonWell(value){

setField(
"well_status",
value
);


showContacts();

}




// ==========================================
// ЖИРОУЛОВИТЕЛЬ
// ==========================================


function showGrease(){

currentBranch="ЖИРОУЛАВЛИВАТЕЛЬ";


addMessage(
"Для какого объекта нужен жироуловитель?"
);


clearButtons();


createButton(
"🏠 Дом",
()=>greaseObject("Дом")
);


createButton(
"☕ Кафе",
()=>greaseObject("Кафе")
);


createButton(
"🍽 Ресторан",
()=>greaseObject("Ресторан")
);


createButton(
"🏭 Производство",
()=>greaseObject("Производство")
);


}



function greaseObject(value){

setField(
"object_type",
value
);


addMessage(
"Какая нагрузка?"
);


clearButtons();


createButton(
"Небольшая",
()=>greaseLoad("Небольшая")
);


createButton(
"Средняя",
()=>greaseLoad("Средняя")
);


createButton(
"Большая",
()=>greaseLoad("Большая")
);


createButton(
"Не знаю",
()=>greaseLoad("Не знаю")
);


}



function greaseLoad(value){

setField(
"load",
value
);


showContacts();

}



// ==========================================
// ПРОМЫШЛЕННАЯ УСТАНОВКА
// ==========================================


function showIndustrial(){

currentBranch="ПРОМ_УСТАНОВКИ";


addMessage(
"Какой объект?"
);


clearButtons();


createButton(
"База отдыха",
()=>industrialObject("База отдыха")
);


createButton(
"Производство",
()=>industrialObject("Производство")
);


createButton(
"Ресторан",
()=>industrialObject("Ресторан")
);


createButton(
"Другое",
()=>industrialObject("Другое")
);


}



function industrialObject(value){

setField(
"object_type",
value
);


addMessage(
"Количество пользователей?"
);


clearButtons();


createButton(
"Указать количество",
()=>industrialUsers()
);


}



function industrialUsers(){

setField(
"users",
"Указано клиентом"
);


showContacts();

}
// ==========================================
// ЧАСТЬ 4
// SERVICE + EXISTING_PROBLEM + CONTACTS
// + подготовка Albato
// ==========================================



// ==========================================
// УСЛУГИ
// ==========================================


function showServices(){


currentBranch="SERVICE";


addMessage(
"Какая услуга вас интересует?"
);


clearButtons();



createButton(
"🔧 Монтаж оборудования",
function(){

setField(
"service_type",
"МОНТАЖ"
);

serviceComment();

}

);



createButton(
"🛠 Обслуживание системы",
function(){

setField(
"service_type",
"ОБСЛУЖИВАНИЕ"
);

serviceComment();

}

);



createButton(
"🌱 Дренаж участка",
function(){

setField(
"service_type",
"ДРЕНАЖ"
);

serviceComment();

}

);



createButton(
"🌧 Водоотведение",
function(){

setField(
"service_type",
"ВОДООТВЕДЕНИЕ"
);

serviceComment();

}

);



createButton(
"💬 Консультация специалиста",
function(){

setField(
"service_type",
"КОНСУЛЬТАЦИЯ"
);

serviceComment();

}

);



backButton(
showStartMenu
);


}




function serviceComment(){


addMessage(
"Расскажите подробнее о вашей задаче."
);


currentBranch="SERVICE_COMMENT";


}



// ==========================================
// ПРОБЛЕМА СУЩЕСТВУЮЩЕЙ СИСТЕМЫ
// ==========================================


function showProblems(){


currentBranch="EXISTING_PROBLEM";


addMessage(
"Какая проблема возникла с вашей системой?"
);



clearButtons();



createButton(
"🔧 Ремонт",
function(){

problemSelect(
"РЕМОНТ"
);

}

);



createButton(
"🛠 Обслуживание",
function(){

problemSelect(
"ОБСЛУЖИВАНИЕ"
);

}

);



createButton(
"🔍 Диагностика",
function(){

problemSelect(
"ДИАГНОСТИКА"
);

}

);



createButton(
"❓ Другая проблема",
function(){

problemSelect(
"ДРУГАЯ_ПРОБЛЕМА"
);

}

);



backButton(
showStartMenu
);


}



function problemSelect(value){


setField(
"problem_type",
value
);


addMessage(
"Опишите, пожалуйста, проблему подробнее."
);


currentBranch="PROBLEM_COMMENT";


}



// ==========================================
// АВАРИЙНАЯ СИТУАЦИЯ
// ==========================================


function emergencyStart(){


currentBranch="EMERGENCY";


addMessage(
"⚠️ Опишите аварийную ситуацию.\n\nНапример: перелив, затопило участок, система перестала работать."
);


}




// ==========================================
// ОБРАБОТКА ТЕКСТОВЫХ ОТВЕТОВ
// ==========================================


sendButton.onclick=function(){


let text =
inputField.value.trim();



if(text==="")
return;



clientMessage(text);



inputField.value="";




// авария

if(currentBranch==="EMERGENCY"){


setField(
"client_comment",
text
);


showContacts();


return;

}



// проблема

if(currentBranch==="PROBLEM_COMMENT"){


setField(
"client_comment",
text
);


showContacts();


return;

}



// услуга

if(currentBranch==="SERVICE_COMMENT"){


setField(
"client_comment",
text
);


showContacts();


return;

}



};




// ==========================================
// КОНТАКТЫ
// ==========================================


function showContacts(){


currentBranch="CONTACTS";


clearButtons();



addMessage(
"Спасибо 👍\n\nЧтобы специалист мог связаться с вами, оставьте контактные данные."
);



addMessage(
"Как вас зовут?"
);



}



// временное хранение этапа контактов

let contactStep="NAME";





// ==========================================
// ОБНОВЛЯЕМ ОБРАБОТКУ ТЕКСТА
// ==========================================


function processContact(text){


if(contactStep==="NAME"){


setField(
"client_name",
text
);


contactStep="PHONE";


addMessage(
"Укажите ваш телефон."
);


return;

}



if(contactStep==="PHONE"){


setField(
"client_phone",
text
);


contactStep="LOCATION";


addMessage(
"Укажите населённый пункт или адрес объекта."
);


return;

}



if(contactStep==="LOCATION"){


setField(
"location",
text
);



finishRequest();


return;

}



}




// ==========================================
// ФИНАЛ
// ==========================================


function finishRequest(){


addMessage(
"Спасибо 👍 Заявка принята.\nСпециалист свяжется с вами в ближайшее время."
);



console.log(
"ГОТОВО ДЛЯ ALBATO:",
SESSION
);


// здесь подключаем webhook Albato


}





// ==========================================
// ПЕРЕХВАТ ТЕКСТА
// ==========================================


const oldSend =
sendButton.onclick;



sendButton.onclick=function(){


let text =
inputField.value.trim();



if(text==="")
return;



inputField.value="";



clientMessage(text);



if(currentBranch==="CONTACTS"){

processContact(text);

return;

}



if(
currentBranch==="EMERGENCY" ||
currentBranch==="PROBLEM_COMMENT" ||
currentBranch==="SERVICE_COMMENT"
){


setField(
"client_comment",
text
);


showContacts();


return;

}



};

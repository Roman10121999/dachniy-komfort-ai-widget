```javascript
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

// ==========================================
// ЭЛЕМЕНТЫ
// ==========================================

const chatButton = document.getElementById("ai-widget-button");
const chatWindow = document.getElementById("ai-widget-window");
const chatHistory = document.getElementById("chat-history");
const optionsPanel = document.getElementById("options-panel");
const productsContainer = document.getElementById("products-container");
const typingIndicator = document.getElementById("typing-indicator");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// ==========================================
// SESSION
// ==========================================

const session = {
  session_id: "dc_" + Date.now(),
  messages: [],
  client_data: {},
  intent: null,
  status: null
};

// ==========================================
// СОСТОЯНИЕ
// ==========================================

let isOpen = false;
let aiStarted = false;

// ==========================================
// ОТКРЫТИЕ / ЗАКРЫТИЕ
// ==========================================

chatWindow.style.display = "none";

chatButton.onclick = function() {
  isOpen = !isOpen;

  if (isOpen) {
    chatWindow.style.display = "flex";

    if (!aiStarted) {
      startAssistant();
      aiStarted = true;
    }
  } else {
    chatWindow.style.display = "none";
  }
};

// ==========================================
// СТАРТ AI
// ==========================================

function startAssistant() {
  addAIMessage(
    "Здравствуйте! 👋\n\n" +
    "Я ИИ-помощник компании «Дачный комфорт».\n\n" +
    "Помогу подобрать оборудование, " +
    "ответить на вопросы или оформить заявку."
  );

  showAIButtons([
    {
      text: "🏠 Купить оборудование",
      value: "BUY_PRODUCT"
    },
    {
      text: "🔧 Заказать услугу",
      value: "SERVICE"
    },
    {
      text: "🛠 Уже есть система, нужна помощь",
      value: "EXISTING_PROBLEM"
    },
    {
      text: "⚠️ Аварийная ситуация",
      value: "EMERGENCY"
    }
  ]);
}

// ==========================================
// СООБЩЕНИЕ AI
// ==========================================

function addAIMessage(text) {
  createMessage(text, "assistant");

  session.messages.push({
    role: "assistant",
    content: text
  });
}

// ==========================================
// СООБЩЕНИЕ КЛИЕНТА
// ==========================================

function addClientMessage(text) {
  createMessage(text, "client");

  session.messages.push({
    role: "user",
    content: text
  });
}

// ==========================================
// СОЗДАНИЕ BUBBLE
// ==========================================

function createMessage(text, type) {
  let message = document.createElement("div");

  message.className = "message " + type;
  message.innerText = text;

  // Показываем переносы строк и абзацы.
  message.style.whiteSpace = "pre-line";

  chatHistory.appendChild(message);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// ==========================================
// ПОЛЕ ВВОДА: ОТПРАВКА И АВТОВЫСОТА
// ==========================================

// Автоматическое увеличение высоты только для textarea.
// Если в HTML используется обычный input, его размеры не меняем.
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

// Единая функция отправки для кнопки и клавиатуры.
function sendUserMessage() {
  let text = userInput.value.trim();

  if (text === "") {
    return;
  }

  // Убираем стартовые кнопки, когда клиент написал своё сообщение.
  if (optionsPanel) {
    optionsPanel.innerHTML = "";
  }

  addClientMessage(text);

  userInput.value = "";

  // Возвращаем исходную высоту только для textarea.
  resizeUserInput();

  sendToAI(text);
}

// Сохраняем отправку существующей кнопкой.
sendButton.onclick = sendUserMessage;

// Enter отправляет сообщение.
// Ctrl+Enter и Shift+Enter оставляют стандартный перенос строки.
userInput.addEventListener("keydown", function(event) {
  if (
    event.key === "Enter" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  ) {
    // Для textarea предотвращаем стандартный перенос при Enter.
    event.preventDefault();
    sendUserMessage();
  }
});

// Автовысота включается только для textarea.
if (userInput && userInput.tagName === "TEXTAREA") {
  userInput.style.overflowY = "hidden";
  userInput.addEventListener("input", resizeUserInput);
  resizeUserInput();
}

// ==========================================
// ОТПРАВКА В ALBATO
// Widget → Albato → GigaChat
// ==========================================

async function sendToAI(message) {
  showTyping();

  const payload = {
    session_id: session.session_id,
    message: message,
    history: session.messages,
    client_data: session.client_data
  };

  console.log("ALBATO REQUEST:", payload);

  try {
    const response = await fetch(
      ALBATO_WEBHOOK_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const rawResponse = await response.text();

    let result;

    try {
      // Обычный корректный JSON обрабатываем без изменений.
      result = JSON.parse(rawResponse);

    } catch (parseError) {
      // Исправляем необработанные управляющие символы
      // внутри JSON-строк, если они пришли от Albato.
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

      // Если ответ повреждён сильнее, ошибка обрабатывается
      // внешним catch функции sendToAI().
      result = JSON.parse(repaired);
    }

    console.log("ALBATO RESPONSE:", result);

    hideTyping();

    handleAIResponse(result);

  } catch (error) {
    console.error("ALBATO ERROR:", error);

    hideTyping();

    addAIMessage(
      "Не удалось получить ответ. Попробуйте ещё раз."
    );
  }
}

// ==========================================
// ОБРАБОТКА ОТВЕТА AI
// ==========================================

function handleAIResponse(data) {
  console.log("AI DATA:", data);

  // Если пришёл обычный текст.
  if (typeof data === "string") {
    addAIMessage(data);
    return;
  }

  // Основной формат ответа.
  if (data.assistant_message) {
    addAIMessage(data.assistant_message);
  }

  // Альтернативный формат ответа.
  if (data.answer) {
    addAIMessage(data.answer);
  }

  // Сохраняем intent.
  if (data.intent) {
    session.intent = data.intent;
  }

  // Сохраняем статус.
  if (data.status) {
    session.status = data.status;
  }

  // Данные клиента.
  if (data.client_data) {
    session.client_data = {
      ...session.client_data,
      ...data.client_data
    };
  }

  // Кнопки AI.
  if (data.buttons) {
    showAIButtons(data.buttons);
  }

  // TOP-3 товары.
  if (data.products) {
    showProducts(data.products);
  }
}

// ==========================================
// КНОПКИ AI
// ==========================================

function showAIButtons(buttons) {
  optionsPanel.innerHTML = "";

  buttons.forEach(buttonData => {
    let button = document.createElement("button");

    button.className = "scenario-button";
    button.innerText = buttonData.text;

    button.onclick = function() {
      addClientMessage(buttonData.text);

      optionsPanel.innerHTML = "";

      sendToAI(buttonData.value);
    };

    optionsPanel.appendChild(button);
  });
}

// ==========================================
// ИНДИКАТОР ПЕЧАТИ
// ==========================================

function showTyping() {
  if (typingIndicator) {
    typingIndicator.innerText = "ИИ-помощник печатает...";
  }
}

function hideTyping() {
  if (typingIndicator) {
    typingIndicator.innerText = "";
  }
}

// ==========================================
// TOP-3 ТОВАРЫ
// ==========================================

function showProducts(products) {
  if (!productsContainer) {
    return;
  }

  productsContainer.innerHTML = "";

  let title = document.createElement("div");

  title.className = "products-title";
  title.innerText = "Подобрал для вас подходящие варианты 👇";

  productsContainer.appendChild(title);

  products.forEach((product, index) => {
    let card = document.createElement("div");

    card.className = "product-card";

    let medal = "🥇";

    if (index === 1) medal = "🥈";
    if (index === 2) medal = "🥉";

    card.innerHTML = `
      <div class="product-name">
        ${medal} ${product.name}
      </div>

      <div class="product-description">
        ${product.description || ""}
      </div>
    `;

    productsContainer.appendChild(card);
  });
}

// ==========================================
// СОХРАНЕНИЕ ДАННЫХ КЛИЕНТА
// ==========================================

function saveClientData(key, value) {
  session.client_data[key] = value;

  console.log("CLIENT DATA:", session.client_data);
}

// ==========================================
// ФИНАЛЬНЫЙ LEAD
// ==========================================

function createLead() {
  const lead = {
    session_id: session.session_id,
    intent: session.intent,
    status: "READY",
    messages: session.messages,
    client: session.client_data
  };

  console.log("FINAL LEAD:", lead);

  return lead;
}

// ==========================================
// ЗАПРОС КОНТАКТОВ
// ==========================================

function requestContacts() {
  addAIMessage(
    "Спасибо 👍\n\n" +
    "Чтобы специалист мог подготовить предложение, " +
    "оставьте ваши контактные данные."
  );

  addAIMessage("Как вас зовут?");

  session.contactStep = "NAME";
}

// ==========================================
// ОБРАБОТКА КОНТАКТОВ
// ==========================================

function processContact(text) {
  if (session.contactStep === "NAME") {
    saveClientData("name", text);

    session.contactStep = "PHONE";

    addAIMessage("Укажите ваш номер телефона.");

    return;
  }

  if (session.contactStep === "PHONE") {
    saveClientData("phone", text);

    session.contactStep = "LOCATION";

    addAIMessage("Где находится объект?");

    return;
  }

  if (session.contactStep === "LOCATION") {
    saveClientData("location", text);

    addAIMessage(
      "Спасибо 👍\n" +
      "Заявка передана специалисту."
    );

    createLead();

    session.contactStep = null;
  }
}

// ==========================================
// ЭКСПОРТ ДЛЯ ПРОВЕРКИ
// ==========================================

console.log("AI Widget V4.1 Loaded");
```

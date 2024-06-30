function checkFieldsFilled() {
    const idInstance = document.getElementById("idInstance").value;
    const apiTokenInstance = document.getElementById("apiTokenInstance").value;
    const isFilled = idInstance.trim() !== "" && apiTokenInstance.trim() !== "";
    document.getElementById("getSettingsBtn").disabled = !isFilled;
    document.getElementById("getStateInstanceBtn").disabled = !isFilled;
    document.getElementById("sendMessageBtn").disabled = !isFilled;
    document.getElementById("sendFileBtn").disabled = !isFilled;
}

async function callApi(endpoint, method = "GET", body = null) {
    const idInstance = document.getElementById("idInstance").value;
    const apiTokenInstance = document.getElementById("apiTokenInstance").value;

    const url = `http://localhost:3001/${endpoint}?idInstance=${idInstance}&apiTokenInstance=${apiTokenInstance}`;
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
       
    };

    if (body) {
        options.body = JSON.stringify(body);
      }
   

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        document.getElementById("responseField").innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("responseField").innerText = `Error: ${error.message}`;
    }
}

function validateChatId(chatId) {
    const individualChatPattern = /^[0-9]{11,14}@c\.us$/;
    const groupChatPattern = /^[0-9-]+@g\.us$/;
    return individualChatPattern.test(chatId) || groupChatPattern.test(chatId);
}

function getSettings() {
    callApi("getSettings");
}

function getStateInstance() {
    callApi("getStateInstance");
}

function sendMessage() {
    const chatId = document.getElementById("chatId").value;
    if (!validateChatId(chatId)) {
        document.getElementById("responseField").innerText =
            "Invalid chatId format. It must be either phone_number@c.us or group_id@g.us";
        return;
    }
    const message = document.getElementById("message").value;
    const body = {
        chatId: chatId,
        message: message,
    };
    callApi("sendMessage", "POST", body);
}

function sendFileByUrl() {
    const chatId = document.getElementById("chatId").value;
    if (!validateChatId(chatId)) {
        document.getElementById("responseField").innerText =
            "Invalid chatId format. It must be either phone_number@c.us or group_id@g.us";
        return;
    }
    const urlFile = document.getElementById("fileUrl").value;
    const body = {
        chatId: chatId,
        urlFile: urlFile,
    };
    callApi("sendFileByUrl", "POST", body);
}

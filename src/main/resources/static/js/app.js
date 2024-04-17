const SERVER_URL = 'http://localhost:8080/api/v1/';


document.getElementById('form-adventure').addEventListener('submit', getAdventure);
document.getElementById('form-adventure2').addEventListener('submit', getAdventureWithRateLimit);
document.getElementById('form-answer').addEventListener('submit', getInfo);

async function initPrompt() {
    const URL = `${SERVER_URL}story`
    const spinner = document.getElementById('spinner1');

    try {
        spinner.style.display = "block";
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(handleHttpErrors)
        document.getElementById('chat-history').insertAdjacentHTML('beforeend', `<li class="list-group-item chat-response"></li>`);
        typeWriter(res.answer, document.getElementById('chat-history').lastChild);
        data.history = res.answer;

    } catch (error) {
        console.log(error);
    } finally {
        spinner.style.display = "none";
    }
}
async function getAdventure(event) {
    // Prevent the form from reloading the page.
    event.preventDefault();

    const URL = `${SERVER_URL}adventure?about= + ${document.getElementById('about').value}`
    const spinner = document.getElementById('spinner1');
    const result = document.getElementById('result');
    result.style.color = "black";
    try {
        spinner.style.display = "block";
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(handleHttpErrors)

        chat.insertAdjacentHTML('beforeend', `<li class="list-group-item chat-action"></li>`);
        typeWriter(event.target.action.value, chat.lastChild);

        chat.insertAdjacentHTML('beforeend', `<li class="list-group-item chat-response"></li>`);
        typeWriter(res.answer, chat.lastChild);
        data.history = data.history + res.answer;
    } catch (error) {
        console.log(error);
    } finally {
        spinner.style.display = "none";
        event.target.action.value = "";
    }
    try {
        spinner.style.display = "block";
        const response = await fetch(URL).then(handleHttpErrors)
        document.getElementById('result').innerText = response.answer;
    } catch (e) {
        result.style.color = "red";
        result.innerText = e.message;
    }
    finally {
        spinner.style.display = "none";
    }
}

/* async function getAdventureWithRateLimit(event) {
    // Prevent the form from reloading the page.
    event.preventDefault();

    const URL = `${SERVER_URL}adventurelimited?about= + ${document.getElementById('about2').value}`
    const result2 = document.getElementById('result2');
    const spinner2 = document.getElementById('spinner2');
    result2.style.color = "black";
    result2.innerText = ""
    try {
        spinner2.style.display = "block";
        const response = await fetch(URL).then(handleHttpErrors)
        document.getElementById('result2').innerText = response.answer;
    } catch (e) {
        result2.style.color = "red";
        result2.innerText = e.message;
    } finally {
        spinner2.style.display = "none";
    }
}

async function getInfo(event) {
    // Prevent the form from reloading the page.
    event.preventDefault();

    const URL = `${SERVER_URL}owninfo?question= + ${document.getElementById('the-adventure').value}`
    const spinner = document.getElementById('spinner3');
    const result3 = document.getElementById('result3');
    result3.innerText = ""
    result3.style.color = "black";
    try {
        spinner.style.display = "block";
        const reply = await fetch(URL).then(handleHttpErrors)
        document.getElementById('result3').innerHTML = convertToLink(reply.answer)
    } catch (e) {
        result3.style.color = "red";
        result3.innerText = e.message;
    } finally {
        spinner.style.display = "none";
    }

    function convertToLink(str) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return str.replace(urlRegex, function(match) {
            if (match.endsWith('.')) {
                match = match.slice(0, -1); // Remove the trailing dot
            }
            return `<a href="${match}" target="_blank">${match}</a>`;
        });
    }
}*/

function typeWriter(text, element) {
    let i = 0;
    function type() {
        element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 25);
        }
    }
    type();
}
async function handleHttpErrors(res) {
    if (!res.ok) {
        const errorResponse = await res.json();
        const msg = errorResponse.message ? errorResponse.message : "No error details provided"
        throw new Error(msg)
    }
    return res.json()
}
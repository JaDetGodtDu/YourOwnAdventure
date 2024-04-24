const SERVER_URL = 'http://localhost:8080/api/v1/';

// TO DO: Make functionality that renders the appropriate amount of buttons based on the response from OpenAI API

const startButton = document.getElementById('start-button');
const startDiv = document.getElementById('adventure-start-div');
const answerDiv = document.getElementById('chat-answer');
const historyDiv = document.getElementById('chat-history');

let data = {
    history:"",
    action:""
}

document.getElementById('chat-answer').addEventListener('submit', submitAnswer);

window.addEventListener('load', startAdventure);

function startAdventure(){
    answerDiv.style.display = 'none';
    historyDiv.style.display = 'none';
    startDiv.style.display = 'block';
    startButton.addEventListener('click', initPrompt);
}

async function initPrompt(){
    startDiv.style.display = 'none';
    historyDiv.style.display = 'block';
    answerDiv.style.display = 'block';

    const URL = `${SERVER_URL}adventure`
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
async function submitAnswer(){
    event.preventDefault();
    const URL = `${SERVER_URL}adventure`
    // TO DO: Make spinner a transparent overlay that covers the entire chat window
    const spinner = document.getElementById('spinner1');
    const chat = document.getElementById('chat-history');

    data.action = document.getElementById('action').value;
    console.log(data)
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
        typeWriter(data.action, chat.lastChild);

        chat.insertAdjacentHTML('beforeend', `<li class="list-group-item chat-response"></li>`);
        typeWriter(res.answer, chat.lastChild);
        data.history = data.history + res.answer;
    } catch (error) {
        console.log(error);
    } finally {
        spinner.style.display = "none";
        document.getElementById('action').value = "";
    }

}
// TO DO: Make it so the typing effect can be stopped by clicking on the text and displaying the full text
// TO DO: Make it so the scrolling effect scrolls dynamically during the typing effect
function typeWriter(text, element) {
    let i = 0;
    function type() {
        element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        if (i < text.length) {
            if (!isNaN(text.charAt(i)) && text.charAt(i) !== " ") {
                element.innerHTML += "<br>";
            }
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 12.5);
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
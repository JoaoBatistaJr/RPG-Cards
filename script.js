const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('user-input');
let currentDialogueIndex = 0;

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        gameData = data;
        displayChat();
    })
    .catch(error => {
        console.error('Erro ao carregar os dados do jogo:', error);
    });

function displayMessage(speaker, text) {
    const messageElement = document.createElement('div');
    messageElement.className = speaker === 'Herói Protagonista' ? 'right-dialogue' : 'left-dialogue';
    messageElement.textContent = `${speaker}: ${text}`;
    chatbox.appendChild(messageElement);
}

function displayOptions(options) {
    const optionsElement = document.createElement('div');
    optionsElement.className = 'left-dialogue';
    optionsElement.textContent = 'O que deseja fazer?\n';

    options.forEach((option, index) => {
        optionsElement.textContent += `(${index + 1}) ${option.option}\n`;
    });

    chatbox.appendChild(optionsElement);
}

function displayChat() {
    chatbox.innerHTML = '';

    const dialogue = gameData.dialogues[currentDialogueIndex];
    displayMessage(dialogue.speaker, dialogue.text);
    if (dialogue.options && dialogue.options.length > 0) {
        displayOptions(dialogue.options);
    }
}

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const inputText = userInput.value.trim();
        userInput.value = '';

        const dialogue = gameData.dialogues[currentDialogueIndex];
        if (dialogue.options && dialogue.options.length > 0) {
            const optionIndex = parseInt(inputText, 10) - 1;
            if (optionIndex >= 0 && optionIndex < dialogue.options.length) {
                const chosenOption = dialogue.options[optionIndex];
                gameData.dialogues[currentDialogueIndex].speaker = 'Herói Protagonista';
                gameData.dialogues[currentDialogueIndex].text = chosenOption.response;
                currentDialogueIndex = chosenOption.nextDialogueIndex;
                gameData.dialogues[currentDialogueIndex].speaker = 'Narrador';
            } else {
                gameData.dialogues[currentDialogueIndex].speaker = 'Herói Protagonista';
                gameData.dialogues[currentDialogueIndex].text = 'Opção inválida. Por favor, escolha uma das opções apresentadas.';
            }
            displayChat();
        }
    }
});

displayChat();

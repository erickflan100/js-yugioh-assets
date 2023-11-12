const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardsSprites:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    playerSides:{
        computerBOX: document.querySelector('#computer-cards'),
        playerBOX: document.querySelector('#player-cards'),
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    action:{
        button: document.getElementById('next-duel'),
    }
}

const pathImage = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImage}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: 'Magician',
        type: 'Rock',
        img: `${pathImage}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImage}exodia.png`,
        winOf: [0],
        loseOf: [1],
    }
]

const playerSides = {
    player1: 'player-cards',
    computer: 'computer-cards',
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img')
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", idCard)
    cardImage.classList.add('card')

    if(fieldSide === playerSides.player1){
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(idCard)
        })

        cardImage.addEventListener('click', () => {
            setCardField(cardImage.getAttribute('data-id'))
        })
    }

    return cardImage
}

async function setCardField(cardId) {
    await removeAllCardsId();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResult(cardId, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function removeAllCardsId() {
    let { computerBOX, playerBOX } = state.playerSides
    let imgElements = computerBOX.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())

    imgElements = playerBOX.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())
}

async function resetDuel() {
    state.cardsSprites.avatar.src = ''
    state.action.button.style.display = "none"

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    state.cardsSprites.name.innerText = 'Selecione'
    state.cardsSprites.type.innerText = 'uma carta'

    init()
}

async function checkDuelResult(playerCardID, computerCardID) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardID]

    if(playerCard.winOf.includes(computerCardID)) {
        duelResults = "Win"
        state.score.playerScore++
    } else if(playerCard.loseOf.includes(computerCardID)) {
        duelResults = "Lose"
        state.score.computerScore++
    }
    await playAudio(duelResults)

    return duelResults
}

async function playAudio(audio) {
    const audioElement = new Audio(`./src/assets/audios/${audio}.wav`)
    try {
        audioElement.play()
    } catch (error) {}
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text) {
    state.action.button.innerText = text.toUpperCase()
    state.action.button.style.display = "block"
}

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = 'Attribute : ' + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)
}

function playAudioBgm(){
    const bgm = document.getElementById('bgm')
    bgm.play();
}

init()
playAudioBgm()
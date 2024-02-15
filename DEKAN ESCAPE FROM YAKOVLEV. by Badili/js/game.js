const user = {
    nickname: 'Player',
    health: 5,
    trapFeel: 0,
    monsterHit: 0
}


const gameWindow = document.getElementById("gameWindow")
gameWindow.addEventListener('wheel', (event) => {
    event.preventDefault()
})




function startGame() {
    gameWindow.innerHTML = `
        <div class="user-nickname-form">
            <label>
                <p>Введите ваш ник</p>
                <input type="text" id="userNickname">
            </label>

            <button id="startGameButton">Начать игру</button>
        </div>
    `


    const startGameButton = document.getElementById('startGameButton')
    const userNicknameInput = document.getElementById('userNickname')
    startGameButton.addEventListener("click", () => {
        if(userNicknameInput.value != '') {
            user.nickname = userNicknameInput.value
        }
        gameWindow.innerHTML = `
            <div id="gameMapWrapper">
                <img id="gameMap" src="img/game-map.png">
                <img id="player" src="img/dekan.png">
                <img id="mapExit" src="img/exit.png">
                <div id="userInfo">
                    <p id="playerNick">${user.nickname}</p>
                    <p id="currentTime"></p>
                    <p id="userTime"></p>
                    <p id="userHealth">Жизней: 5</p>
                </div>

                                                
                <div id="gameResults">
                    <div class="results-panel">
                        <h2 id="resultsTitle">Поражение!</h2>
                        <p id="gameTime">54:43</p>
                        <p id="monsterCount">5</p>
                        <p id="trapsCount">5</p>
                        <p id="healthCount">444</p>
                        <button id="newGameButton">Играть сначала</button>
                    </div>
                </div>


                <div id="pauseWindow" >
                    <div id="pauseMenu">
                        <button id="goGameButton">Возобновить игру</button>
                        <button id="pauseNewGameButton">Начать новую игру</button>
                    </div>
                </div>


            </div>
        `

        let userDate = new Date
        
        let isPause = false
        let immortal = false

        const arrayOfMonsters = []
        const arrayOfTraps = []
        const arrayOfWays = ['w', 'a', 's', 'd']
        const arrayOfEntityCoords = [150, 250, 350, 500]
        const arrayOfEntityStatus = ['-', '+']

        let userHours = userDate.getHours()
        let userMinutes = userDate.getMinutes()

        let gameMinutes = "00"
        let gameSeconds = "00"

        const currentTime = document.getElementById('currentTime')
        const userTime = document.getElementById('userTime')
        const userHealth = document.getElementById('userHealth')

        const gameResults = document.getElementById("gameResults")
        const resultsTitle = document.getElementById('resultsTitle')
        const gameTime = document.getElementById("gameTime")
        const monsterCount = document.getElementById('monsterCount')
        const trapsCount = document.getElementById("trapsCount")
        const healthCount = document.getElementById('healthCount')
        const newGameButton = document.getElementById('newGameButton')

        const pauseWindow = document.getElementById('pauseWindow')

        newGameButton.addEventListener("click", () => {
            location.reload()
        })

        const goGameButton = document.getElementById('goGameButton')
        const pauseNewGameButton = document.getElementById('pauseNewGameButton')

        goGameButton.addEventListener('click', () => {
            pauseWindow.style.display = 'none'
            setGameIntervals()
            isPause = !isPause
        })

        pauseNewGameButton.addEventListener("click", () => {
            location.reload()
        })



        

        currentTime.innerText = `Ваше время: ${userHours}:${userMinutes}`
        userTime.innerText = `Времени прошло: ${gameMinutes}:${gameSeconds}`

        function setGameIntervals() {
            dateCounter = setInterval(() => {
                gameSeconds = Number(gameSeconds)
                gameMinutes = Number(gameMinutes)
                gameSeconds++
                if(gameSeconds >= 60) {
                    gameMinutes++
                    gameSeconds = 0
                }
    
                String(gameSeconds).length < 2 ? gameSeconds = '0' + gameSeconds : null
                String(gameMinutes).length < 2 ? gameMinutes = '0' + gameMinutes : null
    
    
                let userDate = new Date
    
                userHours = userDate.getHours()
                userMinutes = userDate.getMinutes()
    
    
                String(userHours).length < 2 ? userHours = '0' + userHours : userHours = userDate.getHours()
                String(userMinutes).length < 2 ? userMinutes = '0' + userMinutes : userMinutes = userDate.getMinutes()
                
                currentTime.innerText = `Ваше время: ${userHours}:${userMinutes}`
                userTime.innerText = `Времени прошло: ${gameMinutes}:${gameSeconds}`
            }, 1000);

            mobsSpawner = setInterval(() => {
                createMonstersAndTraps()
            }, 3000);
        }

        setGameIntervals()


        function clearAllGameIntervals() {
            clearInterval(dateCounter)
            clearInterval(mobsSpawner)
        }
        



        const player = document.getElementById('player')
        player.style.left = `${window.screen.width / 2 - 50}px`
        player.style.top = `${window.screen.height/ 2 - 50}px`

        const mapExit = document.getElementById('mapExit')

        function coordinate(currentPosition) {
            currentPosition = currentPosition.replace('px', '')
            return Number(currentPosition)
        }

        function userWindowAlignment() {
            window.scrollTo('y', (coordinate(player.style.left) - (window.screen.width/ 2 - 50))) 
            window.scrollTo('x', (coordinate(player.style.top) - (window.screen.height/ 2 - 50)))
            mapExit.style.top = `${gameWindow.scrollHeight - 100}px`
            mapExit.style.left = `${window.screen.width / 2 - 50}px`
        }


        function getResults(victoryStatus) {
            gameResults.style.display = "flex"
    
            resultsTitle.innerText = victoryStatus
            victoryStatus === 'Победа!' ? resultsTitle.classList = 'victory-title' : resultsTitle.classList = 'defeat-title'
            gameTime.innerText = `Время: ${gameMinutes}:${gameSeconds}`
            monsterCount.innerText = `Напоролся на монстра: ${user.monsterHit} раз`
            trapsCount.innerText = `Попал в ловушку: ${user.trapFeel} раз`
            healthCount.innerText = `Жизни: ${user.health}`
            clearAllGameIntervals()
            isPause = true
        }


        function move(btn, entity) {
            if(!isPause) {
                switch(btn){
                    case 'w':
                        coordinate(entity.style.top) - 20 < 0 ? entity.style.top = `${0}px` :  entity.style.top = `${coordinate(entity.style.top) - 20}px`
                        entity.id === 'player' ? userWindowAlignment() : null
                        break

                    case 'a':
                        coordinate(entity.style.left) - 20 < 0 ? entity.style.left = `${0}px` :  entity.style.left = `${coordinate(entity.style.left) - 20}px`
                        entity.id === 'player' ? userWindowAlignment() : null
                        break

                    case 's':
                        (coordinate(entity.style.top) + 100) + 20 > gameWindow.scrollHeight ? entity.style.top = `${gameWindow.scrollHeight - 100}px` : entity.style.top = `${coordinate(entity.style.top) + 20}px`
                        entity.id === 'player' ? userWindowAlignment() : null
                        break

                    case 'd':
                        (coordinate(entity.style.left) + 100) + 20 > window.screen.width ? entity.style.left = `${window.screen.width - 100}px` : entity.style.left = `${coordinate(entity.style.left) + 20}px`
                        entity.id === 'player' ? userWindowAlignment() : null
                        break
                }
                if(entity.id === 'player') {
                    if(
                        (coordinate(player.style.top) > coordinate(mapExit.style.top) - 100) && 
                        (coordinate(player.style.left) > coordinate(mapExit.style.left) - 100) &&
                        (coordinate(player.style.top) < coordinate(mapExit.style.top) + 100) &&
                        (coordinate(player.style.left) < coordinate(mapExit.style.left) + 100)
                    ) {
                        getResults('Победа!')
                    } else {
                        
                        for(let i = 0; i < arrayOfMonsters.length; i++) {
                            if(  
                                (coordinate(player.style.top) > coordinate(arrayOfMonsters[i].style.top) - 90) && 
                                (coordinate(player.style.left) > coordinate(arrayOfMonsters[i].style.left) - 90) &&
                                (coordinate(player.style.top) < coordinate(arrayOfMonsters[i].style.top) + 90) &&
                                (coordinate(player.style.left) < coordinate(arrayOfMonsters[i].style.left) + 90)
                             ) {
                                
                                if(immortal === false) {
                                    user.health--
                                    user.monsterHit++
                                    userHealth.innerText = `Жизней: ${user.health}`
                                    gameMapWrapper.removeChild(arrayOfMonsters[i])
                                    arrayOfMonsters.splice(i, 1)

                                    immortal = true
                                }
                                setTimeout(() => {
                                    immortal = false
                                }, 2000);
                            }
                            if(user.health <= 0) {
                                getResults('Поражение!')
                            }
                        }
                        for(let i = 0; i < arrayOfTraps.length; i++) {
                            if(  
                                (coordinate(player.style.top) > coordinate(arrayOfTraps[i].style.top) - 100) && 
                                (coordinate(player.style.left) > coordinate(arrayOfTraps[i].style.left) - 100) &&
                                (coordinate(player.style.top) < coordinate(arrayOfTraps[i].style.top) + 100) &&
                                (coordinate(player.style.left) < coordinate(arrayOfTraps[i].style.left) + 100)
                             ) {
                                
                                if(immortal === false) {
                                    user.health--
                                    user.trapFeel++
                                    userHealth.innerText = `Жизней: ${user.health}`
                                    gameMapWrapper.removeChild(arrayOfTraps[i])
                                    arrayOfTraps.splice(i, 1)
                                    immortal = true
                                }
                                setTimeout(() => {
                                    immortal = false
                                }, 2000);
                            }
                            if(user.health <= 0) {
                                getResults('Поражение!')
                                clearAllGameIntervals()
                            }
                        }

                        
                    }
                }
            }
        }



        document.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'w':
                    move('w', player)
                    break
                case 'a':
                    move('a', player)
                    break
                case 's':
                    move('s', player)
                    break
                case 'd':
                    move('d', player)
                    break
                case 'Escape':
                    if(isPause) {
                        pauseWindow.style.display = 'none'
                        setGameIntervals()
                    } else {
                        pauseWindow.style.display = 'flex'
                        clearAllGameIntervals()
                    }
                    isPause = !isPause
            }
        })

        const gameMapWrapper = document.getElementById('gameMapWrapper')


        function createMonstersAndTraps() {
            for(let i = 0; i < 10; i++) {
                const monster = document.createElement('div')
                monster.classList = 'monster'
        
                gameMapWrapper.appendChild(monster)
   
                let randomWay = Math.floor(Math.random() * arrayOfWays.length)
                let count = 0
                arrayOfMonsters.push(monster)

                let randomMonsterTopCoord = Math.floor(Math.random() * arrayOfEntityCoords.length)
                let randomMonsterLeftCoord = Math.floor(Math.random() * arrayOfEntityCoords.length)

                let randomMonsterTopStatus = Math.floor(Math.random() * arrayOfEntityStatus.length)
                let randomMonsterLeftStatus = Math.floor(Math.random() * arrayOfEntityStatus.length)

                if(arrayOfEntityStatus[randomMonsterTopStatus] === '-' ) {
                    coordinate(player.style.top) - arrayOfEntityCoords[randomMonsterTopCoord] < 0 ? monster.style.top = `${0}px` : monster.style.top = `${coordinate(player.style.top) - arrayOfEntityCoords[randomMonsterTopCoord]}px`
                } else {
                    coordinate(player.style.top) + arrayOfEntityCoords[randomMonsterTopCoord] + 100 > gameWindow.scrollHeight ? monster.style.top = `${gameWindow.scrollHeight - 200}px` : monster.style.top = `${coordinate(player.style.top) + arrayOfEntityCoords[randomMonsterTopCoord]}px`
                }
                if(arrayOfEntityStatus[randomMonsterLeftStatus] === '-' ) {
                    coordinate(player.style.left) - arrayOfEntityCoords[randomMonsterLeftCoord] < 0 ? monster.style.left = `${0}px` : monster.style.left = `${coordinate(player.style.left) - arrayOfEntityCoords[randomMonsterLeftCoord]}px`
                } else {
                    coordinate(player.style.left) + arrayOfEntityCoords[randomMonsterLeftCoord] + 100 > window.screen.width ? monster.style.left = `${gameWindow.scrollHeight - 200}px` : monster.style.left = `${coordinate(player.style.left) + arrayOfEntityCoords[randomMonsterLeftCoord]}px`
                }
        
                this.setInterval(() => {
                    count++
        
                    if(count < 5) {
                        move(arrayOfWays[randomWay], monster)
                    } else {
                        randomWay = Math.floor(Math.random() * arrayOfWays.length)
                        count = 0
                        move(arrayOfWays[randomWay], monster)
                    }
        
                }, 50);
            }
            
    
    
    
    
    
    
            for(let i = 0; i < 2; i++) {
                const trap = document.createElement('div')
                trap.classList = 'trap'
        
                gameMapWrapper.appendChild(trap)
                arrayOfTraps.push(trap)
        
                let randomTrapTopCoord = Math.floor(Math.random() * arrayOfEntityCoords.length)
                let randomTrapLeftCoord = Math.floor(Math.random() * arrayOfEntityCoords.length)

                let randomTrapTopStatus = Math.floor(Math.random() * arrayOfEntityStatus.length)
                let randomTrapLeftStatus = Math.floor(Math.random() * arrayOfEntityStatus.length)

                if(arrayOfEntityStatus[randomTrapTopStatus] === '-' ) {
                    coordinate(player.style.top) - arrayOfEntityCoords[randomTrapTopCoord] < 0 ? trap.style.top = `${0}px` : trap.style.top = `${coordinate(player.style.top) - arrayOfEntityCoords[randomTrapTopCoord]}px`
                } else {
                    coordinate(player.style.top) + arrayOfEntityCoords[randomTrapTopCoord] + 100 > gameWindow.scrollHeight ? trap.style.top = `${gameWindow.scrollHeight - 200}px` : trap.style.top = `${coordinate(player.style.top) + arrayOfEntityCoords[randomTrapTopCoord]}px`
                }
                if(arrayOfEntityStatus[randomTrapLeftStatus] === '-' ) {
                    coordinate(player.style.left) - arrayOfEntityCoords[randomTrapLeftCoord] < 0 ? trap.style.left = `${0}px` : trap.style.left = `${coordinate(player.style.left) - arrayOfEntityCoords[randomTrapLeftCoord]}px`
                } else {
                    coordinate(player.style.left) + arrayOfEntityCoords[randomTrapLeftCoord] + 100 > window.screen.width ? trap.style.left = `${gameWindow.scrollHeight - 200}px` : trap.style.left = `${coordinate(player.style.left) + arrayOfEntityCoords[randomTrapLeftCoord]}px`
                }

            }


        }


        createMonstersAndTraps()






    })

   
}









const selectMapButton = document.getElementById("selectMapButton")

selectMapButton.addEventListener("click", startGame)



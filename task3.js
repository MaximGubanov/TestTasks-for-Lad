// Задача 3. Быки и коровы

// Компьютер загадывает число из нескольких различающихся цифр (от 3 до 6). Игроку дается несколько попыток на то, 
// чтобы угадать это число. После каждой попытки компьютер сообщает количество совпавших цифр стоящих не на своих 
// местах, а также количество правильных цифр на своих местах. Например загаданное число: 56478 предположение 
// игрока: 52976
// ответ: совпавших цифр не на своих местах - 1 (6), цифр на своих местах - 2 (5 и 7)

// игра ведется до окончания количества ходов либо до отгадывания


function numberСomparison (sampleNumber, comparedNumber) {
    // sampleNumber - образец для сравнения
    // comparedNumber - сравниваемое число по образцу

    let matched = []
    let outOfPosition = []
    

    for (let i = 0; i < sampleNumber.length; i++) {
    
        if (sampleNumber[i] === comparedNumber[i]) {
            matched.push(comparedNumber[i])
        } else if (sampleNumber.indexOf(comparedNumber[i]) != -1) {
            outOfPosition.push(comparedNumber[i])
        }
    }

    console.log(`Совпавших цифр не на своих местах - ${outOfPosition.length} (${outOfPosition}), цифр на своих местах - ${matched.length} (${matched})`)
}


function getRandomNumber(min=100, max=999999) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function startGame(tries) {

    const readlineSync = require('readline-sync')
    const computerNumber = getRandomNumber().toString()
    let i = 1

    while (i <= tries) {

        console.log(`${i} из ${tries} попыток.`)

        let userNumber = readlineSync.question(`Компьютер загадал ${computerNumber.length}-значное число: `)

        if (userNumber.length != computerNumber.length) {
            console.log('Введённое Вами число не соответсвует кол-ву знаков. Попробуйте снова.')
            continue
        } else if (userNumber === computerNumber) {
            console.log(`Поздравляем, Вы угадали за ${i} попыток`)
            break
        } else {
            numberСomparison(computerNumber, userNumber)
        }

        i++
    }

    console.log('Компьютер загадал число', computerNumber)
}

startGame(10)

// Задача 4. RPG баттл
"use strict"


class Fighter {

    constructor (name) {
        this.maxHealth = 10
        this.typePlayer = 'user' // Тип игрока 
        this.name = name
        this.moves = []
    }

    movesCounter () {
        this.moves.forEach(move => move.moveCounter++) // На каждой итерации делаем счёт moveCounter для cooldown,
    }                                                  // когда moveCounter === cooldown - ход снова доступен для игрока

    changeMove () {

        const readlineSync = require('readline-sync')

        console.log(`Доступные ходы для: ${this.name}`)
        
        let availableMoves = this.moves.filter(move => move.cooldown <= move.moveCounter) //собираем доступные ходы

        // Выводим доступные ходы для игрока на экран для удобства
        availableMoves.forEach(move => console.log(`[${this.moves.indexOf(move)}] -> ${move.name}, физ.урон - ${move.physicalDmg}, маг.урон - ${move.magicDmg}`))

        let move = () => {

            // Проверка типа игрока, если 'computer', то ход выбиирается рандомно
            if (this.typePlayer === 'computer') {
                let indexMove = parseInt(Math.floor(Math.random() * availableMoves.length))
                this.moves[this.moves.indexOf(availableMoves[indexMove])].moveCounter = 0
                console.log(`${this.name}: выбрал ход - ${availableMoves[indexMove].name}`)

                return availableMoves[indexMove]
            }

            // если тип - 'user', то вводим номер хода с клавиатуры
            let indexMove = parseInt(readlineSync.question(`${this.name}: выберете номер хода -> `))
            this.moves[indexMove].moveCounter = 0
            console.log(`Вы выбрали ход - ${this.moves[indexMove].name}`)

            return availableMoves[indexMove]
            
        }
         
        return move() // Возвращаем объект хода
    }
}


class Monster extends Fighter {

    constructor (name, typePlayer) {
        super(name)
        this.typePlayer = typePlayer
        this.moves = [
            {
                "name": "Удар когтистой лапой",
                "physicalDmg": 3, // физический урон
                "magicDmg": 0,    // магический урон
                "physicArmorPercents": 20, // физическая броня
                "magicArmorPercents": 20,  // магическая броня
                "cooldown": 0,     // ходов на восстановление
                "moveCounter": 0, // счётчик ходов для восстановления cooldown
            },
            {
                "name": "Огненное дыхание",
                "physicalDmg": 0,
                "magicDmg": 4,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 3,
                "moveCounter": 3,
            },
            {
                "name": "Удар хвостом",
                "physicalDmg": 2,
                "magicDmg": 0,
                "physicArmorPercents": 50,
                "magicArmorPercents": 0,
                "cooldown": 2,
                "moveCounter": 2,
            },
        ]
    }
}


class Magican extends Fighter {

    constructor (name, typePlayer, maxHealth) {
        super(name, typePlayer)
        this.typePlayer = typePlayer
        this.maxHealth = maxHealth
        this.moves = [
            {
                "name": "Удар боевым кадилом",
                "physicalDmg": 2,
                "magicDmg": 0,
                "physicArmorPercents": 0,
                "magicArmorPercents": 50,
                "cooldown": 0,
                "moveCounter": 0,
            },
            {
                "name": "Вертушка левой пяткой",
                "physicalDmg": 4,
                "magicDmg": 0,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 4,
                "moveCounter": 4,
            },
            {
                "name": "Каноничный фаербол",
                "physicalDmg": 0,
                "magicDmg": 5,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 3,
                "moveCounter": 3,
            },
            {
                "name": "Магический блок",
                "physicalDmg": 0,
                "magicDmg": 0,
                "physicArmorPercents": 100,
                "magicArmorPercents": 100,
                "cooldown": 4,
                "moveCounter": 4,
            },
        ]
    }
}


const damageСalculation = (attacking, reflecting, fighter) => {

    // Ф-я производит рассчёт урона для конкретного бойца (fighter)
    // Бойцы в каждом раунде наносят друг другу урон, делаем взаиморассчёт уронов, исходя из параметров:
    // "physicalDmg", "magicDmg", "physicArmorPercents", "magicArmorPercents".

    // Расчёт для физического урона
    if (reflecting.physicArmorPercents === 100) {
        fighter.maxHealth -= 0
    } else if (reflecting.physicArmorPercents != 0) {
        if (attacking.physicalDmg != 0) {
            fighter.maxHealth -= (attacking.physicalDmg / 100) * reflecting.physicArmorPercents
        }
    } else {
        fighter.maxHealth -= attacking.physicalDmg
    }

    // Рассчёт для магического урона
    if (reflecting.magicArmorPercents === 100) {
        fighter.maxHealth -= 0
    } else if (reflecting.magicArmorPercents != 0) {
        if (attacking.magicDmg != 0) {
            fighter.maxHealth -= (attacking.magicDmg / 100) * reflecting.magicArmorPercents
        }
    } else {
        fighter.maxHealth -= attacking.magicDmg
    }

    console.log(`Здоровье ${fighter.name}: ${fighter.maxHealth}`)

    return fighter.maxHealth // Возвращаем рассчётное здоровье текущего бойца
}


function startBattle () {

    //Создаем объекты бойцов
    const monster = new Monster('Лютый', 'computer') // Тип - 'computer'
    const magican = new Magican('Евстафий', 'user', 10) // 10 - макс. здоровье игра, тип по умолчанию - 'user'

    // Данные переменные нужны для поочередности ходов. см. ниже
    let attackingFighter = monster
    let reflectingFighter = magican

    let gameOver = false // когда будет true - игра остановлена
    let round = 1 // счётчик раундов

    while (!gameOver) {

        console.log(`********************* РАУНД ${round} **********************\n`)

        // Игроки делают ход (компьютер выбирает ход рандомно)
        let moveAttacking = attackingFighter.changeMove()
        console.log('***********************************************************\n')

        let moveReflecting = reflectingFighter.changeMove() // пользователь выбирает ход сам
        console.log('***********************************************************\n')
       
        let attakingFighterHealth = damageСalculation(moveAttacking, moveReflecting, attackingFighter) //Рассчёт урона для атакующего
        let reflectingFighterHealth = damageСalculation(moveReflecting, moveAttacking, reflectingFighter) //Рассчёт урона для отражающего

        // Зарускаем счётчик для восстановления ходов, на каждой итерации у каждого хода,
        // moveCounter увеличивается на 1, когда moveCounter = cooldown ход снова становиться доступным
        attackingFighter.movesCounter()
        reflectingFighter.movesCounter()

        if (attakingFighterHealth <= 0) {
            console.log(reflectingFighter.name, ' : Победил!')
            gameOver = true
        }

        if (reflectingFighterHealth <= 0) {
            console.log(attackingFighter.name, ' : Победил!')
            gameOver = true
        }

        // Применяю приём обмена значениями переменных, чтобы на каждой итерации поочерёдность ходов менялась 
        // если раскомментирова нижние строки, игроки будут делать ходы по очереди

        // let temp = attackingFighter
        // attackingFighter = reflectingFighter
        // reflectingFighter = temp

        round++
    }
}


startBattle()

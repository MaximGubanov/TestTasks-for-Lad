// Задача 4. RPG баттл
"use strict"


class Fighter {

    constructor (name) {
        this.maxHealth = 10
        this.typePlayer = 'user' // Тип игрока 
        this.name = name
        this.moves = []
        this.currentMove = undefined
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

            return this.moves[indexMove]
            
        }

        this.currentMove = move()
    }
    
    damageCalc (moveEnemy) {
        
        let physicDmg = moveEnemy.physicalDmg
        let magicDmg = moveEnemy.magicDmg
        let physicArmor = this.currentMove.physicArmorPercents
        let magicArmor = this.currentMove.magicArmorPercents
        
        if (physicArmor == 100) {
            this.maxHealth -= 0
        } else if (physicArmor == 0) {
            this.maxHealth -= physicDmg
        } else if (physicArmor > 0 && physicArmor < 100) {
            this.maxHealth -= physicDmg * (physicArmor / 100)
        }

        if (magicArmor == 100) {
            this.maxHealth -= 0
        } else if (magicArmor == 0) {
            this.maxHealth -= magicDmg
        } else if ( magicArmor > 0 && magicArmor < 100) {
            this.maxHealth -= magicDmg * (magicDmg / 100)
        }
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
        // let moveAttacking = attackingFighter.changeMove()
        attackingFighter.changeMove()
        console.log('***********************************************************\n')

        // let moveReflecting = reflectingFighter.changeMove() // пользователь выбирает ход сам
        let enemyMove = reflectingFighter.changeMove()
        console.log('***********************************************************\n')

        attackingFighter.damageCalc(reflectingFighter.currentMove) // рассчёт урона для атакующего
        reflectingFighter.damageCalc(attackingFighter.currentMove) // рассчёт урона для защищающегося

        // Зарускаем счётчик для восстановления ходов, на каждой итерации у каждого хода,
        // moveCounter увеличивается на 1, когда moveCounter = cooldown ход снова становиться доступным
        attackingFighter.movesCounter()
        reflectingFighter.movesCounter()

        console.log(`Здоровье ${attackingFighter.name}: `, attackingFighter.maxHealth)
        console.log(`Здоровье ${reflectingFighter.name}: `, reflectingFighter.maxHealth)

        if (attackingFighter.maxHealth <= 0) {
            console.log(reflectingFighter.name, ' : Победил!')
            gameOver = true
        }

        if (reflectingFighter.maxHealth <= 0) {
            console.log(attackingFighter.name, ' : Победил!')
            gameOver = true
        }

        // Применяю приём обмена значениями переменных, чтобы на каждой итерации поочерёдность ходов менялась 
        // если раскомментировать нижние строки, игроки будут делать ходы по очереди

        //let temp = attackingFighter
        //attackingFighter = reflectingFighter
        //reflectingFighter = temp

        round++
    }
}


startBattle()

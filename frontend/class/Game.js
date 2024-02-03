import SoundManager from './SoundManager.js';


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

class Game {
    constructor() {
        this.score = 0;
        this.remainingTime = 60;
        this.minDelay = 3000;
        this.maxDelay = 6000;
        this.timeoutIds = [];
        this.circles = document.querySelectorAll('.taupe');
        this.timerElement = document.querySelector('.timer-text');
        this.soundEnabled = true;
    }

    init() {
        this.setupTimer();
        this.setupCircles();
    }

    getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    triggerColoredCircle(circle) {
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        const colorClass = randomNumber === 1 ? 'blue' : 'red';

        circle.classList.add(colorClass);

        const timeoutId = setTimeout(() => {
            circle.classList.add('fadeout');
            setTimeout(() => {
                circle.classList.remove('fadeout');
            }, 1000);
        }, 6000);

        this.timeoutIds.push(timeoutId);
    }


    updateScore() {
        const scoreElement = document.querySelector('.score-text');
        scoreElement.textContent = 'Votre score : ' + this.score;
    }

    updateTimer() {
        this.timerElement.textContent = 'Temps restant : ' + this.remainingTime + ' secondes';

        if (this.remainingTime <= 0) {
            this.endGame();
        }
    }

    setupTimer() {
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.updateTimer();
        }, 1000);
    }


    setupCircles() {
        this.circles = shuffle(Array.from(this.circles));

        let index = 0;
        const totalCircles = this.circles.length;
        const displayedCircles = [];

        const spawnNextCircle = () => {
            shuffle(this.circles);
            const circle = this.circles[index];
        
            circle.addEventListener('click', () => this.handleCircleClick(circle));
            this.triggerColoredCircle(circle);
        
            index++;
        
            if (index < totalCircles) {
                setTimeout(spawnNextCircle, this.getRandomDelay(3000, 8000));
            } else {
                index = 0;
                setTimeout(spawnNextCircle, this.getRandomDelay(3000, 8000));
            }
        };
        spawnNextCircle();
    }


    handleCircleClick(circle) {
        if (this.soundEnabled) {
            const soundManager = new SoundManager(this);
            soundManager.playSound(circle);
        }

        let points = 0;

        if (circle.classList.contains('red')) {
            circle.classList.add('clicked');
            points = 10;
            this.remainingTime += 3;
        } else if (circle.classList.contains('blue')) {
            circle.classList.add('clicked');
            points = -10;
            this.remainingTime -= 10;
        }

        this.score += points;
        this.updateScore();

        if (points !== 0) {
            const pointsElement = document.createElement('span');
            pointsElement.innerHTML = (points >= 0 ? '+' : '') + points;

            pointsElement.classList.add('score-points');

            if (points > 0) {
                pointsElement.classList.add('positive-points');
            } else if (points < 0) {
                pointsElement.classList.add('negative-points');
            }

            circle.appendChild(pointsElement);

            setTimeout(() => {
                pointsElement.remove();
            }, 1000);
        }

        setTimeout(() => {
            circle.classList.remove('clicked', 'red', 'blue');
        }, 1000);
    }


    endGame() {
        clearInterval(this.timerInterval);

        this.circles.forEach(circle => {
            circle.removeEventListener('click', () => this.handleCircleClick(circle));
        });

        this.timeoutIds.forEach(id => {
            clearTimeout(id);
        });

        const gameOverPopup = document.querySelector('.game-over-popup');
        gameOverPopup.style.display = 'block';

        const finalScoreElement = document.querySelector('.final-score');
        finalScoreElement.textContent = 'Score final : ' + this.score;
    }

    resetGame() {
        this.score = 0;
        this.remainingTime = 60;
        this.minDelay = 3000;
        this.maxDelay = 6000;
        this.timeoutIds = [];

        this.updateScore();
        this.updateTimer();
        this.circles.forEach(circle => {
            circle.classList.remove('red', 'blue');
        });
        this.circles.forEach(circle => {
            circle.removeEventListener('click', () => this.handleCircleClick(circle));
        });
        this.setupCircles();
        this.setupTimer();

        const gameOverPopup = document.querySelector('.game-over-popup');
        gameOverPopup.style.display = 'none';
    }
}

export default Game;

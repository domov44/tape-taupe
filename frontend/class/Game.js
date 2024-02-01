import SoundManager from './SoundManager.js';

class Game {
    constructor() {
        this.score = 0;
        this.remainingTime = 10;
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
        this.startDecreasingDelays();
    }

    getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    triggerColoredCircle(circle) {
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        const colorClass = randomNumber === 1 ? 'blue' : 'red';

        circle.classList.add(colorClass);

        const timeoutId = setTimeout(() => {
            circle.classList.remove('blue', 'red');
            const newTimeoutId = setTimeout(() => this.triggerColoredCircle(circle), this.getRandomDelay(this.minDelay, this.maxDelay));
            this.timeoutIds.push(newTimeoutId);
        }, 3000);

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
        this.circles.forEach(circle => {
            circle.addEventListener('click', () => this.handleCircleClick(circle));

            setTimeout(() => {
                this.triggerColoredCircle(circle);
            }, this.getRandomDelay(this.minDelay, this.maxDelay));
        });
    }

    startDecreasingDelays() {
        let minutesElapsed = 0;

        const decreaseDelays = () => {
            if (minutesElapsed < 1) {
                this.minDelay = Math.max(1000, this.minDelay - 200);
                this.maxDelay = Math.max(3000, this.maxDelay - 200);
                minutesElapsed++;
                setTimeout(decreaseDelays, 60000);
            }
        };

        setTimeout(decreaseDelays, 60000);
    }

    handleCircleClick(circle) {
        if (this.soundEnabled) {
            const soundManager = new SoundManager(this);
            soundManager.playSound(circle);
        }
    
        let points = 0;
    
        if (circle.classList.contains('red')) {
            circle.classList.remove('red');
            points = 10;
        } else if (circle.classList.contains('blue')) {
            circle.classList.remove('blue');
            points = -10;
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
        this.startDecreasingDelays();
        
        const gameOverPopup = document.querySelector('.game-over-popup');
        gameOverPopup.style.display = 'none';
    }
}

export default Game;

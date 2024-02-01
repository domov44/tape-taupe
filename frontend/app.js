import Game from './class/Game.js';
import SoundManager from './class/SoundManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const tapeTaupeGame = new Game();
    const soundManager = new SoundManager(tapeTaupeGame);

    tapeTaupeGame.init();
    soundManager.init();

    const toggleSoundButton = document.getElementById('toggleSoundButton');
    toggleSoundButton.addEventListener('click', () => {
        soundManager.toggleSound();
        toggleSoundButton.textContent = soundManager.game.soundEnabled ? 'Désactiver le son' : 'Activer le son';
    });

    const playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.addEventListener('click', () => tapeTaupeGame.resetGame());
});


document.addEventListener('DOMContentLoaded', function () {
    var cursor = document.getElementById('cursor');
    var cursorSize = 80;
    var tableDiv = document.querySelector('.table');

    if (tableDiv) {
        tableDiv.addEventListener('mouseover', function () {
            cursor.style.display = 'block';
            document.addEventListener('mousemove', updateCursorPosition);
        });

        tableDiv.addEventListener('mouseout', function () {
            cursor.style.display = 'none';
            document.removeEventListener('mousemove', updateCursorPosition);
        });
    }

    document.addEventListener('click', function () {
        cursor.classList.add('rotate-animation');

        setTimeout(function () {
            cursor.classList.remove('rotate-animation');
        }, 100);
    });

    function updateCursorPosition(e) {
        var x = e.clientX;
        var y = e.clientY;

        cursor.style.left = x - cursorSize / 2 + 'px';
        cursor.style.top = y - cursorSize / 2 + 'px';
    }
});

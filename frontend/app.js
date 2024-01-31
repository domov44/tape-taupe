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

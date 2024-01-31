class SoundManager {
    constructor(game) {
        this.game = game;
        this.audioContext = new AudioContext();
        this.init();
    }

    init() {
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = 0.5;
    }

    async loadSound(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = () => {
                this.audioContext.decodeAudioData(request.response, resolve, reject);
            };

            request.send();
        });
    }

    async playSound(circle) {
        if (this.game.soundEnabled) {
            try {
                let soundUrl = '';
                if (circle.classList.contains('red')) {
                    soundUrl = './sounds/hit_taupe.mp3';
                } else if (circle.classList.contains('blue')) {
                    soundUrl = './sounds/hit_metal.mp3';
                }

                const buffer = await this.loadSound(soundUrl);
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.gainNode);
                source.start(0);
            } catch (error) {
                console.error('Erreur lors du chargement du son :', error);
            }
        }
    }

    toggleSound() {
        this.game.soundEnabled = !this.game.soundEnabled;
        this.gainNode.gain.value = this.game.soundEnabled ? 0.5 : 0;
    }
}

export default SoundManager;

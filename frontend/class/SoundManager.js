class SoundManager {
    constructor(game) {
        this.game = game;
        this.audioContext = null;
        this.gainNode = null;
        this.init();
    }

    init() {
        this.createAudioContext();
    }

    createAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.5;
        }
    }

    closeAudioContext() {
        if (this.audioContext) {
            this.audioContext.close().catch(error => console.error('Erreur lors de la fermeture de AudioContext:', error));
            this.audioContext = null;
            this.gainNode = null;
        }
    }

    async loadSound(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = async () => {
                try {
                    if (this.audioContext.state === 'suspended') {
                        await this.audioContext.resume();
                    }

                    const buffer = await this.audioContext.decodeAudioData(request.response);
                    resolve(buffer);
                } catch (error) {
                    reject(error);
                }
            };

            request.send();
        });
    }

    async playSound(circle) {
        if (this.game.soundEnabled && this.audioContext) {
            try {
                let soundUrl = '';
                if (circle.classList.contains('red')) {
                    soundUrl = './sounds/hit_taupe.mp3';
                } else if (circle.classList.contains('blue')) {
                    soundUrl = './sounds/hit_metal.mp3';
                }

                const buffer = await this.loadSound(soundUrl);

                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }

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

        if (this.game.soundEnabled) {
            this.createAudioContext();
        } else {
            this.closeAudioContext();
        }

        if (this.gainNode) {
            this.gainNode.gain.value = this.game.soundEnabled ? 0.5 : 0;
        }
    }
}

export default SoundManager;

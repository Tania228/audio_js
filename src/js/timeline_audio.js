export default class TimelineAudio {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.isRecording = false;
        this.startTime = null;
    }

    async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.startTime = Date.now();
            console.log('✅ Запись началась');
            return true;
        } catch (error) {
            console.error('Ошибка доступа к микрофону:', error);
            if (error.name === 'NotAllowedError') {
                alert('Вы запретили доступ к микрофону. Разрешите доступ в настройках браузера.');
            } else if (error.name === 'NotFoundError') {
                alert('Микрофон не найден. Подключите микрофон.');
            } else {
                alert('Не удалось получить доступ к микрофону.');
            }
            throw error;
        }
    }

    stopRecording() {
        return new Promise((resolve) => {
            if (this.mediaRecorder && this.isRecording) {
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    this.cleanup();
                    console.log('✅ Запись остановлена');
                    resolve(audioUrl);
                };
                this.mediaRecorder.stop();
                this.isRecording = false;
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }
            } else {
                resolve(null);
            }
        });
    }

    cancelRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.onstop = () => {
                this.cleanup();
            };
            this.mediaRecorder.stop();
            this.isRecording = false;
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
        }
    }

    getRecordingTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    cleanup() {
        this.audioChunks = [];
        this.startTime = null;
    }
}
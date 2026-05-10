import './css/style.css';
import Timeline from './js/timeline.js';
import ParsingCoordinates from './js/parsing_coordinates.js';
import TimelineAudio from './js/timeline_audio.js';

class App {
    constructor() {
        this.timeline = new Timeline();
        this.audioRecorder = new TimelineAudio();
        
        this.postInput = document.getElementById('postInput');
        this.modal = document.getElementById('modal');
        this.submitTextBtn = document.getElementById('submitTextBtn');
        this.audioRecordBtn = document.getElementById('audioRecordBtn');
        this.audioRecordingPanel = document.getElementById('audioRecordingPanel');
        this.audioTimer = document.getElementById('audioTimer');
        this.stopRecordingBtn = document.getElementById('stopRecordingBtn');
        this.cancelRecordingBtn = document.getElementById('cancelRecordingBtn');
        this.manualCoordsInput = document.getElementById('manualCoords');
        this.submitBtn = document.getElementById('submitCoords');
        this.cancelBtn = document.getElementById('cancelCoords');
        
        this.pendingText = null;
        this.pendingAudioUrl = null;
        this.timerInterval = null;
        
        this.init();
    }
    
    init() {
        this.postInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitText();
            }
        });

        this.submitTextBtn.addEventListener('click', () => {
            this.submitText();
        });
        
        this.audioRecordBtn.addEventListener('click', () => {
            this.startAudioRecording();
        });
        
        this.stopRecordingBtn.addEventListener('click', () => {
            this.finishAudioRecording();
        });
        
        this.cancelRecordingBtn.addEventListener('click', () => {
            this.cancelAudioRecording();
        });
        
        this.submitBtn.addEventListener('click', () => this.submitManualCoords());
        this.cancelBtn.addEventListener('click', () => this.cancelManual());
    }
    
    submitText() {
        const text = this.postInput.value.trim();
        if (!text) return;
        
        this.pendingText = text;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    this.timeline.addPost(text, coords, 'text');
                    this.postInput.value = '';
                    this.pendingText = null;
                },
                () => {
                    this.modal.classList.remove('hidden');
                }
            );
        } else {
            alert('Geolocation не поддерживается');
        }
    }
    
    async startAudioRecording() {
        const text = this.postInput.value.trim() || '';
        this.pendingText = text;
        
        try {
            await this.audioRecorder.startRecording();
            this.audioRecordBtn.classList.add('hidden');
            this.audioRecordingPanel.classList.remove('hidden');
            this.startTimer();
        } catch (error) {
            alert('Не удалось получить доступ к микрофону. Проверьте разрешения.');
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            const seconds = this.audioRecorder.getRecordingTime();
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.audioTimer.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    async finishAudioRecording() {
        clearInterval(this.timerInterval);
        
        const audioUrl = await this.audioRecorder.stopRecording();
        
        if (audioUrl) {
            this.pendingAudioUrl = audioUrl;
            this.requestLocationForAudio();
        }
        
        this.resetRecordingUI();
    }
    
    cancelAudioRecording() {
        clearInterval(this.timerInterval);
        this.audioRecorder.cancelRecording();
        this.resetRecordingUI();
        this.pendingText = null;
    }
    
    resetRecordingUI() {
        this.audioRecordBtn.classList.remove('hidden');
        this.audioRecordingPanel.classList.add('hidden');
        this.audioTimer.textContent = '00:00';
    }
    
    requestLocationForAudio() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    this.timeline.addPost(this.pendingText, coords, 'audio', this.pendingAudioUrl);
                    this.postInput.value = '';
                    this.pendingText = null;
                    this.pendingAudioUrl = null;
                },
                () => {
                    this.modal.classList.remove('hidden');
                }
            );
        } else {
            alert('Geolocation не поддерживается');
        }
    }
    
    submitManualCoords() {
        const coordsString = this.manualCoordsInput.value.trim();
        if (!coordsString) {
            alert('Введите координаты');
            return;
        }
        
        try {
            const coords = ParsingCoordinates.parse(coordsString);
            
            if (this.pendingAudioUrl) {
                this.timeline.addPost(this.pendingText, coords, 'audio', this.pendingAudioUrl);
                this.pendingAudioUrl = null;
            } else if (this.pendingText !== null) {
                this.timeline.addPost(this.pendingText, coords, 'text');
            }
            
            this.postInput.value = '';
            this.pendingText = null;
            this.modal.classList.add('hidden');
            this.manualCoordsInput.value = '';
        } catch (error) {
            alert(error.message);
        }
    }
    
    cancelManual() {
        this.modal.classList.add('hidden');
        this.pendingText = null;
        this.pendingAudioUrl = null;
        this.manualCoordsInput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
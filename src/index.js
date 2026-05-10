import './css/style.css';
import Timeline from './js/timeline.js';
import ParsingCoordinates from './js/parsing_coordinates.js';


class App {
    constructor() {
        this.timeline = new Timeline();
        this.postInput = document.getElementById('postInput');
        this.modal = document.getElementById('modal');
        this.manualCoordsInput = document.getElementById('manualCoords');
        this.submitBtn = document.getElementById('submitCoords');
        this.cancelBtn = document.getElementById('cancelCoords');
        
        this.pendingText = null;
        
        this.init();
    }
    
    init() {
        this.postInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitText();
            }
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
                    this.timeline.addPost(text, coords);
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
    
    submitManualCoords() {
        const coordsString = this.manualCoordsInput.value.trim();
        if (!coordsString) {
            alert('Введите координаты');
            return;
        }
        
        try {
            const coords = ParsingCoordinates.parse(coordsString);
            this.timeline.addPost(this.pendingText, coords);
            this.postInput.value = '';
            this.pendingText = null;
            this.modal.classList.add('hidden');
        } catch (error) {
            alert(error.message);
        }
    }
    
    cancelManual() {
        this.modal.classList.add('hidden');
        this.pendingText = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
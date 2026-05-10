export default class TimelinePosts {
    constructor(text, coordinates, type = 'text', audioUrl = null) {
        this.text = text;
        this.coordinates = coordinates;
        this.date = new Date();
        this.type = type;
        this.audioUrl = audioUrl;
    }

    render() {
        const postElement = document.createElement('div');
        postElement.className = `post post-${this.type}`;

        let mediaHtml = '';
        
        if (this.type === 'audio' && this.audioUrl) {
            mediaHtml = `
                <div class="post-audio">
                    <audio controls src="${this.audioUrl}"></audio>
                </div>
            `;
        }

        postElement.innerHTML = `
            <div class="post-text"></div>
            <div class="post-coords"></div>
            <div class="post-date"></div>
            ${mediaHtml}
        `;

        const textElement = postElement.querySelector('.post-text');
        if (this.text) {
            textElement.textContent = this.text;
        } else {
            textElement.style.display = 'none';
        }
        
        postElement.querySelector('.post-coords').textContent = 
            `${this.coordinates.latitude}, ${this.coordinates.longitude}`;
        postElement.querySelector('.post-date').textContent = 
            this.date.toLocaleString();
    
        return postElement;
    }
}
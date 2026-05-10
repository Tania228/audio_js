export default class TimelinePosts {
    constructor(text, coordinates) {
        this.text = text;
        this.coordinates = coordinates;
        this.date = new Date();
    }

    render() {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        postElement.innerHTML = `
            <div class="post-text"></div>
            <div class="post-coords"></div>
            <div class="post-date"></div>
        `;

        postElement.querySelector('.post-text').textContent = this.text;
        postElement.querySelector('.post-coords').textContent = 
            ` ${this.coordinates.latitude}, ${this.coordinates.longitude}`;
        postElement.querySelector('.post-date').textContent = 
        this.date.toLocaleString();
    
        return postElement;
    }
}
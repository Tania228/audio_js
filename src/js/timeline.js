import TimelinePosts from './timeline_posts.js';


export default class Timeline {
    constructor() {
        this.timelineContainer = document.getElementById('timeline');
    }

    addPost(text, coords) {
        const post = new TimelinePosts(text, coords);  
        const postElement = post.render();     

        this.timelineContainer.insertBefore(
            postElement,  
            this.timelineContainer.firstChild  
        );
    }
}
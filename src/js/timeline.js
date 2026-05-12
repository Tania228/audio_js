import TimelinePosts from './timeline_posts.js';
import TimelineAudio from './timeline_audio.js'


export default class Timeline {
    constructor() {
        this.timelineContainer = document.getElementById('timeline');
    }

    addPost(text, coords, type = 'text', audioUrl = null) {
        const post = new TimelinePosts(text, coords, type, audioUrl);
        const postElement = post.render();
        this.timelineContainer.prepend(postElement);
    }
}
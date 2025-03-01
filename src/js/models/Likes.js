export default class List {
    constructor() {
        this.likes = [];
    }

    addlikes(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id){
        const index = this.likes.findIndex(el => el.id === id);
        return index !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}
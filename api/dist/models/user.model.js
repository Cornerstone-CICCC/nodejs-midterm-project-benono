"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class UserModel {
    constructor() {
        this.users = [];
    }
    findAll() {
        return this.users;
    }
    findByMatch(matchId) {
        return this.users.filter((user) => matchId.includes(user.id));
    }
    findById(id) {
        const user = this.users.find((user) => user.id === id);
        if (!user)
            return undefined;
        return user;
    }
    findByUsername(username) {
        const user = this.users.find((user) => user.name === username);
        if (!user)
            return undefined;
        return user;
    }
    findByEmail(email) {
        const user = this.users.find((user) => user.email === email);
        if (!user)
            return undefined;
        return user;
    }
    create(newData) {
        const user = Object.assign({ id: (0, uuid_1.v4)(), likes: [], dislikes: [], matches: [], bio: "", image: "" }, newData);
        this.users.push(user);
        return user;
    }
    edit(id, newData) {
        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1)
            return undefined;
        const updatedUser = Object.assign(Object.assign({}, this.users[index]), newData);
        this.users[index] = updatedUser;
        return updatedUser;
    }
    delete(id) {
        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    }
}
exports.default = new UserModel();

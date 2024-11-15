"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const user_1 = require("../seeds/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserModel {
    constructor() {
        this.users = [];
        if (process.env.NODE_ENV === "development") {
            this.users = user_1.initialUsers;
        }
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
        // if in development mode, some of initial user will like craeted user by gender preference
        if (process.env.NODE_ENV === "development") {
            const seedsId = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
            const initialUser = this.users.filter((data) => seedsId.includes(data.id) && user.gender === data.genderPreference);
            let cnt = 0;
            initialUser.forEach((data) => {
                data.likes.push(user.id);
                cnt++;
                if (cnt === 2)
                    return;
            });
            console.log(this.users);
        }
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

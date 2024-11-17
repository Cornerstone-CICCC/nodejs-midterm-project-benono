import { User } from "../types/user";
import { v4 as uuidv4 } from "uuid";
import { initialUsers } from "../seeds/user";
import dotenv from "dotenv";

dotenv.config();

class UserModel {
  private users: User[] = [];

  constructor() {
    if (process.env.NODE_ENV === "development") {
      this.users = initialUsers;
    }
  }

  findAll(): User[] {
    return this.users;
  }

  findByMatch(matchId: string[]): User[] {
    return this.users.filter((user) => matchId.includes(user.id));
  }

  findById(id: string): User | undefined {
    const user = this.users.find((user) => user.id === id);
    if (!user) return undefined;
    return user;
  }

  findByUsername(username: string): User | undefined {
    const user = this.users.find((user) => user.name === username);
    if (!user) return undefined;
    return user;
  }

  findByEmail(email: string): User | undefined {
    const user = this.users.find((user) => user.email === email);
    if (!user) return undefined;
    return user;
  }

  create(
    newData: Omit<
      User,
      "id" | "matches" | "likes" | "dislikes" | "bio" | "image"
    >
  ): User {
    const user = {
      id: uuidv4(),
      likes: [],
      dislikes: [],
      matches: [],
      bio: "",
      image: "",
      ...newData,
    };
    this.users.push(user);

    // if in development mode, some of initial user will like craeted user by gender preference
    if (process.env.NODE_ENV === "development") {
      const seedsId = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
      const initialUser = this.users.filter(
        (data) =>
          seedsId.includes(data.id) && user.gender === data.genderPreference
      );
      let cnt = 0;
      initialUser.forEach((data) => {
        data.likes.push(user.id);
        cnt++;
        if (cnt === 2) return;
      });
    }
    return user;
  }

  edit(id: string, newData: Partial<User>): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    const updatedUser = {
      ...this.users[index],
      ...newData,
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

export default new UserModel();

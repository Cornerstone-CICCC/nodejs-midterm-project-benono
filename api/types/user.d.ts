export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: Gender;
  genderPreference: Gender;
  bio: string;
  image: string;
  likes: string[]; // array of user ids
  dislikes: string[]; // array of user ids
  matches: string[]; // array of user ids
};

export interface UserPayload {
  id: string;
  username: string;
}

export type Gender = "male" | "female";

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Y_pBj6Vt)
# NodeJS - Midterm Project

**Goal:** Create a site with BREAD (Browse, Read, Edit, Add, Delete) functionality using Node.js and Express as backend.

## Instructions 

- You are free to create any type of site as long as it has CRUD/BREAD functionality and using MVC pattern.
- Keep the database in-memory or inside a model (No external database).
- The site must have login and signup.
- Use TypeScript.
- Use `bcrypt` package to hash and verify the password [https://www.npmjs.com/package/bcrypt].
- Use `uuid` package to generate unique ids.
- Use cookies or JWT (or both) to keep user information in the browser after they login. Clear the cookies when they log out.
- Create middleware so that BREAD routes can only be accessed if the user is authenticated or logged in.
- You can choose to build your frontend/view using Astro, EJS, or another library such as React if you prefer.

## Example Routes and Requests for BREAD

- **Browse:** `GET /posts`
- **Read:** `GET /posts/1`
- **Edit:** `PUT /posts/1`
- **Add:** `POST /posts`
- **Delete:** `DELETE /posts/1`
---
- **Register** `POST /users/register`
- **Login** `POST /users/login`

## Sample Ideas

- Online Store
- Blog
- To-Do App
- Employee Management System
- Music Player
- Movies App
- Recipe App
- Diary App

## Presentation

Individual presentation will be on next Monday. During the presentation of your website, please follow this flow:

1. Signup
2. Login
3. Add an item
4. Show all items in a list
5. View individual item (by clicking a button or link)
6. Edit item
7. Delete item
8. Log out

Good luck!

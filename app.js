import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory (needed for ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Array to store our todos (temporary storage)
let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build a Todo App", completed: false },
];

// Counter for generating unique IDs
let nextId = 3;

// HOME ROUTE - Display all todos
app.get("/", (req, res) => {
  res.render("index", { todos: todos });
});

// ADD TODO ROUTE
app.post("/add", (req, res) => {
  // Get the task from the form submission
  const task = req.body.task;

  // Create a new todo object
  const newTodo = {
    id: nextId++,
    task: task,
    completed: false,
  };

  // Add the new todo to our array
  todos.push(newTodo);

  // Redirect back to the home page
  res.redirect("/");
});

// TOGGLE COMPLETE ROUTE
app.post("/toggle/:id", (req, res) => {
  // Get the ID from the URL parameter
  const todoId = parseInt(req.params.id);

  // Find the todo with this ID
  const todo = todos.find((t) => t.id === todoId);

  // If found, toggle its completed status
  if (todo) {
    todo.completed = !todo.completed;
  }

  // Redirect back to home page
  res.redirect("/");
});

// DELETE TODO ROUTE
app.post("/delete/:id", (req, res) => {
  // Get the ID from the URL parameter
  const todoId = parseInt(req.params.id);

  // Filter out the todo with this ID (remove it from array)
  todos = todos.filter((t) => t.id !== todoId);

  // Redirect back to home page
  res.redirect("/");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running port ${port}`);
  });
}

export default app;

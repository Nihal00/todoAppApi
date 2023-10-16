const express = require('express');
const fs = require('fs');

const PORT = 8001;

const app = express();

app.use(express.json());

//POST create a todo
app.post('/todo', (req, res) => {
    try {
        const newTodo = {
            id: req.body.id || Math.random().toString(),
            title: req.body.title,
            data: new Date(),
            isCompleted: req.body.isCompleted,
        };

        let fileData = JSON.parse(fs.readFileSync('./database.json').toString());
        
        fileData.todos.push(newTodo);

        fs.writeFileSync('./database.json', JSON.stringify(fileData));

        res.status(201).send({
            status: 201,
            message: 'Created successfully!',
        })
        
    } catch(err) {
        console.log("Error: ", err);
        res.status(400).send({ 
            status: 400,
            message: "Failed to create a todo!",
        })
    }
})

//Get todo from the list by ID
app.get('/todo/:id', (req, res) => {
    try{
        const todoId = req.params.id;

        const fileData = JSON.parse(fs.readFileSync('./database.json').toString());

        const todoList = fileData.todos;

        let todoWithId = todoList.filter((todo) => todo.id == todoId);

        res.status(200).send({
            status: 200,
            message: 'Successfully fetched the todo!',
            data: todoWithId
        })

    } catch(err) {
        res.status(400).send({
            status: 400,
            message: 'Failed to fetch a todo'
        })
    }
});

//Getting all the list of todos
app.get('/todos', (req, res) => {
    try{
        const fileData = JSON.parse(fs.readFileSync('./database.json').toString());

        res.status(200).send({
            status: 200,
            message: 'Fetched list',
            data: fileData.todos
        })

    } catch(err) {
        res.status(400).send({
            status: 400,
            message: 'Failed to fetch a todo',
            data: err
        })
    }
})

//PUT - update a todo
app.put('./todo', (req, res) => {
    try{
        const todoId = req.body.id;
        const updatedBody = req.body;

        const fileData = JSON.parse(fs.readFileSync('./database.json').toString());

        fileData.todos.forEach((todo, idx) => {
            if(todo.id == todoId) {
                fileData.todos[idx].title = updatedBody.title;
                fileData.todos[idx].isCompleted = updatedBody.isCompleted;
            }
        })

        fs.writeFileSync('./database.json', JSON.stringify(fileData));

        res.status(201).send({
            status: 201,
            message: "updated",
            data: fileData.todos
        })

    } catch(err) {
        res.status(400).send({
            status: 400,
            message: 'error',
            data: err
        })
    }
})

//PUT - update a todo
app.patch('./todo', (req, res) => {
    try{
        const todoId = req.body.id;
        const updatedBody = req.body;

        const fileData = JSON.parse(fs.readFileSync('./database.json').toString());

        fileData.todos.forEach((todo, idx) => {
            if(todo.id == todoId) {
                
                if(req.body.title) {
                    fileData.todos[idx].title = updatedBody.title;
                }

                if(req.body.isCompleted === true || req.body.isCompleted === false) {
                    fileData.todos[idx].isCompleted = updatedBody.isCompleted;
                }
            }   
        })

        fs.writeFileSync('./database.json', JSON.stringify(fileData));
        res.status(201).send({
            status: 201,
            message: "updated",
            data: fileData.todos
        })

    } catch(err) {
        res.status(400).send({
            status: 400,
            message: 'error',
            data: err
        })
    }
})


//DELETE - Delete a todo based on ID
app.delete('./todo/:id', (req, res) => {
    try{
        const todoId = Number(req.params.id);

        let fileData = JSON.parse(fs.readFileSync('./database.json').toString());

        let newTodo = fileData.todos.filter(todo => todo.id !== todoId);

        fileData.todos = newTodo;

        fs.writeFileSync('./database.json', JSON.stringify(fileData));

        res.status(400).send({
            status: 200,
            message: "deleted",
            data: fileData.todos
        })

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Failed to delete a todo',
            data: err
        })
    }
})


app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})
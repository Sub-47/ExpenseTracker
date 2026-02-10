const express = require('express');
const cors=require('cors');
require(`dotenv`).config();
const pool=require('./db'); 
const expensesRouter = require('./routes/expenses');
const app=express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(`/api/expenses`,expensesRouter);
app.get('/',(req,res)=>{
    res.json({message:'Expense Tracker API is running!'});
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// basic error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    next();
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}!`)
});
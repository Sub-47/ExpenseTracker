const express=require('express');
const router=express.Router();
const pool=require('../db');
const authenticateToken = require('../middleware/auth');

function validateExpense(body){
    const errors=[];
    const sanitized={};

    const userId=parseInt(body.user_id,10);
    if(Number.isNaN(userId)){
      errors.push(`user_id is required and must be an integer`);
    }
    else{
        sanitized.user_id=userId;
      }
      const amount=Number(body.amount);
      if(!Number.isFinite(amount)){
        errors.push(`amount is required and must be a valid sum`);
      }
      else{
          sanitized.amount=amount;
        }

        const category=body.category?.trim();
        if(!category){
          errors.push(`Category is required and must be valid`);
        }
        else{
            sanitized.category=category;
          }

          // optional fields
          const description = body.description?.trim();
          sanitized.description = description || null;

          const date = body.date;
          sanitized.date = date || null;


          return{ valid:errors.length===0,errors,sanitized};
        }

        router.get('/',authenticateToken, async (req, res) => {
          const userId = req.user.userId;


          try {
            const result = await pool.query(
              'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
              [userId]
            );
            return res.json(result.rows);
          } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
          }
      });

      router.post('/',authenticateToken, async (req, res) => {
        req.body.user_id = req.user.userId;
        const{valid,errors,sanitized}=validateExpense(req.body);
        if(!valid){
          return res.status(400).json({errors});
        }
        const{user_id,amount,category,description,date}=sanitized;
        try {
          const result = await pool.query(
            'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, amount, category, description, date]
          );

          res.status(201).json(result.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Server error' });
        }
    });

    router.delete('/:id',authenticateToken,async(req,res)=>{
      const expenseId=parseInt(req.params.id,10);
      if (Number.isNaN(expenseId)){
          return res.status(400).json({error: `invalid expense id`});

        }
        try{
          const result = await pool.query(
            `DELETE FROM expenses WHERE id=$1 AND user_id=$2 RETURNING *`,[expenseId,req.user.userId]
          );

          if(result.rows.length===0){
            return res.status(404).json({error:`Expense not found`});

          }
          res.json({message:`Expense deleted successfully`,expense:result.rows[0]});
        }catch(err){
          console.error(err.message);
          res.status(500).json({error:`Server error`});
        }


    });
    router.put('/:id',authenticateToken,async(req,res)=>{

      const expenseId = parseInt(req.params.id, 10);
      if (Number.isNaN(expenseId)) {
          return res.status(400).json({ error: 'Invalid expense id' });
        }
        req.body.user_id = req.user.userId;

        const { valid, errors, sanitized } = validateExpense(req.body);

        if (!valid) {
            return res.status(400).json({ errors });
          }
          const { amount, category, description, date } = sanitized;
          try{
            const result=await pool.query(
              `UPDATE expenses
              SET amount=$1, category=$2, description=$3, date=$4 WHERE id=$5 AND user_id=$6 RETURNING *`,[amount,category,description,date,expenseId,req.user.userId]
            );

            if(result.rows.length===0){
              return res.status(404).json({error:`Expense not found`});

            }
            res.json({message:`Expense updated succesfully`,expense:result.rows[0]});
          }
          catch(err){
              console.log(err.message);
              res.status(500).json({error:`Server error`});
            }
        });
        module.exports=router;
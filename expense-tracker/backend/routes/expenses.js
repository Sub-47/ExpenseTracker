const express=require('express');
const router=express.Router();
const pool=require('../db');

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

        router.get('/:userId', async (req, res) => {
          const userId = parseInt(req.params.userId,10);
          if (Number.isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user id' });
          }

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

      router.post('/', async (req, res) => {
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
    module.exports=router;
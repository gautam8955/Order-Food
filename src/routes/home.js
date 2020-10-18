const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const addProduct = require('../models/addProduct');

//Home Page
router.get('/', (req, res, next) => {
	
	addProduct.find( function(err, result) {
		if (err) throw err;
		
		res.render('food.ejs', {"foods": result});
})
})

//Login Profile
router.get('/', function (req, res, next) {
	Customer.findOne({unique_id:req.session.userId},function(err,data){
		
		if(!data){
			res.redirect('/');
		}else{
			
			addProduct.find( function(err, result) {
				if (err) throw err;
				
				res.render('food.ejs', { "foods": result});
		})
			
		}
	});
});


//Sign Up page
router.get('/signUp', function (req, res, next) {
	return res.render('signUp.ejs');
});

module.exports = router;
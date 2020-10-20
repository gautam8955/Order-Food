const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const addProduct = require('../models/addProduct');
const Restaurant = require('../models/restaurant');

//Home Page
router.get('/', (req, res, next) => {
	
	Restaurant.find( function(err, result) {
		if (err) throw err;
		//console.log(result)
		
		res.render('home.ejs', {"foods": result});
})
})



//Sign Up page
router.get('/signUp', function (req, res, next) {
	return res.render('signUp.ejs');
});

module.exports = router;
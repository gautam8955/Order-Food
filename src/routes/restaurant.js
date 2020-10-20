const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const addProduct = require('../models/addProduct');
const Order = require('../models/placeOrder');
const Customer = require('../models/customer');

//Restaurant Register
router.get('/restaurant-register', function (req, res, next) {
	return res.render('restaurantRegister.ejs');
});

//Restaurant Register
router.post('/restaurant-register', function(req, res, next) {
	//console.log(req.body);
	var restaurantInfo = req.body;


	if(!restaurantInfo.email || !restaurantInfo.name || !restaurantInfo.phone_no || !restaurantInfo.location  || !restaurantInfo.password || !restaurantInfo.passwordConf){
		res.send();
	} else {
		if (restaurantInfo.password == restaurantInfo.passwordConf) {

			Restaurant.findOne({email:restaurantInfo.email},function(err,data){
				if(!data){
					var c;
					Restaurant.findOne({},function(err,data){

						if (data) {
							//console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new Restaurant({
							unique_id:c,
							email:restaurantInfo.email,
							name: restaurantInfo.name,
                            phone_no: restaurantInfo.phone_no,
                            location: restaurantInfo.location,
							password: restaurantInfo.password,
							passwordConf: restaurantInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

// restaurant login
router.get('/restaurant/login', function (req, res, next) {
	return res.render('restaurantLogin.ejs');
});

//Login
router.post('/restaurant/login', function (req, res, next) {
	//console.log(req.body);
	Restaurant.findOne({email:req.body.email}, async (err,data) => {
		if(data){

			const isMatch = await bcrypt.compare(data.password, req.body.password)
			
			if(!isMatch){
				
				req.session.userId = data.unique_id;
				
				res.send({"Success":"Success!"});
				
			}else{	
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});


//Restaurant forget password
router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

//Restaurant Forget Password
router.post('/forgetpass', function (req, res, next) {
	Restaurant.findOne({email:req.body.email},function(err,data){
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					//console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});





//Restaurant profile.
router.get('/profile', function (req, res, next) {
	Restaurant.findOne({unique_id:req.session.userId},function(err,data){
		
		if(!data){
			res.redirect('/');
		}else{
				res.render('profile.ejs', {"name":data.name,"email":data.email});
			
		}
	});
});

//Restaurant Add Food Product 
router.get('/add-product', function (req, res, next) {
	return res.render('addProduct.ejs');
});

//Restaurant Add Food Product 
router.post('/add-product', async (req, res, next) => {
	const product = new addProduct(req.body);
	try {
		await product.save();
		res.status(201).send(product);
	} catch (e) {
		res.status(400).send(e);
	}
});

//View list of all placed orders by customers
router.get('/viewOrder',  (req, res, next) => {
	const session = req.session.userId
	//console.log(session)
	Restaurant.findOne({unique_id: session}, (err, data) => {
		if(err) throw err;

		//console.log(data.name)
		const restaurantName = data.name;


		Order.find({restaurant: restaurantName}, function(err, result) {
			if (err) throw err;
			//console.log(result)
	
			res.render('orders.ejs', {"foods": result});
	})
	})


	

}) 





//Showing details of placed order with customer details.
router.get('/restaurant/getFoodDetail/:id/:sessionID',  (req, res, next) => {
	const prodId = req.params.id;
	const session = req.params.sessionID;
	addProduct.findOne({_id:prodId}, async function(err, result) {
			if (err) throw err;
			Customer.findOne({unique_id:session}, async (err, data) => {
				res.render('orderDetail.ejs', {food:result, customer:data});
			})
			
			
	})

})

//Confirming the placed order or dilevered the placed order.

router.get('/delivered/:id', (req, res, next) => {
	var orderID = req.params.id
	Order.deleteOne({id: orderID}, (err, data) => {
		if(err){
			res.json(err)
		}
		else{
			res.redirect('/viewOrder')
		}	
	})
})

module.exports = router;
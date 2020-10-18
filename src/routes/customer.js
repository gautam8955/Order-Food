const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { sendWelcomeEmailCustomer } = require('../emails/account')
const Customer = require('../models/customer');
const addProduct = require('../models/addProduct');
const Order = require('../models/placeOrder');

//Home
router.get('/customer', function (req, res, next) {
	return res.render('customerRegister.ejs');
});

//Customer Registration
router.post('/customer', function(req, res, next) {
	//console.log(req.body);
	var customerInfo = req.body;


	if(!customerInfo.email || !customerInfo.name || !customerInfo.phone_no || !customerInfo.location || !customerInfo.preference || !customerInfo.password || !customerInfo.passwordConf){
		res.send();
	} else {
		if (customerInfo.password == customerInfo.passwordConf) {

			Customer.findOne({email:customerInfo.email},function(err,data){
				if(!data){
					var c;
					Customer.findOne({},function(err,data){

						if (data) {
							//console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new Customer({
							unique_id:c,
							email:customerInfo.email,
							name: customerInfo.name,
                            phone_no: customerInfo.phone_no,
                            location: customerInfo.location,
                            preference: customerInfo.preference,
							password: customerInfo.password,
							passwordConf: customerInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					sendWelcomeEmailCustomer(customerInfo.email, customerInfo.name)
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

//Customer Login
router.get('/customer/login', function (req, res, next) {
	return res.render('customerLogin.ejs');
});

//Customer Login
router.post('/customer/login', function (req, res, next) {
	//console.log(req.body);
	Customer.findOne({email:req.body.email}, async (err,data) => {
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


//Customer profile.
router.get('/customerProfile', function (req, res, next) {
	Customer.findOne({unique_id:req.session.userId},function(err,data){
		
		if(!data){
			res.redirect('/');
		}else{
				res.render('profile.ejs', {"name":data.name,"email":data.email});
			
		}
	});
});

//Customer Logout
router.get('/logout', function (req, res, next) {
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

//Customer Forget Password
router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

//Customer Forget Password
router.post('/forgetpass', function (req, res, next) {
	Customer.findOne({email:req.body.email},function(err,data){
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

//To get Menu of food item
 router.get('/getFoodDetail/:id',  (req, res, next) => {
	const prodId = req.params.id;
	const session = req.session.userId
	addProduct.findOne({_id:prodId}, async function(err, result) {
			if (err) {
				throw err;
			}
			
			else if(session === undefined ) {
				//console.log(session)
				res.redirect('/customer/login')
			}
			else{
				//console.log(session)
				res.render('cart.ejs', {food:result});
			}
			
			
	})

})

//For storing placed order details in database.
	router.get('/getFoodDetail/placeOrder/:id', async (req, res, next) => {
		const result = req.params.id;
		const session = req.session.userId
		console.log(result);
		console.log(session)
		var rs= {
			id: result,
			sessionID: session
		}
		const order = new Order(rs);
		try{
			//console.log(order)
			await order.save();
			//res.send(order);
			res.render('thankYou.ejs')
		}
		catch(e){
			res.send(e);
		}
	})








module.exports = router;
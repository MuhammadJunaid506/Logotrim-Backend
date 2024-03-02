const express = require("express")
const router = express.Router()
const plan = require("../models/plan");
const { ApiResponse } = require("../helpers");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



exports.payment = async (req, res, next) => {
    try {
      let list = await stripe.customers.list({ email: req.body.email });     
     plan.findById(req.body.plan, async function (err, docs) {
      console.log('docs',docs)
        if (err) {
            res.json(ApiResponse({},"Plan not found",false))
        } else {
        
          let discount = (docs.discount / 100) * docs.price;
          let discountedPrice = docs.price - discount;
          req.body.planObj = docs;
            req.body.amount = discountedPrice
            if (list.data.length == 0) {
                stripe.customers
                  .create({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    source: req.body.stripeToken,
                  }).then(async (customer) => {
                    console.log("3_________________________________________________________")
                   const token = req.body.stripeToken; // Using Express
                    const charge = await stripe.charges.create({
                      customer: customer.id,
                      amount: parseFloat(req.body.amount) * 100,
                      description: req.body.description,
                      currency: "USD",
                    });
                    console.log("4_________________________________________________________")
                    console.log("charge",charge)
                    next();
                  }).catch((err) => {
                    res.json(ApiResponse({},err.message,false))
                    console.log("______)))))))))))))))))_______________________",err);
                    return;
                  });
              } else {

                  const cardList = await stripe.customers.listSources(
                    list.data[0].id,
                    { object: "card" }
                  );

                  console.log("cardList",cardList)

                  const tok = await stripe.tokens.retrieve(
                    req.body.stripeToken
                  );

                  let exists = cardList.data.filter(item=>item.fingerprint == tok.card.fingerprint)

                  console.log("exists",exists)
                  if(!exists.length > 0){
                    const card = await stripe.customers.createSource(
                        list.data[0].id,
                         {source: req.body.stripeToken}
                       );

                       const token = req.body.stripeToken; 
                       const charge = await stripe.charges.create({
                         customer: list.data[0].id,
                         source:card.id,
                         amount: parseFloat(req.body.amount) * 100,
                         description: req.body.description,
                         currency: "USD",
                       });
                       next();
                  }else{
                    const token = req.body.stripeToken; 
                    const charge = await stripe.charges.create({
                      customer: list.data[0].id,
                      source:exists[0].id,
                      amount: parseFloat(req.body.amount) * 100,
                      description: req.body.description,
                      currency: "USD",
                    });
        
                   
                    next();
                  }               
              }
        }
      });

    
      
      
    } catch (error) {
      console.log("________________________________error_________________________________________");
        res.json(ApiResponse({},error.message,false))
    }    
};
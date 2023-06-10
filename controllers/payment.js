require("dotenv").config();

const services = require('../services');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const db = require("../models");

const payment = async (req, res) => {
    try {
    //   const {user_id} = req.user;
    //   console.log(user_id);

        const customer = await stripe.customers.create({
          metadata: {
            // user_id: user_id,
            // doer_id: req.body.deliverables[0].deliverable_application.student_id,
            // deliverable_id: req.body.deliverables[0].deliverable_id,
            // application_id: req.body.deliverables[0].deliverable_application.application_id
          }
        })
    
        const line_items = req.body.order_details.map(order_detail => {
          return {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: order_detail.title,
              },
              unit_amount: order_detail.price
            },
            quantity: 1
          }
        });
  
      const session = await stripe.checkout.sessions.create({
        line_items,
        customer: customer.id,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success.html`,
        cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      });
      res.send({url: session.url});
      
    } catch (error) {
      console.log(error);
    }
  };
  
  const createHistory = async (customer, data, lineItems) => {
//   const newTransaction = await db.Transaction.create({
//     poster_id: customer.metadata.poster_id,
//     doer_id: customer.metadata.doer_id,
//     deliverable_id: customer.metadata.deliverable_id,
//     price: data.amount_total,
//     status: data.payment_status
//   });

//   const application = await db.Application.findOne({
//     where: { application_id: customer.metadata.application_id },
//   });

//   const project_update = await db.Project.update({ status: "Finished" }, {
//       where: { project_id: application.project_id },
//     });

//   const application_update = await db.Application.update({status: 'Finished'}, {
//     where: { application_id: customer.metadata.application_id },
//     });

//   const deliverable_update = await db.Deliverable.update({status: 'Finished'}, {
//     where: { deliverable_id: customer.metadata.deliverable_id },
//     });

//   console.log("Process: ", newTransaction.toJSON());
console.log('aaa');
};

// Stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret ;

endpointSecret = process.env.STRIPE_SECRET_KEY;

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let data; 
  let eventType;

  if (endpointSecret) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Webhook verified");
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  data = event.data.object;
  eventType = event.type;
  }
  else {
    data = req.body.data.object;
    console.log('data1', data);
    eventType = req.body.type; 
    console.log('eventType', eventType);
  }
  console.log(eventType);
  // Handle the event
  if (eventType === "checkout.session.completed") {
    // console.log('customer', data.customer);
    const cus = await stripe.customers.retrieve(
      data.customer
    ).then((customer) => {
      console.log("data:", data);
      stripe.checkout.sessions.listLineItems(
        data.id,
        {},
        function(err, lineItems) {
          console.log("Line_items", lineItems);
          console.log('cus234', customer);
          console.log("data:", data);

          createHistory(customer, data, lineItems)
        }
      );
    }).catch(err => console.log(err.message));
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end;
};

// const getAllTransactions = async (req, res) => {
//   try {
//       const response = await services.getAllTransactions(req.query);
//       return res.status(200).json(response);
//   } catch (error) {
//       console.log(error);
//       throw new InternalServerError(error);
//   }
// };

module.exports = {payment, stripeWebhook};
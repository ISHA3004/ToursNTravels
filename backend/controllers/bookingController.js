const Booking = require("../models/bookingModel")
const Tour = require("../models/tourModel")
const Hotel = require("../models/hotelModel")
const Restaurant = require("../models/restaurantModel")
const catchAsync = require("../utils/catchAsync")
const factory = require('../utils/handlerFactory')
const AppError = require("../utils/appError")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.setModelUserIds = (req, res, next) => {
   if (req.params.tourId) {
      if (!req.body.tour) req.body.tour = req.params.tourId
   }
   if (req.params.hotelId) {
      if (!req.body.hotel) req.body.hotel = req.params.hotelId
   }
   if (req.params.restaurantId) {
      if (!req.body.restaurant) req.body.restaurant = req.params.restaurantId
   }
   if (!req.body.user) req.body.user = req.user.id
   next();
}


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
   const { item, numberOfPeople, startDate } = req.body;
   const { price, name, summary, photo, slug } = item;

   const successURL = `${req.protocol}://${req.get('host')}/tours`;
   const cancelURL = `${req.protocol}://${req.get('host')}/tours/${slug}`;

   const images = photo.map(photo => String(photo));
   const unitAmount = price * numberOfPeople * 100;

   const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      success_url: successURL,
      cancel_url: cancelURL,
      line_items: [{
         price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: {
               name,
               description: summary,
               images,
            },
         },
         quantity: 1,
      }],
      metadata: {
         startDate,
         numberOfPeople
      }
   });

   res.status(200).json({
      status: 'success',
      session
   });
});


exports.checkoutWebhook = catchAsync(async (req, res, next) => {
   const { 'stripe-signature': sig } = req.headers;

   try {
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SECRET_WEBHOOK);

      // TODO: Handle the event based on its type
      // if (event.type === 'checkout.session.completed') {
      //   ...
      // }

   } catch (err) {
      return next(err); // Let the catchAsync middleware handle the error
   }

   res.status(200).json({ received: true });
});









exports.getAllBookings = factory.getAll(Booking)

exports.getBooking = factory.getOne(Booking)

exports.createBooking = factory.createOne(Booking)

exports.updateBooking = factory.updateOne(Booking)

exports.deleteBooking = factory.deleteOne(Booking)
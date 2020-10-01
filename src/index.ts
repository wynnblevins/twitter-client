// get dot env for local environment values
require('dotenv').config();
const express    = require('express');
const morgan     = require('morgan');
const bodyParser = require("body-parser");
const commons    = require('@market-predictor/market-predictor-commons')

// require the node twitter and kafka libraries
const Twitter = require('twitter');
const kafka   = require('kafka-node');

const tweetStreamService = require('./services/tweetStream.service')();

// create a twitter client
const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let app: any = express();

// Define middleware here
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json())



app = require('./routes/tweetStream.controller')(app, twitterClient, kafka, commons.TweetStream, tweetStreamService);

// Get port from environment and store in Express
const port: any = process.env.PORT || 3000;
app.set('port', port);

// Start the server listening on specified port
app.listen(port, () => {
	console.log(`App listening on PORT: ${port}`)
});
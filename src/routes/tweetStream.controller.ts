const predictionController = (app: any, twitterClient: any, kafka: any, TweetStream: any, tweetStreamService: any) => {
    app.get('/api/tweetStreams', (req: any, res: any) => {
        res.send();
    });

    app.post('/api/tweetStreams', (req: any, res: any) => {
        // keeping track of existing tweet streams
        const newTweetStream = new TweetStream({
            stock: req.body.stock,
            searchTerm: req.body.searchTerm,
            running: req.body.running
        })

        // if we reach this line, the save was successful, so start the tweet stream if running is true
        if (req.body.running) {
            // setting timeout of 5 seconds to avoid 420 errors
            const stream = twitterClient.stream('statuses/filter', { track: req.body.searchTerm });

            newTweetStream.save(() => {
                startTweetStream(stream, req)        
            })

            res.sendStatus(201);
        }
    });

    function startTweetStream(stream: any, req: any) {
        // create a kafka producer
        const client = new kafka.KafkaClient();
        const Producer = kafka.Producer;
        const producer = new Producer(client);

        producer.on('ready', () => {
            tweetStreamService.startTweetStream(stream, producer, req);
        });
    }

    return app;
};

module.exports = predictionController;
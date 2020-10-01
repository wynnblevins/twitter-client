module.exports = () => {
    let service = {
        startTweetStream: (stream: any, producer: any, req: any) => {
            stream.on('data', (tweet: any) => {
                const message = { 
                    tweetText: tweet.text,
                    stock: req.body.stock,
                    term: req.body.searchTerm
                };

                producer.send([{topic: 'tweets', messages: [ JSON.stringify(message) ]}], (err: any, data: any) => {
                    console.log(tweet)    
                });
            });

            stream.on('error', (e: any) => {
                console.error(`Error encountered: ${e}`);
            });
        }
    }

    return service;
}
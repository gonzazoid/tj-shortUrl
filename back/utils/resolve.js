module.exports = function(mongoCollection, redisClient){
     return function(shortURL){
        return new Promise(async function(resolve, reject){
            redisClient.get(shortURL, async (err, res) => {
                if(res !== null){
                    resolve(res);
                    return;
                }
                const alias = await mongoCollection.findOne({short: shortURL});
                if(alias !== null){
                    console.log(alias);
                    redisClient.set(shortURL, alias.full);
                }
                resolve(alias.full);
            })
        });
     }
};

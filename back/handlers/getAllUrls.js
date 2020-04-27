module.exports = function(ctx){
    return async function(req, res){
        try{
            const aliases = await ctx.aliases.find({session: req.sessionID}, {projection: {_id: 0, short: 1, full: 1}}).toArray();
            console.debug("mongo!!!: ", aliases, req.sessionID);
            res.send(aliases)
        }catch(e){
            ctx.log('api', 'err', e);
            res.sendStatus(500);
        }
    }
}

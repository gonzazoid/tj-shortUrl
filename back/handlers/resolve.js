module.exports = function(ctx){
    return async function (req, res) {

        const { url } = req.params;
        try{
            const alias = await ctx.resolve(url);
            if(alias){
                res.redirect(302, alias);
            }else{
                ctx.log('resolver', 'warn', `${alias} not found`);
                res.sendStatus(404);
            }
        }catch(e){
            ctx.log('resolver', 'err', e);
            res.sendStatus(500);
        }
    };
};

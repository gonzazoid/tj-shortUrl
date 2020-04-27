const shortid = require('shortid');


module.exports = function(ctx){

    const insert = function(alias){
        return ctx.aliases.updateOne({short: alias.short}, { $setOnInsert: alias}, { upsert: true });
    }

    const inserted = function(insert){
        return insert.result.upserted && insert.result.upserted.length > 0;
    }

    const checkPayload = function(body){
        if(!body) return false;
        if(!body.full || 'string' !== typeof body.full) return false;
        if(body.short && 'string' !== typeof body.short) return false;
        return true;
    }

    return async function(req, res) {
        try{

            if(!checkPayload(req.body)){
                ctx.log('api', 'warn', `wrong payload: ${JSON.stringify(req.body)}`);
                res.sendStatus();
            }

            if(req.body.short){

                const {short, full} = req.body;

                const insertResult = await insert({ short, full, session: req.sessionID });
                const ok = inserted(insertResult);

                res.send(ok ? {ok: 200, short} : {err: 'already exists'});

            }else{
                // generate short id
                let ok = false;
                let counter = 0; // TODO move this to configs
                const {full} = req.body;
                let short = '';
                while(!ok && counter < 5){
                    short = shortid.generate();
                    const insertResult = await insert({ short, full, session: req.sessionID });
                    ok = inserted(insertResult);
                    counter += 1;
                }
                res.send(ok ? {ok: 200, short} : {err: 'can`t generate unique id'});
            }
        }catch(e) {
            ctx.log('api', 'err', e);
            res.sendStatus(500);
        }
    };
}

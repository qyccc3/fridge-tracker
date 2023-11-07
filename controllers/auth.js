import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import DatabaseManager from '../db.js';
import 'dotenv/config';
import config from 'config';

const db = DatabaseManager.getInstance();
const host = config.get('db.host');
const database = config.get('db.name');

await db.configureDB(host, 5432, database);
await db.initModels();

const opts = {
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['jwtToken'];
        }
        return token;
    }
}

passport.use(
    new Strategy(opts, async(jwtPayload, done) => {
        const user = await db.findOneUser(jwtPayload.name);
        if (user){
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
)

passport.use(
    new LocalStrategy(async(username, password, done) => {
        const user = await db.checkUser(username, password);
        if (user.length > 0) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
))

async function deauthenticateUser(req, res, next){
    const toekn = req.cookies.jwtToken;
    const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedUser

    res.cookies('jwtToken', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
    })
    return next();
}

async function setJwtCookie(req, res, next){
    const username = req.body.username;
    const token = jwt.sign({ name: username }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.cookie('jwtToken', token, {
        httpOnly: true,
        secure: true,
    })
    next();
}

async function checkUserAuthenticated(req, res, next){
    const token = req.cookies.jwtToken;
    if(!token){
        res.locals.isAuthenticated = false;
        return next();
    }
    try{
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedUser;
        res.locals.isAuthenticated = true;
    }
    catch(error){
        res.locals.isAuthenticated = false;
    }
    return next();
}

export{
    deauthenticateUser,
    setJwtCookie,
    checkUserAuthenticated,
}
import express from 'express';
import passport from 'passport';

import {
    setJwtCookie,
} from '../controllers/auth.js';

let router = express.Router();

router.get('/', function(req, res, next){
    res.render('login');
})

router.post('/',
    passport.authenticate('local', { session: false}),
    setJwtCookie,
    (req, res) => {
        res.status(200).json({ message: "Logged in successfully"});
    }
);

export default router;
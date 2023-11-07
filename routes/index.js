import express from 'express';
import passport from 'passport';

let router = express.Router();
/* GET home page. */
router.get('/', 
      passport.authenticate('jwt', { session: false, failureRedirect: '/login'}),
      (req, res) => {
            return res.render('index');
      }
);

export default router;

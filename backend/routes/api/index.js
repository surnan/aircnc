// backend/routes/api/index.js
const router = require('express').Router();

router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});


/*
1 - hard code username pulled from USERS table
  - combined with login token
  - RES.SEND

2 - based on JWT cookie, get USER
 -  RES.SEND

3 - error if no JWT/LOGIN cookie 
*/


//1
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {username: 'Demo-lition'}});
  setTokenCookie(res, user);
  return res.json({ user: user });
});


//2
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);
router.get('/restore-user',(req, res) => {
    return res.json(req.user);
  }
);

//3
const { requireAuth } = require('../../utils/auth.js');
router.get('/require-auth',requireAuth,(req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;
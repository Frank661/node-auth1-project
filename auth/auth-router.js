const router = require('express').Router();
const users = require('../users/users-model');
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    try{
        const saved = await users.add(user);
        res.status(201).json(saved)
    } catch (err) {
        console.log(err);
        res.statusMessage(500).json(err)
    }
});


router.post('/login', async (req, res) =>{
    let {username, password} = req.body;

    try{
        const user = await users.findBy({username}).first();
        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json({message: 'Welcome, login success'})
        } else { 
            res.status(401).json({message:'invalid username or password'})
        } 
    } catch (err) {
        res.status(500).json({err: "error"})
    }
})

router.get('/logout', (req, res) => {
    if(req.session && req.session.user) {
        req.session.destroy(err => {
            if (err) {
                res.send('unable to log out.')
            } else {
                res.send('until next time buz')
            }
        })
    } else {
        res.end();
    }
})


module.exports = router;

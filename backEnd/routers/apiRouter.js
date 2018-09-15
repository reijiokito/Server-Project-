const express = require('express');
const apiRouter = express.Router();
const diadiemRouter = require('./diadiemRouter');
const gymRouter = require('./gymRouter');
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');

apiRouter.use("/", (req, res, next) => {
    console.log(req.session);
    next();
})

apiRouter.use("/diadiem", diadiemRouter);
apiRouter.use('/gym', gymRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
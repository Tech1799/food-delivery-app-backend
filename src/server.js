const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
// const path = require("path");
const { checkUser } = require('./middlewares/auth')
// const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
  
  // connection to mongodb server
  mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connnection is up and running");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });

  app.all('*', checkUser);
  
  app.get("/", (req, res) => {
    res.send("hello express! testing!!")
  });

  // verification routes
  const verificationRoutes = require('./routes/verificationRoutes');
  app.use('/verify', verificationRoutes);
  
  // user routes
  const userRoutes = require('./routes/userRoutes');
  app.use('/user', userRoutes);

  // membership routes
  const membershipRoutes = require('./routes/membershipRoutes');
  app.use('/membership', membershipRoutes)

  // category routes
  const categoryRoutes = require('./routes/categoryRoutes');
  app.use('/category', categoryRoutes)
  
  // product routes
  const productRoutes = require('./routes/productRoutes');
  app.use('/product', productRoutes);
  
app.use('*', (req, res)=>{
  res.status(404).send({
    "message": "Page not found!"
  })
})
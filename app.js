const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;
const routes = require('./routes');

//-------------------------- Middleware --------------------------------
app.use(express.json());
app.use('/api', routes);


/** ------------------ GLOBAL ERROR HANDLING ----------------------*/
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});
//---------------------------- SERVER ---------------------
app.listen(PORT, () => {
  console.log(`Recipe App listening on ${PORT}`);
});

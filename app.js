import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors';
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import horoscopeRouter from './routes/horoscope.js'


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

import hbs from 'hbs';

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', horoscopeRouter);

app.use((err, req, res, next) => {
  console.error('Global error caught:', err || 'Unknown error');

  res.status(500).render('error', { 
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err : {} 
  });
});

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;

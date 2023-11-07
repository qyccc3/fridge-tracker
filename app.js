import express from 'express';
import cookieParser from 'cookie-parser';

import path from 'path';
import logger from 'morgan';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/bootstrap-icons',
    express.static(
        path.join(__dirname, '/node_modules/bootstrap-icons', 'font'),
    ),
);

import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import itemRouter from './routes/items.js';

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/items', itemRouter);

export default app;


import express from 'express';
import {
    authorizeRoles,
    verifyUser,
} from '~/globals/middleware/auth.middleware';
import { dashboardController } from '../controller/dashboard.controller';

const dashboardRoute = express.Router();

dashboardRoute.get(
    '/',
    verifyUser,
    authorizeRoles('ADMIN'),
    dashboardController.read
);

export default dashboardRoute;

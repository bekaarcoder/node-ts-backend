import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { dashboardService } from '~/services/db/dashboard.service';

class DashboardController {
    public async read(req: Request, res: Response) {
        const info = await dashboardService.getInfo();
        res.status(HTTP_STATUS.OK).json(info);
    }
}

export const dashboardController: DashboardController =
    new DashboardController();

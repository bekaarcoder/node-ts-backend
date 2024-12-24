import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { addressService } from '~/services/db/address.service';

class AddressController {
    public async addAddress(req: Request, res: Response) {
        const address = await addressService.add(req.body, req.currentUser);

        res.status(HTTP_STATUS.CREATED).json(address);
    }

    public async updateAddress(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const updatedAddress = await addressService.update(
            id,
            req.body,
            req.currentUser
        );

        res.status(HTTP_STATUS.OK).json(updatedAddress);
    }

    public async deleteAddress(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await addressService.delete(id, req.currentUser);

        res.status(HTTP_STATUS.OK).json({
            message: 'Address deleted successfully',
        });
    }
}

export const addressController: AddressController = new AddressController();

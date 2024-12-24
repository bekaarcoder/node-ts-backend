import { IAddressBody } from '~/features/address/interface/address.interface';
import { Helper } from '~/globals/helpers/Helper';
import {
    ForbiddenException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { prisma } from '~/prisma';

class AddressService {
    public async add(requestBody: IAddressBody, currentUser: IUserPayload) {
        const { street, city, state, country, pincode } = requestBody;
        const address = await prisma.address.create({
            data: {
                street,
                city,
                state,
                country,
                pincode,
                userId: currentUser.id,
            },
        });
        return address;
    }

    public async update(
        id: number,
        requestBody: IAddressBody,
        currentUser: IUserPayload
    ) {
        const address = await this.getById(id);

        Helper.checkPermission(address, 'userId', currentUser);

        const { street, city, state, country, pincode } = requestBody;

        const updatedAddress = await prisma.address.update({
            where: {
                id: address.id,
            },
            data: {
                street,
                city,
                state,
                country,
                pincode,
            },
        });

        return updatedAddress;
    }

    public async delete(id: number, currentUser: IUserPayload) {
        const address = await this.getById(id);

        if (address.userId !== currentUser.id) {
            throw new ForbiddenException('Forbidden request');
        }

        await prisma.address.delete({
            where: {
                id: address.id,
            },
        });
    }

    public async getById(id: number) {
        const address = await prisma.address.findFirst({
            where: {
                id,
            },
        });

        if (!address) {
            throw new NotFoundException(`Address not found with id ${id}`);
        }

        return address;
    }
}

export const addressService: AddressService = new AddressService();

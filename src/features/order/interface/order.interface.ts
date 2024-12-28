export interface IOrderUpdateBody {
    status: 'CONFIRMED' | 'DELIVERED' | 'PENDING' | 'SHIPPED';
}

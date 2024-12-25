export interface ICartBody {
    productId: number;
    variant?: string;
    quantity?: number;
}
export interface IUpdateCartBody {
    quantity?: number;
}

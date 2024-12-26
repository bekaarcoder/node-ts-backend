export interface ICouponBody {
    code: string;
    discountPrice: number;
    discountType?: 'PERCENT' | 'VALUE';
    isActive?: boolean;
}

export interface ICouponUpdateBody {
    discountPrice: number;
    discountType?: 'PERCENT' | 'VALUE';
    isActive?: boolean;
}

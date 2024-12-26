import { Application } from 'express';
import addressRoute from '~/features/address/route/address.route';
import cartRoute from '~/features/cart/route/cart.route';
import categoryRoute from '~/features/category/route/category.route';
import orderRoute from '~/features/order/route/order.route';
import productImagesRoute from '~/features/product-images/route/product-images.route';
import productVariantItemsRoute from '~/features/product-variants/route/product-variant-items.route';
import productVariantsRoute from '~/features/product-variants/route/product-variants.route';
import productRoute from '~/features/product/route/product.route';
import authRoute from '~/features/user/route/auth.route';
import userRoute from '~/features/user/route/user.route';
import wishListRoute from '~/features/wishlist/route/wishlist.route';

const appRoutes = (app: Application) => {
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/categories', categoryRoute);
    app.use('/api/v1/products', productRoute);
    app.use('/api/v1/product-images', productImagesRoute);
    app.use('/api/v1/product-variants', productVariantsRoute);
    app.use('/api/v1/product-variant-items', productVariantItemsRoute);
    app.use('/api/v1/wishlists', wishListRoute);
    app.use('/api/v1/address', addressRoute);
    app.use('/api/v1/cart', cartRoute);
    app.use('/api/v1/orders', orderRoute);
};

export default appRoutes;

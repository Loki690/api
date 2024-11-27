import Add from '../models/product.model.js';
import { errorHandler } from '../utils/error.js';

export const addProduct = async (req, res, next) => {
  if (!req.user.id) {
    return next(errorHandler(403, 'Test error for user to add a product'));
  }
  if (!req.body.productName || !req.body.productPrice) {
    return next(errorHandler(400, 'Please provide all the required fields'));
  }

  const newProduct = new Add({
    ...req.body,
    userId: req.user.id,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const getproducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const add = await Add.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.productImage && { productImage: req.query.productImage }),
      ...(req.query.productName && { productName: req.query.productName }),
      ...(req.query.productPrice && { productPrice: req.query.productPrice }),
      ...(req.query.productQty && { productQty: req.query.productQty }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [{ productName: { $regex: req.query.searchTerm, $options: 'i' } }],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProducts = await Add.countDocuments();
    res.status(200).json({
      add,
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteproduct = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, 'You are not allowed to delete this product')
    );
  }
  try {
    await Add.findByIdAndDelete(req.params.productId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

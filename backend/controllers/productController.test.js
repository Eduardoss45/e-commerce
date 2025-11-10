const { addItemToCart } = require('./productController');
const { User } = require('../models/userModel');

jest.mock('../models/userModel', () => ({
  User: {
    findById: jest.fn(),
  },
}));

const req = {
  params: { id: 'userId' },
  body: { productId: 'productId', quantity: 1 },
};

const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
};

describe('addItemToCart', () => {
  it('should add an item to the cart', async () => {
    const user = {
      _id: 'userId',
      cart: [],
      save: jest.fn(),
      markModified: jest.fn(),
    };
    User.findById.mockResolvedValue(user);

    await addItemToCart(req, res);

    expect(user.cart).toEqual([{ productId: 'productId', quantity: 1 }]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should update the quantity of an item in the cart', async () => {
    const user = {
      _id: 'userId',
      cart: [{ productId: 'productId', quantity: 1 }],
      save: jest.fn(),
      markModified: jest.fn(),
    };
    User.findById.mockResolvedValue(user);

    req.body.quantity = 2;
    await addItemToCart(req, res);

    expect(user.cart).toEqual([{ productId: 'productId', quantity: 2 }]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should remove an item from the cart if the quantity is 0', async () => {
    const user = {
      _id: 'userId',
      cart: [{ productId: 'productId', quantity: 1 }],
      save: jest.fn(),
      markModified: jest.fn(),
    };
    User.findById.mockResolvedValue(user);

    req.body.quantity = 0;
    await addItemToCart(req, res);

    expect(user.cart).toEqual([]);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

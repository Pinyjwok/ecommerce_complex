const Cart = require('../models/Cart');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId; 
        console.log('Adding to cart:', { userId, productId, quantity });

        let cart = await Cart.findOne({ userId });
        console.log('Existing cart:', cart);

        if (!cart) {
            console.log('Creating new cart');
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            console.log('Updating existing cart');
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                // Item exists, update quantity
                console.log('Updating existing item quantity');
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Item does not exist, add to cart
                console.log('Adding new item to cart');
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        console.log('Cart saved successfully');
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        console.log('Updating cart item:', { userId, productId, quantity });

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log('Cart not found');
            return res.status(404).json({ error: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            console.log('Updating item quantity');
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            console.log('Item not found in cart');
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;
        console.log('Removing item from cart:', { userId, productId });

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log('Cart not found');
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        console.log('Item removed successfully');
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
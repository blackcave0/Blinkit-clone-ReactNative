import { Branch, Customer, DeliveryPartner, Order, Product } from '../../models/indexModels.js';

export const createOrder = async (req, reply) => {
  try {
    const { userId } = req.user;
    //! uncomment the totalprice, when user will send the total price
    const { items, branch /* totalPrice */ } = req.body;

    const customerData = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);
    // customer not found
    if (!customerData) {
      return reply.status(404).send({
        success: false,
        message: 'Customer not found',
      });
    }

    //! automatically calculate total price method ....
    // validate items and fetch products 
    const productIds = items.map((curItem) => curItem.id);
    // console.log('productIds', productIds);

    const products = await Product.find({ _id: { $in: productIds } });
    // console.log('products', products);

    if (products.length !== items.length) {
      return reply.status(400).send({
        success: false,
        message: 'Some product are invalid or not found'
      })
    }

    // callculate total price
    let totalPrice = 0;
    /**
     * Calculates the total price of the order by iterating over the items and fetching the corresponding product details.
     * For each item, it checks if a discount price is available, and uses that price or the regular price to calculate the total.
     * The calculated total price is stored in the `totalPrice` variable.
     * The function also returns an array of order items with the necessary details, including the calculated price per item.
     */
    const orderItems = items.map((curItem) => {
      // console.log('curItem', curItem);

      // find the product from the products array...
      const product = products.find((curProduct) => curProduct._id.toString() === curItem.id);
      // console.log('product', product);


      // calculate total price of the order...
      const itemPrice = product.discountPrice || product.price; // if discount price is available then use it else use price
      totalPrice += itemPrice * curItem.count;

      return {
        id: curItem.id,
        item: curItem.item,
        count: curItem.count,
        price: itemPrice, // price of the item including 
      };

    })
    //! end of calculating total price...

    // creating new order
    const newOrder = new Order({
      customer: userId,

      //! manual way to calculate total price... 
      /* items: items.map((curItem) => ({
        id: curItem.id,
        item: curItem.item,
        count: curItem.count,
      })), */

      //! automatic way to calculate total price... remove the line of code if you are using manual way to calculate total price...
      items: orderItems,
      branch,
      totalPrice,

      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || 'No address available',
      },

      picupLocation: {
        latitude: branchData.location.latitude,
        longitude: branchData.location.longitude,
        address: branchData.address || 'No address available',
      },
    });

    const savedOrder = await newOrder.save();
    return reply.status(201).send(savedOrder);

  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      success: false,
      message: 'Internal server error, orderHandler error ',
      error,
    });
  }
};



export const confirmOrder = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;

    const deliverPerson = await DeliveryPartner.findById(userId);
    console.log('log of deliverPerson', deliverPerson);
    console.log('log of userId', userId);
    if (!deliverPerson) {
      return reply.status(404).send({
        success: false,
        message: "Delivery person not found"
      })
    };

    // finding order => no buddy hit the api again and again if order is confiirmed; if order is accepted by someone else then it will be updated and no need to hit api again
    // Consolas, 'Courier New', monospace
    const order = await Order.findById(orderId);
    if (!order) {
      return reply.status(404).send({
        success: false,
        message: "Order not found"
      })
    };

    if (order.status !== 'available') {
      return reply.status(400).send({
        success: false,
        message: "Order is not available"
      })
    };

    // updating order
    order.status = 'confirmed';

    // updating deliver person #deliveryPartner
    order.deliveryPartner = userId;

    // updating deliver person location
    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation?.latitude,
      longitude: deliveryPersonLocation?.longitude,
      address: deliveryPersonLocation?.address || "",
    }

    // saving order
    await order.save();
    return reply.status(200).send({
      success: true,
      message: "Order confirmed successfully",
      order
    })


  } catch (error) {
    console.log(error)
    return reply.status(500).send({
      success: false,
      message: 'Internal server error, function confirmOrder orderHandler error ',
      error
    })
  }
}




export const updateOrderStatus = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPersonLocation } = req.body;

    const { userId } = req.user;
    const deliverPerson = await DeliveryPartner.findById(userId);
    if (!deliverPerson) {
      return reply.status(404).send({
        success: false,
        message: "Delivery person not found"
      })
    };

    const order = await Order.findById(orderId);


    if (!order) {
      return reply.status(404).send({
        success: false,
        message: "Order not found"
      })
    };

    // checking if order is already delivered or cancelled 
    if (['cancelled', 'delivered'].includes(order.status)) {
      return reply.status(400).send({
        success: false,
        message: "Order can not be updated"
      })
    };

    // checking if order is assigned to current delivery partner
    if (order.deliveryPartner.toString() !== userId) {
      return reply.status(400).send({
        success: false,
        message: "You are not authorized to update this order"
      })
    };

    // updating order status 
    order.status = status;

    // updating delivery person location
    order.deliveryPersonLocation = deliveryPersonLocation;

    // saving order
    await order.save();
    return reply.status(200).send(order)

  } catch (error) {
    console.log(error)
    return reply.status(500).send({
      success: false,
      message: 'Internal server error, function updateOrderStatus orderHandler error ',
      error
    })
  }
}

// get all orders of a customer
export const getOrders = async (req, reply) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }
    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
      query.branch = branchId;
    }


    const orders = await Order.find(query).populate(
      "customer branch items.item deliveryPartner"
    )

    return reply.status(200).send({
      success: true,
      message: "Orders fetched successfully #getOrders",
      orders
    })

  } catch (error) {
    console.log(error)
  }
}


export const getOrderById = async (req, reply) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    )

    if (!order) {
      return reply.status(404).send({
        success: false,
        message: "Order not found"
      })
    }
    return reply.status(200).send({
      success: true,
      message: "Orders fetched successfully #getOrderById",
      order
    })

  } catch (error) {
    console.log(error)
  }
}
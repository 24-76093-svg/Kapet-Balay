// Model query fields used by Kitchen Display
const ORDER_SELECT = `
    SELECT o.order_id, o.daily_order_number, o.order_type,
           o.total_amount, o.status, o.order_date,
           oi.menu_id, mi.item_name, mi.category, oi.quantity,
           oi.price, oi.subtotal, oi.drink_size
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_id = mi.menu_id
`;

// Model get all orders and group rows into order objects with items
export const getAllOrders = async () => {
    const [rows] = await db.query(`${ORDER_SELECT} ORDER BY o.order_date DESC, o.order_id DESC`);
    const grouped = new Map();
    rows.forEach(row => {
        if (!grouped.has(row.order_id)) grouped.set(row.order_id, []);
        grouped.get(row.order_id).push(row);
    });
    return Array.from(grouped.values()).map(mapOrderRows);
};

// Service
export const getOrderList = async () => orderModel.getAllOrders();

// Controller GET /orders
export const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrderList();
        return res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve orders.', error: error.message });
    }
};

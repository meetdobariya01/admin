import { useEffect, useState } from "react";
import { Container, Table, Badge, Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaFileInvoice, FaUndo, FaEye } from "react-icons/fa";
import axios from "axios";

import "./order.css";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";

const API = "http://localhost:7000";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch orders dynamically
  useEffect(() => {
    fetchOrders();
  }, []);

const fetchOrders = async () => {
  try {
    const res = await axios.get(`${API}/admin/orders`, {
      withCredentials: true,
    });

    const formatted = res.data.orders.map((order) => ({
      _id: order._id,

      // ✅ NAME FROM ADDRESS (FIXED)
      customer: order.address
        ? `${order.address.firstName} ${order.address.lastName}`
        : "Unknown",

      email: order.address?.email || "N/A",

      products: order.items
        .map((i) => i.product?.name || i.box?.name)
        .join(", "),

      payment: "Paid",
      total: `₹${order.totalAmount}`,
      delivery: order.status,
      createdAt: order.createdAt,
    }));

    setOrders(formatted);
  } catch (error) {
    console.error("Failed to load orders", error);
  } finally {
    setLoading(false);
  }
};


  // ✅ Update delivery status
  const handleDeliveryChange = async (orderId, status) => {
    try {
      await axios.put(
        `${API}/admin/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, delivery: status } : order
        )
      );
    } catch (err) {
      alert("Failed to update delivery status");
    }
  };

  return (
    <>
      <Header />

      <div className="admin-layout">
        <Sidebar />

        <main className="admin-content">
          <Container fluid>
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Orders
            </motion.h4>

            {loading ? (
              <p>Loading orders...</p>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="table-wrapper"
              >
                <Table responsive bordered hover className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Payment</th>
                      <th>Total</th>
                      <th>Delivery</th>
                      <th>Invoice / Refund</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order, index) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td>{order._id}</td>
                        <td>{order.customer}</td>
                        <td>{order.products}</td>

                        <td>
                          <Badge bg="success">Paid</Badge>
                        </td>

                        <td>{order.total}</td>

                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={order.delivery}
                            onChange={(e) =>
                              handleDeliveryChange(order._id, e.target.value)
                            }
                            disabled={order.delivery === "Delivered"}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="action-buttons">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => setViewOrder(order)}
                          >
                            <FaEye />
                          </Button>

                          <Button size="sm" variant="outline-success">
                            <FaFileInvoice />
                          </Button>

                          <Button size="sm" variant="outline-danger">
                            <FaUndo />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </motion.div>
            )}
          </Container>
        </main>
      </div>

      {/* ===== VIEW ORDER MODAL ===== */}
      <Modal show={!!viewOrder} onHide={() => setViewOrder(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>

        {viewOrder && (
          <Modal.Body>
            <p><strong>Order ID:</strong> {viewOrder._id}</p>
            <p><strong>Customer:</strong> {viewOrder.customer}</p>
            <p><strong>Email:</strong> {viewOrder.email}</p>
            <p><strong>Products:</strong> {viewOrder.products}</p>
            <p><strong>Total:</strong> {viewOrder.total}</p>
            <p><strong>Status:</strong> {viewOrder.delivery}</p>
          </Modal.Body>
        )}

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewOrder(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Order;

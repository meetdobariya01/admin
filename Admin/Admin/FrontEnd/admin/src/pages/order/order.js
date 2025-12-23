import { useState } from "react";
import { Container, Table, Badge, Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaFileInvoice, FaUndo, FaEye } from "react-icons/fa";

import "./order.css";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";

const initialOrders = [
  {
    id: "ORD-1001",
    customer: "Rahul Sharma",
    products: "iPhone 15, AirPods",
    payment: "Paid",
    total: "₹92,000",
  },
  {
    id: "ORD-1002",
    customer: "Anjali Verma",
    products: "Nike Shoes",
    payment: "Pending",
    total: "₹6,499",
  },
  {
    id: "ORD-1003",
    customer: "Amit Kumar",
    products: "MacBook Pro",
    payment: "Paid",
    total: "₹1,89,000",
  },
];

const Order = () => {
  const [orders] = useState(initialOrders);
  const [viewOrder, setViewOrder] = useState(null);

  return (
    <>
      <Header />

      <div className="admin-layout">
        <Sidebar />

        {/* ===== PAGE CONTENT ===== */}
        <main className="admin-content">
          <Container fluid>
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Orders
            </motion.h4>

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
                    <th>Invoice / Refund</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.products}</td>

                      <td>
                        <Badge
                          bg={order.payment === "Paid" ? "success" : "warning"}
                        >
                          {order.payment}
                        </Badge>
                      </td>

                      <td>{order.total}</td>

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
            <p>
              <strong>Order ID:</strong> {viewOrder.id}
            </p>
            <p>
              <strong>Customer:</strong> {viewOrder.customer}
            </p>
            <p>
              <strong>Products:</strong> {viewOrder.products}
            </p>
            <p>
              <strong>Payment:</strong> {viewOrder.payment}
            </p>
            <p>
              <strong>Total:</strong> {viewOrder.total}
            </p>
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

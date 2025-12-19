import React from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaTruck, FaClock } from "react-icons/fa";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import "./delivery.css"

const orders = [
  {
    id: "ORD-201",
    customer: "Rahul Sharma",
    status: "Delivered",
    date: "18 Dec 2025",
  },
  {
    id: "ORD-202",
    customer: "Anjali Verma",
    status: "Pending",
    date: "19 Dec 2025",
  },
  {
    id: "ORD-203",
    customer: "Amit Kumar",
    status: "Delivered",
    date: "17 Dec 2025",
  },
  {
    id: "ORD-204",
    customer: "Rohit Singh",
    status: "Pending",
    date: "20 Dec 2025",
  },
];
const Delivery = () => {
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="admin-layout">
        <Sidebar />

        {/* ===== PAGE CONTENT ===== */}
        <main className="admin-content">
          <Container fluid>
            {/* PAGE TITLE */}
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Delivery Status
            </motion.h4>

            {/* ===== STATS ===== */}
            <Row className="g-4 mb-4">
              <Col md={6}>
                <motion.div whileHover={{ scale: 1.04 }}>
                  <Card className="delivery-card delivered">
                    <FaTruck className="icon" />
                    <h6>Delivered Orders</h6>
                    <h3>{deliveredCount}</h3>
                  </Card>
                </motion.div>
              </Col>

              <Col md={6}>
                <motion.div whileHover={{ scale: 1.04 }}>
                  <Card className="delivery-card pending">
                    <FaClock className="icon" />
                    <h6>Pending Orders</h6>
                    <h3>{pendingCount}</h3>
                  </Card>
                </motion.div>
              </Col>
            </Row>

            {/* ===== TABLE ===== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="table-wrapper"
            >
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Date</th>
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
                      <td>
                        <Badge
                          bg={
                            order.status === "Delivered" ? "success" : "warning"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>{order.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Delivery;

import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaTruck, FaClock } from "react-icons/fa";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import axios from "axios";
import "./delivery.css";

const API = "http://localhost:7000/admin/orders"; // backend endpoint

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get(API, { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="admin-layout">
        <main className="admin-content">
          <Container fluid>
            <motion.h4 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              Delivery Status
            </motion.h4>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" /> Loading orders...
              </div>
            ) : (
              <>
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
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="table-wrapper">
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
                      {orders.map((order, index) => {
                        // Get customer name safely from address or user
                        let customerName = "Customer";
                        if (order.address) {
                          const { firstName = "", lastName = "" } = order.address;
                          customerName = `${firstName} ${lastName}`.trim();
                        } else if (order.user) {
                          const { firstName = "", lastName = "" } = order.user;
                          customerName = `${firstName} ${lastName}`.trim();
                        }

                        const orderDate = order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A";

                        return (
                          <motion.tr
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <td>{order._id}</td>
                            <td>{customerName}</td>
                            <td>
                              <Badge bg={order.status === "Delivered" ? "success" : "warning"}>
                                {order.status}
                              </Badge>
                            </td>
                            <td>{orderDate}</td>
                          </motion.tr>
                        );
                      })}
                    </tbody>


                  </Table>
                </motion.div>
              </>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Delivery;

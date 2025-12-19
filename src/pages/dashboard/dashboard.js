import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaRupeeSign, FaShoppingCart, FaUsers, FaClock } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import "./dashboard.css";

const stats = [
  { title: "Total Sales", value: "₹1,25,000", icon: <FaRupeeSign /> },
  { title: "Total Orders", value: "1,240", icon: <FaShoppingCart /> },
  { title: "Total Customers", value: "820", icon: <FaUsers /> },
  { title: "Today’s Revenue", value: "₹8,200", icon: <FaRupeeSign /> },
  { title: "Pending Orders", value: "36", icon: <FaClock /> },
];

const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 18000 },
  { month: "Mar", sales: 15000 },
  { month: "Apr", sales: 22000 },
  { month: "May", sales: 26000 },
  { month: "Jun", sales: 32000 },
];

const Dashboard = () => {
  return (
    <>
      <Header />

      <div className="admin-layout">
        <Sidebar />

        {/* ===== MAIN CONTENT (ONLY THIS SCROLLS) ===== */}
        <main className="admin-content">
          <Container fluid>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Dashboard Overview
            </motion.h3>

            <Row className="g-4">
              {stats.map((item, index) => (
                <Col xl={3} lg={4} md={6} xs={12} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="stat-card">
                      <div className="stat-icon">{item.icon}</div>
                      <div>
                        <h6>{item.title}</h6>
                        <h4>{item.value}</h4>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-5"
            >
              <Card className="chart-card">
                <h5 className="mb-3">Monthly Sales</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </Container>
        </main>
      </div>
    </>
  );
};

export default Dashboard;

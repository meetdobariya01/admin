import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaRupeeSign, FaShoppingCart, FaUsers, FaClock } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import { getAverageSales, getMonthlySales } from "../../api/api";
import "./dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const avgRes = await getAverageSales();
        const salesRes = await getMonthlySales();

        setStats([
          { title: "Total Sales", value: `₹${avgRes.data.totalIncome}`, icon: <FaRupeeSign /> },
          { title: "Avg Daily Sales", value: `₹${Math.round(avgRes.data.avgDailySales)}`, icon: <FaRupeeSign /> },
          { title: "Total Orders", value: salesRes.data.reduce((a,b)=>a+b.orders,0), icon: <FaShoppingCart /> },
          { title: "Pending Orders", value: 36, icon: <FaClock /> }, // Placeholder
        ]);

        setSalesData(salesRes.data.map(item => ({
          month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][item._id-1],
          sales: item.totalSales
        })));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <Header />
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-content">
          <Container fluid>
            <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              Dashboard Overview
            </motion.h3>

            <Row className="g-4">
              {stats.map((item, index) => (
                <Col xl={3} lg={4} md={6} xs={12} key={index}>
                  <motion.div whileHover={{ scale: 1.04 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
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

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-5">
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

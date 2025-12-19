import { useState } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

import "./product.css";
import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";

const initialProducts = [
  {
    id: 1,
    name: "iPhone 15",
    category: "Mobiles",
    price: "₹79,999",
    discount: "10%",
    stock: 24,
    status: "Active",
  },
  {
    id: 2,
    name: "Nike Shoes",
    category: "Footwear",
    price: "₹6,499",
    discount: "15%",
    stock: 0,
    status: "Out of stock",
  },
  {
    id: 3,
    name: "MacBook Pro",
    category: "Laptops",
    price: "₹1,89,000",
    discount: "5%",
    stock: 12,
    status: "Active",
  },
];

const Product = () => {
  const [products, setProducts] = useState(initialProducts);
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);

  /* DELETE PRODUCT */
  const handleDelete = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  /* OPEN EDIT MODAL */
  const handleEdit = (product) => {
    setEditData(product);
    setShow(true);
  };

  /* SAVE EDIT */
  const handleSave = () => {
    setProducts(
      products.map((item) =>
        item.id === editData.id ? editData : item
      )
    );
    setShow(false);
  };

  return (
    <>
      <Header />
      <Sidebar />

      <main className="admin-content">
        <Container fluid>
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            Products
          </motion.h4>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="table-wrapper"
          >
            <Table responsive bordered hover className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.price}</td>
                    <td>{item.discount}</td>
                    <td>{item.stock}</td>
                    <td>
                      <Badge bg={item.status === "Active" ? "success" : "secondary"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="action-buttons">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </motion.div>
        </Container>
      </main>

      {/* ================= EDIT MODAL ================= */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>

        {editData && (
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount</Form.Label>
                <Form.Control
                  value={editData.discount}
                  onChange={(e) =>
                    setEditData({ ...editData, discount: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  value={editData.stock}
                  onChange={(e) =>
                    setEditData({ ...editData, stock: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Out of stock</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
        )}

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Product;

import { useState, useEffect } from "react";
import { Container, Table, Badge, Button, Modal, Form, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

import Header from "../../component/header/header";
import Sidebar from "../../component/sidebar/sidebar";
import { getCategories } from "../../api/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (id) => {
    setCategories(categories.filter((item) => item.id !== id));
  };

  const handleEdit = (category) => {
    setEditData(category);
    setShow(true);
  };

  const handleSave = () => {
    setCategories(
      categories.map((item) => (item.id === editData.id ? editData : item))
    );
    setShow(false);
  };

  // Normalize image into array and prepend base path if missing
const normalizeImages = (image) => {
  if (!image) return [];
  let imagesArray = [];
  
  // Handle both array and comma-separated string formats
  if (Array.isArray(image)) imagesArray = image;
  else if (typeof image === "string") imagesArray = image.split(",").filter(Boolean);

  return imagesArray.map((img) => {
    const trimmedImg = img.trim();
    
    // 1. If it's a full URL or already starts with a slash, leave it
    if (trimmedImg.startsWith("http") || trimmedImg.startsWith("/")) {
      return trimmedImg;
    }
    
    // 2. Adjust this to match your Backend URL
    // If your backend stores "bonbon/pic.png", this makes it "/images/bonbon/pic.png"
    return `http://localhost:7000/images/${trimmedImg}`; 
  });
};
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="admin-layout">
        <main className="admin-content">
          <Container fluid>
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              Categories
            </motion.h4>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="table-wrapper"
            >
              <Table responsive bordered hover className="category-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>{item.name}</td>
                      <td>
                        {normalizeImages(item.image).length > 0 ? (
                          normalizeImages(item.image).map((img, idx) => (
                            <Image
                              key={idx}
                              src={img}
                              alt={item.name}
                              rounded
                              className="category-img me-1 mb-1"
                              style={{ maxHeight: "80px" }}
                            />
                          ))
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>
                        <Badge
                          bg={item.status === "Active" ? "success" : "secondary"}
                        >
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
      </div>

      {/* Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>

        {editData && (
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URLs (comma separated or array)</Form.Label>
                <Form.Control
                  value={Array.isArray(editData.image) ? editData.image.join(",") : editData.image || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, image: e.target.value })
                  }
                />
                <div className="mt-2">
                  {normalizeImages(editData.image).map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={editData.name}
                      rounded
                      className="me-1 mb-1"
                      style={{ maxHeight: "80px" }}
                    />
                  ))}
                </div>
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
                  <option>Inactive</option>
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
    </div>
  );
};

export default Categories;

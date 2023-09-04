import React from "react";
import { Modal, Button } from "react-bootstrap";
import { createPortal } from "react-dom";

const CustomModal = ({ show, onHide, title, body, onCancel, onConfirm }) => {

  if (!show) return null;

  return (
    <>
      {createPortal(
        <Modal show={show} onHide={onHide}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{body}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>,
        document.getElementById("modal-root")
      )}
      {createPortal(
        <p>React Portal Example</p>,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default CustomModal;

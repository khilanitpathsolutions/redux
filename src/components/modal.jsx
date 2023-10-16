import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Portal } from "react-portal";

const CustomModal = ({ show, onHide, title, body, onCancel, onConfirm }) => {

  if (!show) return null;

  return (
    <>
      <Portal node={document && document.getElementById('modal-root')}>
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
        </Portal>
    </>
  );
};

export default CustomModal;

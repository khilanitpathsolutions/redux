import React from "react";
import { Facebook, Instagram, Twitter } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>Contact Us</h4>
            <p>Email: contact@redux-store.com</p>
            <p>Phone: +123-456-7890</p>
          </div>
          <div className="col-md-4">
            <h4>Links</h4>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Follow Us</h4>
            <ul>
              <li>
                <Facebook size={22} />
              </li>
              <li>
                <Twitter size={22} />
              </li>
              <li>
                <Instagram size={22} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

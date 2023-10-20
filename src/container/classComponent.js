import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      age: 10,
    };
  }

  handleIncrementChange = () => {
    this.setState({
      age: this.state.age + 1,
    });
  };

  handleDecrementChange = () => {
    this.setState({
      age: this.state.age - 1,
    });
  }

  render() {
    return (
      <>
        <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '100vh' }}>
          <div className="d-flex">
            <button onClick={this.handleIncrementChange}>
              Increment age
            </button>
            <button onClick={this.handleDecrementChange}>
              Decrement age
            </button>
          </div>
          <p>You are {this.state.age} years old.</p>
        </div>
      </>
    );
  }
}

export default Counter;

import React, { Component } from "react";
import "./App.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("https://ipfs.infura.io:5001");

class App extends Component {
  state = { storageValue: "", buffer: null };

  captureFile = (event) => {
    event.preventDefault();

    console.log(event.target.files[0]);
    const file = event.target.files[0];
    console.log(file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("Buffer", this.state.buffer);
    };
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const ipfsVersion = await ipfs.version();
    console.log(ipfsVersion);

    console.log("Submitting the File...");
    var hash = "";
    for await (const result of ipfs.add(this.state.buffer)) {
      console.log(result);
      hash = result.path;
    }
    console.log("IPFS Hash: ", hash);
    this.setState({ storageValue: hash });
  };
  render() {
    return (
      <div className="Container-fluid">
        <nav>IPFS File Upload</nav>

        <p>This Image is stored using IPFS</p>
        {this.state.storageValue === "" ? (
          "There is no image"
        ) : (
          <img
            src={`https://ipfs.io/ipfs/${this.state.storageValue}`}
            alt="No-images"
          />
        )}

        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>
        <p>This is image hash: {this.state.storageValue}</p>
      </div>
    );
  }
}

export default App;

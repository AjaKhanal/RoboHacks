import logo from './logo.svg';
import React, { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import jsonData from "./test.json";

import './App.css';


const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};


function App() {
  const json = '{"water":["babe im wet","its raining lmao"],"beach":["I can be your beach","sand in my pussy"]}';
  const jsonObj = JSON.parse(json);
  var values = {};

 
  const [files, setFiles] = useState([]);
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });
  
  // Construct a preview of the uploaded
  const thumbs = files.map(file => (
    <div key={file.name}>
      <div>
        <img src={file.preview} style={{ width: "200px" }} alt="preview"/>
      </div>
    </div>
  ));


  // Map the image name and size (testing)
  const images = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // Map the instagram captions to the page
  const captions = Object.keys(jsonObj).map((key, value) => {
    return(
      <li key={key}>
        {key}
        {value}
      </li>
    )
  });

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
      <section className="App">
        <h2>RoboHacks Website (put name here)</h2><br /><br />

        <section className="dropzone-function-border">
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag and drop your image here</p>
        </div>
        <aside>
          <h4>Image uploaded</h4>
          <ul>{images}</ul>
        </aside>
        <div>{thumbs}</div>
      </section>
      <br />
        <br />
        <br />
      <section className="dropzone-function-border">
        <h4>Possible Instagram captions for your image:</h4>
        <div>{captions}</div>
      </section>

      </section>

  );
}

export default App;

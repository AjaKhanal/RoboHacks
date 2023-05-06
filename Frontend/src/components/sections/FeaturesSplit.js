import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import React, { useEffect, useState, Component } from "react";
import { useDropzone } from 'react-dropzone';
import Image from '../elements/Image';
import axios from 'axios';
import importedData from './message.json';
import request from "request";
import Button from "../elements/Button";
import {bind} from "lodash";

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: 'Try it out!',
    paragraph: 'Upload an image and let CaptionAI generate captions and tags for you.'
  };

  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16
  };


  const json = '[{"tag" : "water","caption" : "Be my beach"},{"tag" : "water","caption" : "its sandy lmao"},{"tag" : "clouds","caption" : "come smoke it up with me"},{"tag" : "clouds","caption" : "takes puff you know, you only need 3 wipes to realise you only needed 2"}]';
  const jsonObj = JSON.parse(json);
  var values = {}


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
  const captions = importedData.map(entry => {
    return(
      <li key={entry.tag}>
        {entry.caption.split('"').join("")}
      </li>
    )
  });

  // Produce a new set containing only the unique hashtags
  const uniqueTags = [...new Set(importedData.map(entry => entry.tag))];

  // Map the instagram captions to the page
  const hashtags = uniqueTags.map(entry => {
    return(
      <li key={entry}>
        #{entry.split('"').join("")}
      </li>
    )
  });
 

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files])

  const [file, setFile] = useState('')
  const [fileName, setFileName] = useState('Drag and drop file')
  const [uploadedFile, setUploadedFile] = useState({})

  const onChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try{
      const res = await axios.post('http://127.0.0.1:5000', formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log(res);

      const {fileName, filePath} = res.data;
      setUploadedFile({fileName, filePath});
    }catch (err){
      if(err.response.status === 500){
        console.log("Server sided problem")
      } else {
        console.log(err.response.data.message);
      }
    }
  }

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <a name="ref"></a>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <section className="App">
            <div className="reveal-from-bottom" data-reveal-delay="200">
              <form onSubmit={onSubmit}>
                <div {...getRootProps({className: 'dropzone'})}>
                  <div className='custom-file mb-4'>
                    <input
                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={onChange}
                        {...getInputProps()}
                    />
                    <p><br/>Drag and drop your image here</p>
                  </div>
                </div>
                <input
                    id="upload"
                    color="primary"
                    type='submit'
                    value='Upload'
                    className='btn btn-primary btn-block mt-4'
                />
              </form>

            </div>
            <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}>
                <div>{thumbs}</div>
              </div>
          </section>

          <div className={splitClasses}>
            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <h3 className="mt-0 mb-12">
                  Captions
                  </h3>
                <p className="m-0">
                  <div>{captions}</div>
                  </p>
              </div>
            </div>
          </div>
          <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <h3 className="mt-0 mb-12">
                  Hashtags
                  </h3>
                <p className="m-0">
                  <div>{hashtags}</div>
                  </p>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;
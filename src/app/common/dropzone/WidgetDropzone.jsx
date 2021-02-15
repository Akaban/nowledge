import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

export default function WidgetDropzone({ setFieldValue, name }) {

    const dropzoneStyles = {
        border: 'dashed 3px #eee',
        borderRadius: '5%',
        paddingTop: '30px',
        textAlign: 'center'
    }

    const dropzoneActive = {
        border: 'dashed 3px green',
    }
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    const files = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)}))

    setFieldValue(name, files)

  }, [name]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={isDragActive ? {...dropzoneStyles, ...dropzoneActive}: dropzoneStyles}>
      <input {...getInputProps()} />
      <Icon name='upload' size='tiny' />
      <Header content='Drop file here'/>
    </div>
  );
}

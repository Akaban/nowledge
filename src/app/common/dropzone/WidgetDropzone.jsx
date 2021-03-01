import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Header, Icon } from "semantic-ui-react";

export default function WidgetDropzone({ setFieldValue, name }) {
  const [uploadedFile, setUploadedFile] = useState(null);

  const dropzoneStyles = {
    border: "dashed 3px #eee",
    borderRadius: "5%",
    paddingTop: "30px",
    textAlign: "center",
  };

  const dropzoneActive = {
    border: "dashed 3px green",
  };
  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadedFile(null)
      const file = acceptedFiles[0]

      if (file.type !== 'application/pdf') {
      toast.error('Sorry but we only support PDF files for uploading.');
      return;
    }

      setUploadedFile(file);
      console.log(file);
      setFieldValue(name, file);
    },
    [name, setFieldValue]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive ? { ...dropzoneStyles, ...dropzoneActive } : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      {uploadedFile ? (
        <Header content={uploadedFile.name} />
      ) : (
        <>
          <Icon name="upload" size="large" />
          <Header content="Drop the pdf file of your book here." />
        </>
      )}
    </div>
  );
}

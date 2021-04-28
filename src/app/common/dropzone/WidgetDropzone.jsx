import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const MAX_SIZE = 100000000;

export default function WidgetDropzone({ onSuccessfulLoad, children }) {
  const [isLoading, setIsLoading] = useState(false);

  const dropzoneStyles = {
  };

  const dropzoneActive = {
    border: "dashed 3px green",
  };
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.type !== "application/pdf") {
        toast.error("Sorry but we only support PDF files for uploading.");
        return;
      }

      if (file.size >= MAX_SIZE) {
        toast.error("Sorry but we cannot accept pdf files larger than 100MB")
        return;
      }

      setIsLoading(true)
      await onSuccessfulLoad(file)
      setIsLoading(false)
    },
    [onSuccessfulLoad]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive ? { ...dropzoneStyles, ...dropzoneActive } : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      {isLoading ? (
        React.cloneElement(children, { loading: true})
      ) : (
        {...children}
      )}
    </div>
  );
}

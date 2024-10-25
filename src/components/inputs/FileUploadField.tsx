/** @format */
import React, { useRef, useState } from "react";

type FileUploadFieldProps = {
  // eslint-disable-next-line no-unused-vars
  onFileChosen: (files: File[]) => void;
  filetypes: string[];
  errorMessage?: string;
  placeholder?: React.ReactElement | string;
  className?: string;
  multiple?: boolean;
  text?: React.ReactElement | string;
  disabled?: boolean;
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onFileChosen,
  filetypes,
  errorMessage,
  className,
  text = undefined,
  placeholder = "",
  multiple = false,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileUploadError, setFileUploadError] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList) {
      onFileChosen(Array.from(fileList));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setFileUploadError(false);

    e.preventDefault();

    const files: File[] = [];

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file && filetypes.indexOf(file.type) > -1) {
            files.push(file);
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
          files.push(e.dataTransfer.files[i]);
        }
      }
    }
    if (files.length === 1) {
      onFileChosen(files);
    } else {
      setFileUploadError(true);
    }
  };

  return (
    <div
      onClick={() => inputRef?.current?.click()}
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`${className} inter-base-regular text-grey-50 rounded-rounded border-grey-20 hover:border-primary hover:text-grey-40 flex h-full w-full cursor-pointer select-none flex-col items-center justify-center border-2 border-dashed transition-colors`}
    >
      <div className="flex flex-col items-center">
        <div className="p-2 text-center">
          {text ? (
            text
          ) : (
            <>
              text
              <span className="text-primary ltr:ml-2 rtl:mr-2">text</span>
            </>
          )}
        </div>
        {placeholder}
      </div>

      {fileUploadError ||
        (errorMessage && <span className="text-rose-60">error</span>)}

      <input
        className="hidden"
        type="file"
        ref={inputRef}
        accept={filetypes?.join(", ")}
        multiple={multiple}
        onChange={handleFileUpload}
        {...(disabled && { disabled })}
      />
    </div>
  );
};

export { FileUploadField };

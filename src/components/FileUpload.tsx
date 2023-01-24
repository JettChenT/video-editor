import React, { useCallback } from "react";
import { useLibrary } from "@/lib/state";
import { useDropzone } from "react-dropzone";
import VideoCard from "./VideoCard";

const FileUpload = () => {
  const files = useLibrary((state) => state.files);
  const addFile = useLibrary((state) => state.addFile);
  const onDrop = useCallback((acceptedFiles:File[])=> {
    acceptedFiles.forEach((file) => {
      addFile({
        location: URL.createObjectURL(file),
        name: file.name,
      });
    });
  }, [addFile])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    // TODO: Allow for audio files
    accept: {
      "video/*": [".mp4"]
    },
  })
  return (
    <div 
      {...getRootProps()}
      className = "h-64 border-2 border-dashed border-gray-400 p-3"
    >
      {isDragActive ? (
        <p>Ready set drop!</p>
        ): (
        <p>Drop the files here ... (mp4)</p>
      )}
      <input 
        {...getInputProps()} 
        
      />
      <div>
        {files.map((file) => (
          <VideoCard video={file} key={file.location} />
        ))}
      </div>
    </div>
  );
};

export default FileUpload;

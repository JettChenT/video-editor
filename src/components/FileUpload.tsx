import React, { useCallback } from "react";
import { useFF, useLibrary } from "@/lib/state";
import { useDropzone } from "react-dropzone";
import VideoCard from "./VideoCard";
import { fetchFile } from "@ffmpeg/ffmpeg";

export default function FileUpload(){
  const files = useLibrary((state) => state.files);
  const addFile = useLibrary((state) => state.addFile);
  const ff = useFF((st) => st.ff);

  const getThumbnail = async (fileloc: string) => {
    ff.FS("writeFile", "input.mp4", await fetchFile(fileloc));
    // get the first frame of the video and store it in {file}.png
    await ff.run("-i", "input.mp4", "-ss", "00:00:01.000", "-vframes", "1", "output.png");
    const data = ff.FS("readFile", "output.png");
    const url = URL.createObjectURL(new Blob([data.buffer], {type: "image/png"}));
    return url
  }

  const onDrop = useCallback((acceptedFiles:File[])=> {
    acceptedFiles.forEach((file) => {
      let stored_file = URL.createObjectURL(file);
      let thumbnail = null;
      getThumbnail(stored_file).then((url) => {
        thumbnail = url;
        addFile({
          location: stored_file,
          name: file.name,
          thumbnail: thumbnail,
          processed: false,
        });
        console.log("file added")
      });
    });
  }, [addFile])
  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    onDrop,
    // TODO: Allow for audio files
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv"]
    },
    noClick: true,
  })
  return (
    <div 
      {...getRootProps()}
      className = "h-64 border-2 border-dashed border-gray-400 p-3"
    >
      {isDragActive ? (
        <p>Ready set drop!</p>
        ): (
        <p>
          Drop the files here ... (mp4)
          <button className="btn btn-primary" onClick={open}>Open File Dialog</button>
        </p>
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


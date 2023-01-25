import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import FileUpload from '@/components/FileUpload'
import { useLibrary, useFF } from '@/lib/state'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import TimeLine from '@/components/TimeLine'
import Exporter from '@/components/Exporter'

export default function Home() {
  const ff = useFF((st) => st.ff);
  const setReady = useFF((st)=> st.setReady);
  const setProgress = useFF((st)=> st.setProgress);
  const progress = useFF((st)=> st.progress);
  const ready = useFF((st)=> st.ready);
  const load = async () => {
    if(!ff.isLoaded()){
      console.log("downloading ffmpeg...")
      await ff.load();
      setReady(true);
      console.log("ready!")
      ff.setProgress(({ratio})=>{
        console.log("[progress]",ratio);
        setProgress(ratio);
      })
    }
  }

  useEffect(() => {
    load();
  }, [])

  return ready?(
    <DndProvider backend={HTML5Backend}>
      <FileUpload />
      <TimeLine/>
      <Exporter />
      {
       (Number.isNaN(progress) || progress<1)?
       <progress className='progress progress-primary w-56 block mt-10'/>
       :<progress className='progress progress-primary w-56 block mt-10' value={1} max={1}/>
      }
    </DndProvider>
  ):(
    <div>
      <p>loading...</p>
    </div>
  )
}

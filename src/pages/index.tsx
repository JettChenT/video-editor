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
  const ready = useFF((st)=> st.ready);
  const load = async () => {
    if(!ff.isLoaded()){
      console.log("downloading ffmpeg...")
      await ff.load();
      setReady(true);
      console.log("ready!")
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
    </DndProvider>
  ):(
    <div>
      <p>loading...</p>
    </div>
  )
}

import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import FileUpload from '@/components/FileUpload'
import { useLibrary, useFF } from '@/lib/state'
import { useEffect, useState } from 'react'
import { createFFmpeg } from '@ffmpeg/ffmpeg'

export default function Home() {
  const ff = useFF((st) => st.ff);
  const setReady = useFF((st)=> st.setReady);
  const load = async () => {
    if(!ff.isLoaded){
      await ff.load();
      setReady(true);
      console.log("ready!")
    }
  }

  useEffect(() => {
    load();
  }, [])

  return (
    <>
      <FileUpload/>
    </>
  )
}

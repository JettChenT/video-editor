import Link from 'next/link'
import React from 'react'

const index = () => {
  return (
    <div className='container mx-auto text-center'>
        <h1 className='text-5xl mt-3'>A Web-Based, Intuitive Video Editor</h1>
        <p className='text-lg block mt-5'>
            Built with Nextjs, Tailwind, and FFMpeg, this video editor allows you to seamlessly edit videos
            on the web, with all your data stored client side.
        </p>
        <Link className='btn btn-primary mt-5' href='/editor'>Go to Editor</Link>
    </div>
  )
}

export default index
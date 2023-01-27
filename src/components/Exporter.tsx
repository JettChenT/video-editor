import React from 'react'
import { export_timeline } from '@/lib/transform'
import { useConfig, useTimeline } from '@/lib/state'

const Exporter = () => {
    let timeline = useTimeline.getState();
    const [loading, setLoading] = React.useState(false);
    const export_name = useConfig((st)=>st.project_name)
  return (
    <button className='btn mx-2 btn-outline btn-xs inline-block' onClick={() => {
        export_timeline().then((l) => {
            let loc = l;
            try{
                setLoading(true);
                fetch(loc)
                .then(res => res.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${export_name}.mp4`);
                    link.click();
                });
            } catch (e) {
                console.log(e);
            } finally{
                setLoading(false);
            }
        });
    }}
        disabled={loading}
    >
        {loading ? "Exporting..." : "Export"}
    </button>
  )
}

export default Exporter
import React from 'react'
import { export_timeline } from '@/lib/transform'
import { useTimeline } from '@/lib/state'

const Exporter = () => {
    let timeline = useTimeline.getState();
    const [loading, setLoading] = React.useState(false);
  return (
    <button className='btn btn-primary' onClick={() => {
        export_timeline(timeline).then((l) => {
            let loc = l;
            try{
                setLoading(true);
                fetch(loc)
                .then(res => res.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'exported.mp4');
                    // document.body.appendChild(link);
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
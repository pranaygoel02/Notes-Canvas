import Sidepanel from '@/components/Sidepanel/Sidepanel'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (<div className='flex-row-start'>
    <Sidepanel/>
    <Component {...pageProps} />
  </div>)
}

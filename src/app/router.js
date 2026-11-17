import { useEffect, useState } from 'react'

// Hash routes: #/  #/p/<slug>  #/review  #/mixed  #/equations  #/export
export function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => {
      setHash(window.location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const path = decodeURIComponent(hash.replace(/^#\/?/, ''))
  const [name, ...rest] = path.split('/')
  return { name: name || 'index', arg: rest.join('/') }
}

export const href = (...parts) => '#/' + parts.map(encodeURIComponent).join('/')
export const pageHref = (slug) => href('p', slug)

import { createContext, useContext } from 'react'

export const PageCtx = createContext(null)
export const usePage = () => useContext(PageCtx)

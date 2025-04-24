'use client'
import { store } from '@/store/store';
import React from 'react'
import { Provider as ReduxProvider } from "react-redux";
import { ToastProvider, ToastViewport } from './ui/toast';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </ReduxProvider>
  )
}

export default Provider

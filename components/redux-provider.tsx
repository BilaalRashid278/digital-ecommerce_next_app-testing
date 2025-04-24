"use client"

import { store } from "@/store/store";
import type React from "react"

import {Provider} from 'react-redux';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>{children}</Provider>
}


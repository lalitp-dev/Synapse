// import {create} from 'zustand';
// import {Session} from '@supabase/supabase-js'

// interface AuthState{
//   session: Session | null;
//   isAuthenticated: boolean;
//   setSession: (session:Session | null) => void;
// }
// export const useAuthStore = create<AuthState>((set) => ({
//   session: null,
//   isAuthenticated:false,
//   setSession: (session) => set({session, isAuthenticated:!!session })

// })
// );

import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  isAuthencited:boolean;
  setSession:(session:Session | null) => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  session:null,
  isAuthencited:false,
  setSession:(session) => set({session, isAuthencited:!!session})

}));
import { create } from "zustand"

interface SearchState {

  search:string
  category:string
  filterOpen:boolean

  setSearch:(value:string)=>void
  setCategory:(value:string)=>void
  openFilter:()=>void
  closeFilter:()=>void

}

export const useSearchStore = create<SearchState>((set)=>({

  search:"",
  category:"",
  filterOpen:false,

  setSearch:(value)=>set({search:value}),

  setCategory:(value)=>set({category:value}),

  openFilter:()=>set({filterOpen:true}),

  closeFilter:()=>set({filterOpen:false})

}))
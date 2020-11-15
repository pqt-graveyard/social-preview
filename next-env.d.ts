/// <reference types="next" />
/// <reference types="next/types/global" />

type Nullable<T> = T | null

type RGB = { red: number; green: number; blue: number; };

type ProtectedArea = {
  x: {
      min: number;
      max: number;
  };
  y: {
      min: number;
      max: number;
  }
}

type Linguist = {
  [key: string]: {
    color: string
    language_id: number
  }
}

type Languages = {
  [key: string]: number
 }

 type SocialPreview = {
   error?: string
   
   id: number
   owner: string
   repo: string
   darkmode: boolean
   squares: boolean
   colors: boolean
   image: string
 }
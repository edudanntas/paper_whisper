import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`
  }
  return `http://localhost:${process.env.PORT ?? 3000
    }${path}`
}

export function constructMetadata({
  title = "Paper Whisper - O ajudante dos estudantes",
  description = "Paper Whisper é uma aplicação Open-source que permite conversar com seus documentos PDFs.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@edudanntas'
    },
    icons,
    metadataBase: new URL('https://paper-whisper.vercel.app'),
    themeColor: '#fff',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}
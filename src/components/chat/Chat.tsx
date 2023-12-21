'use client'
import React from 'react'
import Message from './Message'
import ChatInput from './ChatInput'
import { trpc } from '@/app/(trpc)/client'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'


type Props = {
    fileId: string
}

const Chat = ({ fileId }: Props) => {
    const { data, isLoading } = trpc.getFileUploadStatus.useQuery({
        fileId,
    },
        {
            refetchInterval: (data) =>
                data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,

        }
    )


    if (isLoading)
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between'>
                <div className='flex-1 justify-center flex flex-col mb-28'>
                    <div className='flex flex-col items-center gap-2'>
                        <Loader2 className='h-8 w-8 text-green-600 animate-spin' />
                        <h3 className='font-semibold text-xl'>Carregando...</h3>
                        <p className='text-zinc-500 text-sm'>
                            Estamos preparando o seu PDF.
                        </p>
                    </div>
                </div>

                <ChatInput isDisabled={true} />
            </div>
        )
    if (data?.status === "PROCESSING")
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between'>
                <div className='flex-1 justify-center flex flex-col mb-28'>
                    <div className='flex flex-col items-center gap-2'>
                        <Loader2 className='h-8 w-8 text-green-600 animate-spin' />
                        <h3 className='font-semibold text-xl'>Processando PDF...</h3>
                        <p className='text-zinc-500 text-sm'>
                            Isso não deve demorar muito.
                        </p>
                    </div>
                </div>

                <ChatInput isDisabled={true} />
            </div>
        )

    if (data?.status === "FAILED")
        return (
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between'>
                <div className='flex-1 justify-center flex flex-col mb-28'>
                    <div className='flex flex-col items-center gap-2'>
                        <XCircle className='h-8 w-8 text-red-600' />
                        <h3 className='font-semibold text-xl'>Muitas páginas no PDF</h3>
                        <p className='text-zinc-500 text-sm'>
                            Seu plano <span className='font-medium'>gratuito</span> suporta somente até 5 paginas por PDF.
                        </p>
                        <Link href='/dashboard' className={buttonVariants({
                            variant: 'secondary',
                            className: 'mt-4'
                        })}>
                            <ChevronLeft className='h-3 w-3 mr-1.5' />
                            Voltar
                        </Link>
                    </div>
                </div>

                <ChatInput isDisabled={true} />
            </div >
        )





    return (
        <ChatContextProvider fileId={fileId}>
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex-1 justify-between flex flex-col' >
                    <Message fileId={fileId} />
                </div>
                <ChatInput />
            </div>
        </ChatContextProvider>
    )
}

export default Chat
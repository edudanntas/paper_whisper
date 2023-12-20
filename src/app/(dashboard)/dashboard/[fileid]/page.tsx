import Chat from '@/components/chat/Chat'
import RenderPDF from '@/components/RenderPDF'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        fileid: string
    }
}
const page = async ({ params }: Props) => {
    const { fileid } = params

    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`)

    const file = await db.file.findFirst({
        where: {
            id: fileid,
            userId: user.id,
        },
    })

    if (!file) notFound()

    return (
        <div className='flex-1 flex flex-col justify-between h-[calc(100vh - 3.5rem)]'>
            <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
                {/* Lado esquerdo: PDF */}
                <div className='flex-1 lg:flex'>
                    <div className="px-4 py-6 sm:px-6 lg:pl-6 xl:flex-1 xl:pl-6">
                        <RenderPDF url={file.url} />
                    </div>
                </div>

                {/* Lado direito: Chat */}
                <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-y-0'>
                    <Chat fileId={file.id} />
                </div>
            </div>
        </div>
    )
}

export default page
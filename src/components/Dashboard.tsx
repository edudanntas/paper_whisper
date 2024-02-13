'use client'
import { trpc } from '@/app/(trpc)/client'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { format, setDefaultOptions } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import UploadButton from './UploadButton'
import { Button, buttonVariants } from './ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'

type Props = {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

function Dashboard({ subscriptionPlan }: Props) {
    const { getBooleanFlag } = getKindeServerSession()

    const [darkModeEnabled, setDarkModeEnabled] = useState(false)

    useEffect(() => {
        let isMounted = true

        const fetchDarkModeFlag = async () => {
            const flagValue = await getBooleanFlag('dark-mode', false);
            if (isMounted) {
                setDarkModeEnabled(flagValue || false)
            }
        }

        fetchDarkModeFlag()

        return () => {
            isMounted = false
        }
    }, [getBooleanFlag])

    const [deletarArquivoAtual, setDeletarArquivoAtual] = useState<string | null>(null)

    const utils = trpc.useContext()

    const { data: files, isLoading } = trpc.getUserFiles.useQuery()
    const { mutate: deleteFile } = trpc.deteleFile.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate()
        },
        onMutate({ id }) {
            setDeletarArquivoAtual(id)
        },
        onSettled() {
            setDeletarArquivoAtual(null)
        }
    })
    setDefaultOptions({
        locale: ptBR
    })
    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            {darkModeEnabled ? (<div className="flex flex-col mt-8 items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className='mb-3 font-bold text-5xl text-gray-500'>Meus arquivos</h1>
                <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
            </div>) : (<div className="flex flex-col mt-8 items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className='mb-3 font-bold text-5xl text-gray-900'>Meus arquivos</h1>
                <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
            </div>)}


            {/* Arquivos do usuário */}
            {files && files?.length !== 0 ? (
                <ul className='mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3'>
                    {files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file) => (
                        <li key={file.id} className='col-span-1 divide-y divide-zinc-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
                            <Link href={`/dashboard/${file.id}`} className='flex flex-col gap-2'>
                                <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                                    <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500'></div>
                                    <div className='flex-1 truncate'>
                                        <div className='flex items-center space-x-3'>
                                            <h3 className='truncate text-lg font-medium text-zinc-900'>{file.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className='px-6 mt-4 grid grid-cols-3 place-content-center py-2 gap-6 text-xs text-zinc-500'>
                                <div className='flex items-center gap-2'>
                                    <Plus className='h-4 w-4' />
                                    {format(new Date(file.createdAt), 'MMM yyyy')}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MessageSquare className='h-4 w-4' />
                                    Chat
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Button
                                            // onClick={() => deleteFile({ id: file.id })}
                                            size='sm'
                                            className='w-full'
                                            variant='destructive'>
                                            {deletarArquivoAtual === file.id ? (
                                                <Loader2 className='h-4 w-4 animate-spin' />
                                            ) : < Trash className='h-4 w-4' />}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Você tem certeza que deseja deletar esse arquivo?</AlertDialogTitle>
                                            <AlertDialogDescription>Essa ação não pode ser desfeita e isso acarretará na exclusão do seu arquivo e do histórico de conversas permanentemente</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteFile({ id: file.id })} className={buttonVariants({
                                                variant: "destructive",
                                            })}>Deletar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                        </li>
                    ))}
                </ul>
            ) : isLoading ? (
                <Skeleton height={100} count={3} className='my-5' />
            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    <Ghost className='h-8 w-8 text-zinc-800' />
                    <h3 className='font-semibold text-xl'>Parece estar vazio por aqui.</h3>
                    <p>Vamos carregar o seu primeiro arquivo.</p>
                </div>
            )}
        </main>
    )
}

export default Dashboard
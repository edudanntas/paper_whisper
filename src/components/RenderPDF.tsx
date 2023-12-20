'use client'
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
    url: string
}

function RenderPDF({ url }: Props) {

    const [numeroPagina, setNumeroPagina] = useState<number>()
    const [paginaAtual, setPaginaAtual] = useState<number>(1)
    const [scale, setScale] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)

    const CustomValidationForm = z.object({
        page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numeroPagina!)
    })

    type TCustomValidationForm = z.infer<typeof CustomValidationForm>

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<TCustomValidationForm>({
        defaultValues: {
            page: '1',
        },
        resolver: zodResolver(CustomValidationForm),
    })

    const { toast } = useToast()

    const { width, ref } = useResizeDetector()

    const handlePageSubmit = ({
        page,
    }: TCustomValidationForm) => {
        setPaginaAtual(Number(page))
        setValue('page', String(page))
    }

    return (
        <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
            <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='flex items-center gap-1.5'>
                    <Button
                        variant='ghost'
                        aria-label='página anterior'
                        onClick={() => {
                            setPaginaAtual((prev) => (prev - 1 > 1 ? prev - 1 : 1))
                        }}
                        disabled={paginaAtual <= 1}
                    >
                        <ChevronDown className='h-4 w-4' />
                    </Button>

                    <div className="flex items-center gap-1.5">
                        <Input
                            {...register('page')}
                            className={cn(
                                'w-12 h-8',
                                errors.page && 'focus-visible:ring-red-500'
                            )}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(handlePageSubmit)()
                                }
                            }}
                        />
                        <p className='text-sm text-zinc-700 space-x-1'>
                            <span>/</span>
                            <span>{numeroPagina ?? "X"}</span>
                        </p>
                    </div>

                    <Button
                        disabled={numeroPagina === undefined || paginaAtual === numeroPagina}
                        variant='ghost'
                        aria-label='próxima página'
                        onClick={() => {
                            setPaginaAtual((prev) => (prev + 1 > numeroPagina! ? numeroPagina! : prev + 1))
                        }}
                    >
                        <ChevronUp className='h-4 w-4' />
                    </Button>
                </div>

                <div className='space-x-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
                                <Search className='h-4 w-4' />
                                {scale * 100}%<ChevronDown className='h-3 w-3 opacity-50' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setScale(0.5)}>
                                50%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(0.7)}>
                                70%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(0.9)}>
                                90%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1)}>
                                100%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1.25)}>
                                125%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1.5)}>
                                150%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2)}>
                                200%
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        onClick={() => {
                            setRotation((prev) => prev + 90)
                        }}
                        variant='ghost'
                        aria-label='rotacionar 90 graus'>
                        <RotateCw className='h-4 w-4' />
                    </Button>
                </div>
            </div>

            <div className='flex-1 w-full max-h-screen'>
                <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
                    <div ref={ref}>
                        <Document
                            onLoadSuccess={({ numPages }) => setNumeroPagina(numPages)}
                            onLoadError={() => {
                                toast({
                                    title: 'Erro ao carregar o PDF',
                                    description: 'Por favor, tente novamente mais tarde.',
                                    variant: 'destructive',
                                })
                            }}
                            loading={<div className='flex justify-center'><Loader2 className='h-6 w-6 my-24 animate-spin' /></div>}
                            file={url}
                            className='max-h-full'>
                            <Page
                                width={width ? width : 1}
                                pageNumber={paginaAtual}
                                scale={scale}
                                rotate={rotation}
                            />
                        </Document>
                    </div>
                </SimpleBar>
            </div>
        </div>
    )
}

export default RenderPDF

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Expand, Loader2 } from 'lucide-react'
import SimpleBar from 'simplebar-react'
import { Document, Page } from 'react-pdf'
import { useToast } from './ui/use-toast'
import { useResizeDetector } from 'react-resize-detector'

interface Props {
    fileUrl: string
}

const PdfFullScreen = ({ fileUrl }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [numeroPagina, setNumeroPagina] = useState<number>()
    const [paginaAtual, setPaginaAtual] = useState<number>(1)

    const { toast } = useToast()
    const { width, ref } = useResizeDetector()


    return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) {
                setIsOpen(v)
            }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button variant='ghost' className='gap-1.5' aria-label='abrir pdf em tela cheia'>
                    <Expand className='h-4 w-4' />
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-7xl w-full'>
                <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
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
                            file={fileUrl}
                            className='max-h-full'>
                            {new Array(numeroPagina).fill(0).map((_, index) => (
                                <Page
                                    key={index}
                                    width={width ? width : 1}
                                    pageNumber={index + 1}
                                />
                            ))}
                        </Document>
                    </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    )
}

export default PdfFullScreen
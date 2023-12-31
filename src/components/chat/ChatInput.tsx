import React, { useContext, useRef } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { ChatContext } from './ChatContext'

type Props = {
    isDisabled?: boolean
}

const ChatInput = ({ isDisabled }: Props) => {

    const { addMessage, message, handleInputChange, isLoading } = useContext(ChatContext)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    return (
        <div className='absolte bottom-0 left-0 w-full'>
            <form className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
                <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
                    <div className='relative flex flex-col w-full flex-grow p-4'>
                        <div className="relative">
                            <Textarea
                                rows={1}
                                ref={textareaRef}
                                maxRows={4}
                                autoFocus
                                value={message}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        addMessage()
                                        textareaRef.current?.focus()
                                    }
                                }}
                                placeholder='Escreva sua pergunta...'
                                className='resize-none pr-12 text-base py-3 scrollbar-thumb-green scrollbar-thumb-rounded-full scrollbar-track-green-lighter scrollbar-w-2 scrolling-touch'
                                disabled={isDisabled}
                            />

                            <Button
                                disabled={isLoading || isDisabled}
                                onClick={() => {
                                    addMessage()
                                    textareaRef.current?.focus()
                                }}
                                className='absolute bottom-1.5 right-[8px]'
                                aria-label='enviar mensagem'>
                                <Send className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChatInput
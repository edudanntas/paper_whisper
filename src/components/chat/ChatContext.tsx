import { ReactNode, createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

type ChatContextType = {
    addMessage: () => void;
    message: string;
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    isLoading: boolean
}

export const ChatContext = createContext<ChatContextType>({
    addMessage: () => { },
    message: '',
    handleInputChange: () => { },
    isLoading: false,
})

type Props = {
    fileId: string;
    children: ReactNode
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { toast } = useToast()

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({ message, fileId })
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
            }

            return response.body
        }
    })

    const addMessage = () => sendMessage({ message })

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }

    return (
        <ChatContext.Provider
            value={{
                addMessage,
                message,
                handleInputChange,
                isLoading
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}
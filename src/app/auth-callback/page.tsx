'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../(trpc)/client"
import { router } from "@/trpc/trpc"
import { Loader2 } from "lucide-react"

const Page = () => {
    const route = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) {
                route.push(origin ? `/${origin}` : '/dashboard')
            }
        },
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") {
                route.push('/sign-in')
            }
        },
        retry: true,
        retryDelay: 500,
    })

    return (
        <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
                <h3 className="font-semibold text-xl">Realizando os retoques finais...</h3>
                <p>Você vai ser redirecionado automaticamente.</p>
            </div>
        </div>
    )
}

export default Page
import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../(trpc)/client"
import { router } from "@/trpc/trpc"

const Page = () => {
    const route = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
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
}

export default Page
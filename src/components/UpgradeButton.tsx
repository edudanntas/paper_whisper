'use client'
import { trpc } from '@/app/(trpc)/client'
import { ArrowRight, Clock } from 'lucide-react'
import { Button } from './ui/button'

const UpgradeButton = () => {

    const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
        onSuccess: ({ url }) => {
            window.location.href = url ?? '/dashboard/billing'
        }
    })

    return (
        <Button onClick={() => createStripeSession()} className='w-full'>
            Contrate agora <ArrowRight className='h-5 w-5 ml-1.5' />
        </Button>
    )
}

export default UpgradeButton
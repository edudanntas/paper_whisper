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
        <Button disabled={true} onClick={() => createStripeSession()} className='w-full'>
            Em breve... <Clock className='h-5 w-5 ml-1.5' />
        </Button>
    )
}

export default UpgradeButton
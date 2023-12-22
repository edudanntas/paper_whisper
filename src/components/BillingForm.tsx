'use client'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import React from 'react'
import { useToast } from './ui/use-toast'
import { trpc } from '@/app/(trpc)/client'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'


type Props = {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>

}

const BillingForm = ({ subscriptionPlan }: Props) => {
    const { toast } = useToast()

    const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
        onSuccess: ({ url }) => {
            if (url) window.location.href = url
            if (!url) {
                toast({
                    title: 'Houve um problema...',
                    description: 'Por favor tente novamente em um momento.',
                    variant: 'destructive',
                })
            }
        }
    })

    return (
        <MaxWidthWrapper className='max-w-5xl'>
            <form className='mt-12' onSubmit={(e) => {
                e.preventDefault()
                createStripeSession()
            }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Assinatura</CardTitle>
                        <CardDescription>Você atualmente tem o plano <strong>{subscriptionPlan.name}</strong>.</CardDescription>
                    </CardHeader>

                    <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
                        <Button type='submit'>
                            {isLoading ? (
                                <Loader2 className='mr-4 h-4 w-4 animate-spin' />
                            ) : null}
                            {subscriptionPlan.isSubscribed ? "Gerenciar Assinatura" : "Mude para o PRO"}
                        </Button>

                        {subscriptionPlan.isSubscribed ? (
                            <p className='rounded-full text-xs font-medium'>
                                {subscriptionPlan.isCanceled ? "Seu plano será cancelado em " : "Seu plano será renovado em "}
                                {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd/MM/yyyy')}.
                            </p>
                        ) : null}

                    </CardFooter>

                </Card>
            </form>
        </MaxWidthWrapper>
    )
}

export default BillingForm



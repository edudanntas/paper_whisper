import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { PLANS } from '@/config/stripe'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight, Check, Clock, Divide, HelpCircle, MinusCircle } from 'lucide-react'
import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import UpgradeButton from '@/components/UpgradeButton'

const Page = () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    const pricingItems = [
        {
            plan: 'Gratuito',
            tagline: 'Para projetos menores.',
            quota: 10,
            features: [
                {
                    text: '15 páginas por PDF',
                    footnote: 'A quantidade máxima de páginas por arquivo PDF.',
                },
                {
                    text: 'Limite de tamanho do arquivo: 4MB',
                    footnote: 'O tamanho máximo do arquivo PDF único.',
                },
                {
                    text: 'Interface para dispositivos móveis',
                },
                {
                    text: 'Respostas de alta qualidade',
                    footnote: 'Respostas algorítmicas melhores para maior qualidade de conteúdo',
                    negative: true,
                },
                {
                    text: 'Suporte prioritário',
                    negative: true,
                },
            ],
        },
        {
            plan: 'Pro',
            tagline: 'Para projetos maiores.',
            quota: PLANS.find((p) => p.slug === 'pro')!.quota,
            features: [
                {
                    text: '40 páginas por PDF',
                    footnote: 'A quantidade máxima de páginas por arquivo PDF.',
                },
                {
                    text: 'Limite de tamanho do arquivo: 16MB',
                    footnote: 'O tamanho máximo do arquivo PDF único.',
                },
                {
                    text: 'Interface para dispositivos móveis',
                },
                {
                    text: 'Respostas de alta qualidade',
                    footnote: 'Respostas algorítmicas melhores para maior qualidade de conteúdo',
                },
                {
                    text: 'Suporte prioritário',
                },
            ],
        },
    ]

    return (
        <>
            <MaxWidthWrapper className='mb-8 mt-24 text-center max-w-5xl'>
                <div className='mx-auto mb-10 sm:max-w-lg'>
                    <h1 className='text-6xl font-bold sm:text-7xl'>Planos</h1>
                    <p className='mt-5 text-gray-600 sm:text-lg'>
                        Caso esteja apenas experimentando nosso serviço ou precisa de mais, nós iremos te ajudar.
                    </p>
                </div>

                <div className='pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
                    <TooltipProvider>
                        {pricingItems.map(({ plan, tagline, quota, features }) => {
                            const price = PLANS.find((p) => p.slug === plan.toLocaleLowerCase())?.price.amount || 0

                            return (<div key={plan} className={cn('relative rounded-2xl bg-white shadow-lg', {
                                'border-2 border-green-600 shadow-green-200': plan === 'Pro',
                                'border border-gray-200': plan !== 'Pro',
                            })}>
                                {plan === 'Pro' && (
                                    <div className='absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2 text-sm font-medium text-white'>
                                        Contrate Agora
                                    </div>
                                )}
                                <div className='p-5'>
                                    <h3 className='my-3 text-center font-display text-3xl font-bold'>
                                        {plan}
                                    </h3>
                                    <p className='text-gray-500'>{tagline}</p>
                                    <p className='my-5 font-display text-6xl font-semibold'>R${price}</p>
                                    <p className='text-gray-500'>por mês</p>
                                </div>
                                <div className='flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50'>
                                    <div className='flex items-center space-x-1'>
                                        <p>{quota.toLocaleString()} PDFs/mês inclusos</p>

                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger className='cursor-default ml-1.5'>
                                                <HelpCircle className='h-4 w-4 text-zinc-500' />
                                            </TooltipTrigger>
                                            <TooltipContent className='w-80 p-2'>
                                                Quantos PDFs podem ser enviados por mês.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                                <ul className='my-10 space-y-5 px-8'>
                                    {features.map(({ text, footnote, negative }) => (
                                        <li key={text} className='flex space-x-5'>
                                            <div className='flex-shrink-0'>
                                                {negative ? (
                                                    <MinusCircle className='h-6 w-6 text-gray-300' />
                                                ) : (
                                                    <Check className='h-6 w-6 text-green-500' />
                                                )}
                                            </div>
                                            {footnote ? (
                                                <div className='flex items-center space-x-1'>
                                                    <p className={cn('text-gray-400', {
                                                        'text-gray-600': negative
                                                    })}>
                                                        {text}
                                                    </p>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger className='cursor-default ml-1.5'>
                                                            <HelpCircle className='h-4 w-4 text-zinc-500' />
                                                        </TooltipTrigger>
                                                        <TooltipContent className='w-80 p-2'>
                                                            {footnote}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <p className={cn('text-gray-400', {
                                                    'text-gray-600': negative
                                                })}>
                                                    {text}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <div className='border-t border-gray-200' />
                                <div className='p-5'>
                                    {plan === 'Gratuito' ? (
                                        <Link href={user ? '/dashboard' : 'register'} className={buttonVariants({
                                            className: 'w-full',
                                            variant: 'secondary',
                                        })}>
                                            {user ? "Vá para o dashboard" : "Registre-se"}
                                            <ArrowRight className='h-5 w-5 ml-1.5' />
                                        </Link>
                                    ) : user ? (
                                        <UpgradeButton />
                                    ) : (
                                        <Link href="/register" className={buttonVariants({
                                            className: 'w-full'
                                        })}>Registre-se <ArrowRight className='h-5 w-5 ml-1.5' /></Link>
                                    )}
                                </div>
                            </div>)
                        }
                        )}
                    </TooltipProvider>
                </div>
            </MaxWidthWrapper>
        </>
    )
}

export default Page
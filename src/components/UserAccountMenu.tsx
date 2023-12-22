import { getUserSubscriptionPlan } from '@/lib/stripe'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { Icons } from './Icons'
import Link from 'next/link'
import { Gem } from 'lucide-react'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server'

type Props = {
    email: string | undefined
    imageUrl: string
    name: string
}

const UserAccountMenu = async ({ email, imageUrl, name }: Props) => {
    const subscriptionPlan = await getUserSubscriptionPlan()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='overflow-visible'>
                <Button className='rounded-full h-8 w-8 aspect-square bg-slate-400'>
                    <Avatar className='relative w-8 h-8'>
                        {imageUrl ? (
                            <div className='relative aspect-square h-full w-full'>
                                <Image fill src={imageUrl} alt='imagem de perfil' referrerPolicy='no-referrer' />
                            </div>
                        ) : <AvatarFallback>
                            <span className='sr-only'>{name}</span>
                            <Icons.user className='h-4 w-4 text-green-600' />
                        </AvatarFallback>}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='bg-white' align='end'>
                <div className='flex items-center gap-2 justify-start p-2'>
                    <div className='flex flex-col space-y-0.5 leading-none'>
                        {name && <p className='font-medium text-sm text-black'>{name}</p>}
                        {email && (
                            <p className='w-[200px] truncate text-xs text-zinc-700'>{email}</p>
                        )}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link className='cursor-pointer' href='/dashboard'>
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    {subscriptionPlan?.isSubscribed ? (
                        <Link className='cursor-pointer' href='/dashboard/billing'>Gerenciar sua assinatura</Link>
                    ) : (
                        <Link className='cursor-pointer' href='/planos'>Assinar <Gem className='ml-1.5 h-4 w-4 text-green-500' /></Link>
                    )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' asChild>
                    <LogoutLink>Sair</LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}

export default UserAccountMenu
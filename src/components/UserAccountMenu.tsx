import { getUserSubscriptionPlan } from '@/lib/stripe'
import React from 'react'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { Icons } from './Icons'

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
        </DropdownMenu>
    )
}

export default UserAccountMenu
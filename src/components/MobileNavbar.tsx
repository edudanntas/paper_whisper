'use client'
import { ArrowRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const MobileNavbar = ({ isAuth }: { isAuth: boolean }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleOpenMenu = () => setIsOpen((prev) => !prev)

    const pathname = usePathname()

    useEffect(() => {
        if (isOpen) handleOpenMenu()
    }, [pathname])

    const closeOnCurrent = (url: string) => {
        if (url === pathname) {
            handleOpenMenu()
        }

    }

    return (
        <div className='sm:hidden'>
            <Menu onClick={handleOpenMenu} className=' relative z-50 h-5 w-5  text-zinc-700' />

            {isOpen ? (
                <div className='fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full'>
                    <ul className='absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8'>
                        {!isAuth ? (
                            <>
                                <li>
                                    <Link
                                        onClick={() => closeOnCurrent('/register')}
                                        className='flex items-center w-full font-semibold text-green-600'
                                        href='/register'>
                                        Começar <ArrowRight className='ml-2 h-5 w-5' />
                                    </Link>
                                </li>
                                <li className='my-3 h-px w-full bg-zinc-300' />
                                <li>
                                    <Link
                                        onClick={() => closeOnCurrent('/login')}
                                        className='flex items-center w-full font-semibold'
                                        href='/login'>
                                        Login
                                    </Link>
                                </li>
                                <li className='my-3 h-px w-full bg-zinc-300' />
                                <li>
                                    <Link
                                        onClick={() => closeOnCurrent('/planos')}
                                        className='flex items-center w-full font-semibold'
                                        href='/planos'>
                                        Planos
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        onClick={() => closeOnCurrent('/dashboard')}
                                        className='flex items-center w-full font-semibold'
                                        href='/dashboard'>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className='my-3 h-px w-full bg-zinc-300' />
                                <li>
                                    <Link
                                        className='flex items-center w-full font-semibold'
                                        href='/logout'>
                                        Sair
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}

export default MobileNavbar
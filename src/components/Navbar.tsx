import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { buttonVariants } from "./ui/button"
import { LoginLink, RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from "lucide-react"
import UserAccountMenu from "./UserAccountMenu"
import MobileNavbar from "./MobileNavbar"

const Navbar = () => {

    const { getUser } = getKindeServerSession()
    const user = getUser()

    return (
        <nav className="h-14 sticky inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href='/' className="flex font-semibold z-40">
                        <span>PaperWhisper.</span>
                    </Link>

                    <MobileNavbar isAuth={!!user} />

                    <div className="hidden items-center space-x-4 sm:flex">
                        {!user ? <>
                            <Link href='/planos'
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm'
                                })}
                            >Planos</Link>
                            <LoginLink className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm'
                            })} >Login</LoginLink>
                            <RegisterLink className={buttonVariants({
                                size: 'sm'
                            })} >Começar <ArrowRight className="ml-1.5 h-5 w-5" /> </RegisterLink>
                        </> : <>
                            <Link href='/dashboard'
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm'
                                })}
                            >Dashboard
                            </Link>
                            <UserAccountMenu
                                name={
                                    !user.given_name || !user.family_name ? "Sua Conta" : `${user.given_name} ${user.family_name}`
                                }
                                email={user.email ?? ''}
                                imageUrl={user.picture ?? ''}
                            />
                        </>}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar
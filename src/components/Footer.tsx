import MaxWidthWrapper from './MaxWidthWrapper'

const Footer = () => {
    return (
        <footer className="h-20 inset-x-0 bottom-0 z-30 w-full border-t border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex lg:h-20 items-center justify-between">
                    <span className='flex font-semibold z-40'>2023 Paper Whisper - Todos os direitos reservados</span>
                    <div className="items-center space-x-4 sm:flex">
                        <span>Feito por <a className='font-semibold text-green-600 hover:text-green-700' href='https://www.linkedin.com/in/eduardo-danttas/'>Eduardo Dantas</a></span>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    )
}

export default Footer
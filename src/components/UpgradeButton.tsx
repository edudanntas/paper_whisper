import React from 'react'
import { Button } from './ui/button'
import { Arrow } from '@radix-ui/react-tooltip'
import { ArrowRight } from 'lucide-react'

const UpgradeButton = () => {
    return (
        <Button className='w-full'>
            Faça o upgrade <ArrowRight className='h-5 w-5 ml-1.5' />
        </Button>
    )
}

export default UpgradeButton
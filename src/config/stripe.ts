export const PLANS = [
    {
        name: 'Gratuito',
        slug: 'gratuito',
        quota: 10,
        pagesPerPdf: 5,
        price: {
            amount: 0,
            priceIds: {
                test: '',
                production: '',
            }
        }
    },
    {
        name: 'Pro',
        slug: 'pro',
        quota: 50,
        pagesPerPdf: 25,
        price: {
            amount: 20,
            priceIds: {
                test: 'price_1OPtSIKz5m4TRCFz6UrjVax3',
                production: '',
            }
        }
    }
]
export const PLANS = [
    {
        name: 'Gratuito',
        slug: 'gratuito',
        quota: 10,
        pagesPerPdf: 15,
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
        quota: 30,
        pagesPerPdf: 40,
        price: {
            amount: 20,
            priceIds: {
                test: 'price_1OPtSIKz5m4TRCFz6UrjVax3',
                production: 'price_1OQXVyKz5m4TRCFzYKb4nkOr',
            }
        }
    }
]
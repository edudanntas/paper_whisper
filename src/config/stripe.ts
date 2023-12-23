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
        quota: 50,
        pagesPerPdf: 40,
        price: {
            amount: 20,
            priceIds: {
                test: process.env.STRIPE_TEST_PRICE_ID!,
                production: process.env.STRIPE_PROD_PRICE_ID!,
            }
        }
    }
]
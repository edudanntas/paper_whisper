import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { PLANS } from '@/config/stripe';
import { db } from '@/db';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from './trpc';
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession()
        const user = getUser()
        if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" })

        const dbUser = await db.user.findFirst({
            where: {
                id: user.id
            }
        })

        if (!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email
                }
            })
        }

        return { success: true }
    }),
    getUserFiles: protectedProcedure.query(async ({ ctx }) => {
        const { user, userId } = ctx
        return await db.file.findMany({
            where: {
                userId
            }
        })
    }),

    createStripeSession: protectedProcedure.mutation(
        async ({ ctx }) => {
            const { userId } = ctx

            const billingUrl = absoluteUrl('/dashboard/billing')

            if (!userId)
                throw new TRPCError({ code: 'UNAUTHORIZED' })

            const dbUser = await db.user.findFirst({
                where: {
                    id: userId,
                },
            })

            if (!dbUser)
                throw new TRPCError({ code: 'UNAUTHORIZED' })

            const subscriptionPlan = await getUserSubscriptionPlan()



            if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
                const stripeSession = await stripe.billingPortal.sessions.create({
                    return_url: billingUrl,
                    customer: dbUser.stripeCustomerId
                })

                return { url: stripeSession.url }
            }

            // Create the Checkout Session
            const stripeSession =
                await stripe.checkout.sessions.create({
                    success_url: billingUrl,
                    cancel_url: billingUrl,
                    payment_method_types: ['card'],
                    mode: 'subscription',
                    billing_address_collection: 'auto',
                    line_items: [
                        {
                            price: PLANS.find(
                                (plan) => plan.name === 'Pro'
                            )?.price.priceIds.production,
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        userId: userId,
                    },
                })

            return { url: stripeSession.url }
        }
    ),

    getFileMessages: protectedProcedure.input(z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string()
    })).query(async ({ ctx, input }) => {
        const { userId } = ctx
        const { fileId, cursor } = input
        const limite = input.limit ?? INFINITE_QUERY_LIMIT

        const file = await db.file.findFirst({
            where: {
                id: fileId,
                userId
            }
        })

        if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

        const messages = await db.message.findMany({
            take: limite + 1,
            where: {
                fileId
            },
            orderBy: {
                createdAt: 'desc'
            },
            cursor: cursor ? { id: cursor } : undefined,
            select: {
                id: true,
                isUserMessage: true,
                text: true,
                createdAt: true
            }
        })

        let nextCursor: typeof cursor | undefined = undefined
        if (messages.length > limite) {
            const nextMessage = messages.pop()
            nextCursor = nextMessage?.id
        }

        return {
            messages,
            nextCursor
        }
    }),

    getFileUploadStatus: protectedProcedure.input((z.object({ fileId: z.string() }))).query(async ({ ctx, input }) => {
        const { userId } = ctx
        const file = await db.file.findFirst({
            where: {
                id: input.fileId,
                userId
            }
        })
        if (!file) return { status: "PENDING" as const }

        return { status: file.UploadStatus }

    }),
    getFile: protectedProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx, input }) => {
        const { userId } = ctx

        const file = await db.file.findFirst({
            where: {
                key: input.key,
                userId
            }
        })

        if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

        return file
    }),
    deteleFile: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const { userId } = ctx

        const file = await db.file.findFirst({
            where: {
                id: input.id,
                userId,
            },
        })

        const fileKey = file?.key

        const messages = await db.message.findMany({
            where: {
                fileId: input.id,
                userId,
            }
        })

        if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

        await db.message.deleteMany({
            where: {
                fileId: input.id
            }
        })

        await db.file.delete({
            where: {
                id: input.id,
            },
        })

        await utapi.deleteFiles(fileKey!)

        return {
            file,
            messages
        }
    }),
});

export type AppRouter = typeof appRouter;
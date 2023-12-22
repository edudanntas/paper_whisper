import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

const f = createUploadthing();

export const ourFileRouter = {

    pdfUploader: f({ pdf: { maxFileSize: "4MB" } })

        .middleware(async ({ req }) => {
            const { getUser } = getKindeServerSession()
            const user = getUser()
            if (!user || !user.id) throw new Error("Unauthorized");
            return { userId: user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const fileCreate = await db.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userId: metadata.userId,
                    url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
                    UploadStatus: "PENDING",
                }
            })

            try {
                const response = await fetch(`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`)

                const blob = await response.blob()

                const loader = new PDFLoader(blob)

                const pageLevelDocs = await loader.load()

                const pagesAmount = pageLevelDocs.length

                //vetorizar o documento

                const pineconeIndex = pinecone.Index('paper-whisper')

                const embeddings = new OpenAIEmbeddings({
                    openAIApiKey: process.env.OPENAI_API_KEY
                })

                await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
                    pineconeIndex,
                    namespace: fileCreate.id,
                })

                await db.file.update({
                    data: {
                        UploadStatus: "SUCCESS"
                    },
                    where: {
                        id: fileCreate.id
                    }
                })

            } catch (err) {

                await db.file.update({
                    data: {
                        UploadStatus: "FAILED"
                    },
                    where: {
                        id: fileCreate.id
                    }
                })

            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
import { Prisma } from "@prisma/client";
import {
  EmbeddingType,
  DocumentType,
  RAGInsertType,
  RAGQueryResultType,
  DocumentWithEmbeddingType,
  DocumentIdType,
} from "@/lib/services/api-services/rag/types";
import { prisma } from "@/lib/db";
import { ChatBotIdType, UserIdType } from "@/lib/db/types";

export class DocumentNotFoundException extends Error {}

export async function getVectorForDocument(
  chatBotId: ChatBotIdType,
  documentId: string,
): Promise<number[]> {
  const vectors: { vector: string }[] = await prisma.$queryRaw(Prisma.sql`
    SELECT vector::text AS vector
    FROM "Document"
    WHERE "chatBotId" = ${chatBotId} AND id = ${documentId};
  `);

  if (vectors.length !== 1) {
    throw new DocumentNotFoundException();
  }

  const vectorString = vectors[0].vector as unknown as string;
  const vectorArray = vectorString.slice(1, -1).split(",").map(parseFloat);

  return vectorArray;
}

export async function insertFile(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
  ragFile: RAGInsertType,
) {
  const { embedding, ...rest } = ragFile;

  const data: Prisma.DocumentCreateInput = Object.assign({}, rest, {
    ChatBot: { connect: { id: chatBotId, userId } },
  });

  const documents = await prisma.$transaction(
    async (t) => {
      const document = await t.document.create({
        data,
      });

      const vectorString = `[${embedding.join(",")}]`; // Convert vector to PostgreSQL array format
      await t.$queryRaw(Prisma.sql`
      UPDATE "Document"
      SET vector = ${vectorString}::vector(1536)
      WHERE id = ${document.id};
    `);

      return document;
    },
    { timeout: 999999 },
  );

  return documents;
}

export async function deleteDocuments(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
) {
  return prisma.document.deleteMany({
    where: {
      ChatBot: { id: chatBotId, userId },
    },
  });
}

export async function getSingleFiles(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
): Promise<DocumentType[]> {
  return prisma.document.findMany({
    where: {
      ChatBot: { id: chatBotId, userId },
      isSingleFile: true,
    },
  });
}

export async function deleteSingleFile(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
  documentId: DocumentIdType,
) {
  return prisma.document.delete({
    where: {
      ChatBot: { id: chatBotId, userId },
      id: documentId,
    },
  });
}

export async function findClosest(
  queryVector: EmbeddingType,
  n: number = 5,
): Promise<RAGQueryResultType[]> {
  const vectorString = `[${queryVector.join(",")}]`; // Convert query vector to PostgreSQL vector format

  // Perform similarity search at the SQL level
  const results = await prisma.$queryRaw<
    DocumentWithEmbeddingType[]
  >(Prisma.sql`
    SELECT id, name, content, isSingleFile, 'createdAt', 'chatBotId', vector <-> ${vectorString}::vector(1536) AS distance
    FROM "Document"
    WHERE vector IS NOT NULL
    ORDER BY distance DESC
    LIMIT ${n};
  `);

  return results.map((r) => ({
    name: r.name,
    embedding: vectorString.split(",").map((v) => parseFloat(v)),
    content: r.content,
    isSingleFile: r.isSingleFile,
  }));
}

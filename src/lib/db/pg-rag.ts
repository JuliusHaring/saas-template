import { Prisma } from "@prisma/client";
import {
  EmbeddingType,
  FileIdType,
  FileType,
  FileWithEmbeddingType,
  InsertionSourceType,
  RAGInsertType,
  RAGQueryResultType,
} from "@/lib/services/api-services/rag/types";
import { prisma } from "@/lib/db";
import { ChatBotIdType, UserIdType } from "@/lib/db/types";

export class FileNotFoundException extends Error {}

export async function getVectorForFile(
  chatBotId: ChatBotIdType,
  fileId: FileIdType,
): Promise<number[]> {
  const vectors: { vector: string }[] = await prisma.$queryRaw(Prisma.sql`
    SELECT vector::text AS vector
    FROM "File"
    WHERE "chatBotId" = ${chatBotId} AND id = ${fileId};
  `);

  if (vectors.length !== 1) {
    throw new FileNotFoundException();
  }

  const vectorString = vectors[0].vector as unknown as string;
  const vectorArray = vectorString.slice(1, -1).split(",").map(parseFloat);

  return vectorArray;
}

export async function insertFiles(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
  ragFiles: RAGInsertType[],
  tx: Prisma.TransactionClient,
) {
  if (ragFiles.length === 0) {
    return { count: 0 };
  }

  const createPromises = ragFiles.map((ragFile) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { embedding, ...rest } = ragFile;
    const data = Object.assign({}, rest, {
      ChatBot: { connect: { id: chatBotId } },
    });
    return tx.file.create({ data });
  });
  const createdFiles = await Promise.all(createPromises);

  const updatePromises = createdFiles.map((file, index) => {
    const vectorString = `[${ragFiles[index].embedding.join(",")}]`;
    return tx.$queryRaw(Prisma.sql`
      UPDATE "File"
      SET vector = ${vectorString}::vector(1536)
      WHERE id = ${file.id} AND 'userId' = ${userId} AND 'chatBotId' = ${chatBotId};
    `);
  });

  await Promise.all(updatePromises);

  return { count: createdFiles.length };
}

export async function getFile(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
  fileId: FileIdType,
) {
  return prisma.file.findFirstOrThrow({
    where: {
      ChatBot: { id: chatBotId, userId },
      id: fileId,
    },
  });
}

export async function getFiles(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
): Promise<FileType[]> {
  return prisma.file.findMany({
    where: {
      ChatBot: { id: chatBotId, userId },
    },
  });
}

export async function deleteFile(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
  fileId: FileIdType,
) {
  return prisma.file.delete({
    where: {
      ChatBot: { id: chatBotId, userId },
      id: fileId,
    },
  });
}

export async function deleteFiles(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
) {
  return prisma.file.deleteMany({
    where: {
      ChatBot: { id: chatBotId, userId },
    },
  });
}

export async function deleteFilesFromSource(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
  insertionSource: InsertionSourceType,
) {
  return prisma.file.deleteMany({
    where: {
      ChatBot: { id: chatBotId, userId },
      insertionSource,
    },
  });
}

export async function findClosest(
  chatBotId: ChatBotIdType,
  queryVector: EmbeddingType,
  n: number = 5,
): Promise<RAGQueryResultType[]> {
  const vectorString = `[${queryVector.join(",")}]`; // Convert query vector to PostgreSQL vector format

  // Perform similarity search at the SQL level
  const results = await prisma.$queryRaw<FileWithEmbeddingType[]>(Prisma.sql`
    SELECT id, name, content, "createdAt", "chatBotId", "insertionSource", vector <-> ${vectorString}::vector(1536) AS distance
    FROM "File"
    WHERE vector IS NOT NULL
    AND "chatBotId" = ${chatBotId}
    ORDER BY distance ASC
    LIMIT ${n};
  `);

  return results.map((r) => ({
    name: r.name,
    embedding: vectorString.split(",").map((v) => parseFloat(v)),
    content: r.content,
    insertionSource: r.insertionSource,
  }));
}

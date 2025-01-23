import { ChatBot, Prisma, Document } from "@prisma/client";
import { prisma } from ".";

type VectorAddedType = {
  vector: number[];
};

type VectorFoundType = DocumentType & { distance: number };

export type CreateDocumentType = Omit<Prisma.DocumentCreateInput, "ChatBot"> &
  VectorAddedType;

export type DocumentType = Document & VectorAddedType;

export class DocumentNotFoundException extends Error {}

export async function getVectorForDocument(
  assistantId: ChatBot["assistantId"],
  documentId: string,
): Promise<number[]> {
  const vectors: { vector: string }[] = await prisma.$queryRaw(Prisma.sql`
    SELECT vector::text AS vector
    FROM "Document"
    WHERE "assistantId" = ${assistantId} AND id = ${documentId};
  `);

  if (vectors.length !== 1) {
    throw new DocumentNotFoundException();
  }

  const vectorString = vectors[0].vector as unknown as string;
  const vectorArray = vectorString.slice(1, -1).split(",").map(parseFloat);

  return vectorArray;
}

export async function createDocument(
  assistantId: ChatBot["assistantId"],
  createDocument: CreateDocumentType, // Includes vector
) {
  const { vector, ...rest } = createDocument; // Extract vector from the input object

  // Create the document without the vector column
  const data: Prisma.DocumentCreateInput = Object.assign({}, rest, {
    ChatBot: { connect: { assistantId } },
  });

  const documents = await prisma.$transaction(
    async (t) => {
      const document = await t.document.create({
        data,
      });

      const vectorString = `[${vector.join(",")}]`; // Convert vector to PostgreSQL array format
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

export async function deleteDocuments(assistantId: ChatBot["assistantId"]) {
  return prisma.document.deleteMany({
    where: {
      ChatBot: { assistantId },
    },
  });
}

export async function findClosest(
  queryVector: number[],
  n: number = 5,
): Promise<VectorFoundType[]> {
  const vectorString = `[${queryVector.join(",")}]`; // Convert query vector to PostgreSQL vector format

  // Perform similarity search at the SQL level
  const results = await prisma.$queryRaw<VectorFoundType[]>(Prisma.sql`
    SELECT id, name, content, 'createdAt', 'assistantId', vector <-> ${vectorString}::vector(1536) AS distance
    FROM "Document"
    WHERE vector IS NOT NULL
    ORDER BY distance DESC
    LIMIT ${n};
  `);

  return results;
}

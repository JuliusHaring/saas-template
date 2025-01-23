import { ChatBot, Prisma, Document } from "@prisma/client";
import { prisma } from ".";

export type CreateDocumentType = Omit<Prisma.DocumentCreateInput, "ChatBot"> & {
  vector: number[];
};

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

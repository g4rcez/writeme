import { Domain } from "../domain";

export interface IDocument {
  GetAllDocumentPaths(): Promise<string[]>;

  GetDocumentById(id: string): Promise<Domain.Document | null>;

  GetDocumentByName(name: string): Promise<Domain.Document | null>;

  GetDocuments(): Promise<Domain.DocumentDesc[]>;

  Save(document: Domain.Document): Promise<void>;

  Update(document: Domain.Document, id: string): Promise<Domain.Document | null>;
}

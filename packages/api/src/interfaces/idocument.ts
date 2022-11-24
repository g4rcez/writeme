import { Domain } from "../domain";

export interface IDocument {
  getAllPaths(): Promise<string[]>;

  getById(id: string): Promise<Domain.Document | null>;

  getByName(name: string): Promise<Domain.Document | null>;

  getAll(): Promise<Domain.DocumentDesc[]>;

  save(document: Domain.Document): Promise<void>;

  update(document: Domain.Document, id: string): Promise<Domain.Document | null>;
}

import { Domain } from "../domain";
import { IRepository } from "./irepository";

export interface IDocumentsRepository extends IRepository<Domain.Document, Domain.DocumentDesc> {}

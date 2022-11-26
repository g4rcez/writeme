import { Domain } from "../domain";
import { IRepository } from "./irepository";

export interface DocumentsRepository extends IRepository<Domain.Document, Domain.DocumentDesc> {}

import { Domain } from "../domain";
import { IRepository } from "./irepository";

export interface IDocument extends IRepository<Domain.Document, Domain.DocumentDesc> {}

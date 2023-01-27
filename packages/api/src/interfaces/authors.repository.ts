import { Domain } from "../domain";
import { IRepository } from "./irepository";

export interface IAuthorsRepository extends IRepository<Domain.Author> {}

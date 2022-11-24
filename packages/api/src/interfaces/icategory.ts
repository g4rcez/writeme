import { Domain } from "../domain";

export interface ICategory {
  delete(id: string): Promise<boolean>;

  getCategories(): Promise<Domain.Category[]>;

  getCategoryById(id: string): Promise<Domain.Category | null>;

  save(category: Domain.Category): Promise<void>;

  update(category: Domain.Category): Promise<void>;
}

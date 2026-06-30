import { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(
    protected readonly _model: Model<T>
  ) {}

  async create(data: Partial<T>): Promise<T> {
    return await this._model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this._model.findById(id);
  }

  async update(
    id: string,
    data: Partial<T>
  ): Promise<T | null> {
    return await this._model.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await this._model.findByIdAndDelete(id);
    return result !== null;
  }
}
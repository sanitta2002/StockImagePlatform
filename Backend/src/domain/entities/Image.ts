export class Image {
  constructor(
    public readonly id: string | null,
    public readonly userId: string,
    public title: string,
    public imageUrl: string,
    public publicId: string,
    public order: number = 0,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
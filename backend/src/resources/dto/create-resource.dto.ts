export class CreateResourceDto {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  archived?: boolean;
}

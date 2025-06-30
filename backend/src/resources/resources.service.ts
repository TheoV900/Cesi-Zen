import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupère toutes les ressources filtrées par archived (true/false)
   */
  async findAll(archived: boolean) {
    return this.prisma.resource.findMany({
      where: { archived },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Récupère une seule ressource par ID
   */
  async findOne(id: number) {
    const res = await this.prisma.resource.findUnique({ where: { id } });
    if (!res) throw new NotFoundException('Ressource introuvable');
    return res;
  }

  /**
   * Crée une nouvelle ressource (dto contient title, description, content, imageUrl?, archived)
   */
  async create(dto: CreateResourceDto) {
    return this.prisma.resource.create({ data: dto });
  }

  /**
   * Met à jour une ressource existante
   */
  async update(id: number, dto: UpdateResourceDto) {
    await this.findOne(id); // 404 si n’existe pas
    return this.prisma.resource.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Supprime une ressource
   */
  async remove(id: number) {
    await this.findOne(id); // 404 si n’existe pas
    return this.prisma.resource.delete({ where: { id } });
  }
}

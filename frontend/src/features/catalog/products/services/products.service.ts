import { ApiClient } from '@/lib/api-client';
import type { Product, CreateProductDto, UpdateProductDto } from '../types';

export const productsService = {
  async getAll(): Promise<Product[]> {
    return ApiClient.get<Product[]>('/catalog/products');
  },

  async getById(id: string): Promise<Product> {
    return ApiClient.get<Product>(`/catalog/products/${id}`);
  },

  async create(dto: CreateProductDto): Promise<Product> {
    return ApiClient.post<Product>('/catalog/products', dto);
  },

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    return ApiClient.put<Product>(`/catalog/products/${id}`, dto);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/catalog/products/${id}`);
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');
    formData.append('type', 'products');

    const storageRes = await ApiClient.post<{
      id: string;
      key: string;
      bucket: string;
      folder: string;
      originalName: string;
      fileName: string;
      mimeType: string;
      size: number;
      url: string;
      createdAt: string;
    }>('/storage/upload', formData);

    return `/storage/view?key=${encodeURIComponent(storageRes.key)}`;
  },
};


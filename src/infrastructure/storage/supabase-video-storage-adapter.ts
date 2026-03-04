// src/infrastructure/storage/supabase-video-storage-adapter.ts

import { createClient } from "@supabase/supabase-js";
import type { IVideoStorage, UploadVideoInput, VideoUrl } from "@/domain/ports/video-storage.port";

export class SupabaseVideoStorageAdapter implements IVideoStorage {
  private supabase: any;
  private bucketName = "videos";

  constructor(supabaseInstance?: any) {
    this.supabase = supabaseInstance || createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async upload(input: UploadVideoInput): Promise<VideoUrl> {
    const { restaurantId, dishId, file, fileName, mimeType } = input;
    
    // Sanitize filename: remove special characters and spaces
    const sanitizedFileName = fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-zA-Z0-9.-]/g, "_"); // replace special chars/spaces with _

    const path = `${restaurantId}/${dishId}-${Date.now()}-${sanitizedFileName}`;
    
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimeType,
      });

    if (error) {
      throw new Error(`Falha ao fazer upload do vídeo: ${error.message}`);
    }

    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return {
      url: data.publicUrl,
      // thumbnailUrl: logic to generate thumbnail if needed
    };
  }

  async delete(url: string): Promise<void> {
    const urlParts = url.split(`${this.bucketName}/`);
    if (urlParts.length !== 2) return;
    
    const filePath = urlParts[1];
    
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      console.error(`Erro ao deletar vídeo do Supabase: ${error.message}`);
    }
  }

  async getPresignedUrl(key: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(key, 3600);

    if (error || !data) {
      throw new Error(`Falha ao gerar URL assinada: ${error?.message}`);
    }

    return data.signedUrl;
  }
}

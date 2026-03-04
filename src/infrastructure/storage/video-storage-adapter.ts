// src/infrastructure/storage/video-storage-adapter.ts
// ACL adapter for video storage — local filesystem implementation for development

import { IVideoStorage, UploadVideoInput, VideoUrl } from "@/domain/ports/video-storage.port";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";

export class LocalVideoStorageAdapter implements IVideoStorage {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = join(process.cwd(), "public", "uploads", "videos");
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }

  async upload(input: UploadVideoInput): Promise<VideoUrl> {
    await mkdir(this.uploadDir, { recursive: true });

    const ext = input.fileName.split(".").pop() || "mp4";
    const filename = `${input.restaurantId}_${input.dishId}_${Date.now()}.${ext}`;
    const filepath = join(this.uploadDir, filename);

    await writeFile(filepath, Buffer.from(input.file));

    return {
      url: `/uploads/videos/${filename}`,
      thumbnailUrl: undefined,
    };
  }

  async delete(url: string): Promise<void> {
    const filepath = join(process.cwd(), "public", url);
    try {
      await unlink(filepath);
    } catch {
      // File may not exist
    }
  }

  async getPresignedUrl(key: string): Promise<string> {
    return `${this.baseUrl}/uploads/videos/${key}`;
  }
}

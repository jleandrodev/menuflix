// src/domain/ports/video-storage.port.ts
// ACL interface for video storage

export interface UploadVideoInput {
  restaurantId: string;
  dishId: string;
  file: Buffer | Uint8Array;
  fileName: string;
  mimeType: string;
}

export interface VideoUrl {
  url: string;
  thumbnailUrl?: string;
}

export interface IVideoStorage {
  upload(input: UploadVideoInput): Promise<VideoUrl>;
  delete(url: string): Promise<void>;
  getPresignedUrl(key: string): Promise<string>;
}

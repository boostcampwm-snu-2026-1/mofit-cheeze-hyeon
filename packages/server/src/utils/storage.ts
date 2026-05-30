import sharp from "sharp";
import { supabase } from "../lib/supabase";

const BUCKET = "images";

interface UploadResult {
  thumbKey: string;
  mdKey: string;
}

export async function uploadPortfolioImage(
  file: Buffer,
  designerId: string,
  portfolioId: string,
  imageId: string
): Promise<UploadResult> {
  const [thumb, md] = await Promise.all([
    sharp(file).resize(200).webp().toBuffer(),
    sharp(file).resize(800).webp().toBuffer(),
  ]);

  const thumbKey = `portfolios/${designerId}/${portfolioId}/${imageId}_thumb.webp`;
  const mdKey = `portfolios/${designerId}/${portfolioId}/${imageId}_md.webp`;

  await Promise.all([
    supabase.storage.from(BUCKET).upload(thumbKey, thumb, { contentType: "image/webp", upsert: true }),
    supabase.storage.from(BUCKET).upload(mdKey, md, { contentType: "image/webp", upsert: true }),
  ]);

  return { thumbKey, mdKey };
}

export async function uploadAvatar(file: Buffer, userId: string): Promise<string> {
  const resized = await sharp(file).resize(400).webp().toBuffer();
  const key = `avatars/${userId}.webp`;
  await supabase.storage.from(BUCKET).upload(key, resized, { contentType: "image/webp", upsert: true });
  return key;
}

export async function uploadChatImage(file: Buffer, roomId: string, messageId: string): Promise<string> {
  const resized = await sharp(file).resize(800).webp().toBuffer();
  const key = `chats/${roomId}/${messageId}.webp`;
  await supabase.storage.from(BUCKET).upload(key, resized, { contentType: "image/webp", upsert: true });
  return key;
}

export function getStorageUrl(key: string): string {
  const base = process.env.STORAGE_BASE_URL;
  if (!base) throw new Error("STORAGE_BASE_URL must be set");
  return `${base}/${key}`;
}

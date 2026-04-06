// src/lib/imageUtils.ts
import * as ImageManipulator from 'expo-image-manipulator';
import { BoundingBox, FrameDimensions } from '../types';
import { CROP_PADDING_RATIO } from '../constants/model';

export async function cropAndPadFrame(
  frameUri: string,
  box: BoundingBox,
  dims: FrameDimensions
): Promise<string> {
  const padX = box.w * CROP_PADDING_RATIO;
  const padY = box.h * CROP_PADDING_RATIO;

  const x1 = Math.max(0, box.x - padX);
  const y1 = Math.max(0, box.y - padY);
  const x2 = Math.min(1, box.x + box.w + padX);
  const y2 = Math.min(1, box.y + box.h + padY);

  const originX = Math.round(x1 * dims.width);
  const originY = Math.round(y1 * dims.height);
  const cropWidth = Math.round((x2 - x1) * dims.width);
  const cropHeight = Math.round((y2 - y1) * dims.height);

  const result = await ImageManipulator.manipulateAsync(
    frameUri,
    [{ crop: { originX, originY, width: cropWidth, height: cropHeight } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );

  return result.uri;
}

/** Raw decoded anchor before NMS. All coordinates normalized [0, 1]. */
export interface RawDetection {
  cx: number;
  cy: number;
  w: number;
  h: number;
  confidence: number;
}

/** Post-NMS bounding box. x/y = top-left corner, all normalized [0, 1]. */
export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  confidence: number;
}

export interface DetectionResult {
  boxes: BoundingBox[];
  primary: BoundingBox | null;
  inferenceTimeMs: number;
}

export interface FrameDimensions {
  width: number;
  height: number;
}

export type WeldVerdict = 'PASS' | 'FAIL';

export interface WeldAnalysis {
  verdict: WeldVerdict;
  reason: string;
}

export type AnalysisStatus =
  | 'idle'
  | 'capturing'
  | 'cropping'
  | 'analyzing'
  | 'complete'
  | 'error';

export interface AnalysisState {
  status: AnalysisStatus;
  result: WeldAnalysis | null;
  error: string | null;
  croppedImageUri: string | null;
}

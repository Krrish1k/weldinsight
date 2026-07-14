# WeldInsight Models

This project ships a single-class **YOLOv8n** object detector trained to locate
welds in an image. The model is provided in three formats plus the calibration
data used for quantization.

## Files

| File | Location | Size | Purpose |
|------|----------|------|---------|
| `best.pt` | repo root | ~6 MB | Original PyTorch/Ultralytics weights — use for training, export, or `ultralytics` inference. |
| `best.onnx` | repo root | ~12 MB | ONNX export — used by the standalone Python script (`scripts/detect_weld.py`) via `onnxruntime`. |
| `yolov8n_weld.tflite` | `assets/models/` | ~12 MB | TensorFlow Lite build bundled into the mobile app (loaded in `src/constants/model.ts`). |
| `calibration_image_sample_data_20x128x128x3_float32.npy` | repo root | ~3.8 MB | 20 sample images used as the representative dataset for TFLite int8 quantization. |

## Model specification

| Property | Value |
|----------|-------|
| Architecture | YOLOv8n (nano) |
| Task | Object detection, **1 class**: `weld` |
| Input | `640 x 640 x 3`, RGB, normalized to `[0, 1]` (simple stretch resize, no letterbox) |
| Output | `[1, 5, 8400]` → per anchor: `cx, cy, w, h, confidence` |
| Confidence threshold | `0.45` (live) / `0.10` (static photo) |
| NMS IoU threshold | `0.45` |

These constants live in [`src/constants/model.ts`](../src/constants/model.ts).
Pre/post-processing lives in [`src/lib/jpegToFloat32.ts`](../src/lib/jpegToFloat32.ts)
and [`src/lib/yolo/`](../src/lib/yolo).

## Running inference (Python)

```bash
pip install -r scripts/requirements.txt

# Print detections
python scripts/detect_weld.py path/to/weld.jpg

# Save an annotated image
python scripts/detect_weld.py path/to/weld.jpg --out annotated.jpg
```

The script (`scripts/detect_weld.py`) reproduces the app's exact pipeline, so
its detections match what the mobile app produces.

Alternatively, with the Ultralytics package and the PyTorch weights:

```bash
pip install ultralytics
yolo predict model=best.pt source=path/to/weld.jpg
```

## Re-exporting the model

```bash
pip install ultralytics
# PyTorch -> ONNX
yolo export model=best.pt format=onnx imgsz=640
# PyTorch -> TFLite (int8, using the calibration data)
yolo export model=best.pt format=tflite int8=True imgsz=640
```

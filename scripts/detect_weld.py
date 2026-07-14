#!/usr/bin/env python3
"""
Standalone weld detection using the WeldInsight YOLOv8n model.

This mirrors the exact pre/post-processing the mobile app performs
(see src/lib/jpegToFloat32.ts, src/lib/yolo/*), so results match the app:

  - Resize (stretch, no letterbox) to 640x640, RGB, normalize to [0, 1]
  - Model output is [1, 5, 8400] -> (cx, cy, w, h, confidence), single class "weld"
  - Filter by confidence, then greedy Non-Max-Suppression by IoU

Runs against best.onnx with onnxruntime (no PyTorch required).

Usage:
    python scripts/detect_weld.py path/to/image.jpg
    python scripts/detect_weld.py image.jpg --model best.onnx --conf 0.45 --out annotated.jpg
"""

import argparse
import sys
import time
from pathlib import Path

import numpy as np

# Matches src/constants/model.ts
MODEL_INPUT_SIZE = 640
CONFIDENCE_THRESHOLD = 0.45
IOU_THRESHOLD = 0.45
NUM_ANCHORS = 8400
CLASS_NAME = "weld"


def preprocess(image_bgr, size=MODEL_INPUT_SIZE):
    """BGR (OpenCV) uint8 image -> NCHW float32 tensor normalized to [0, 1]."""
    import cv2

    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(rgb, (size, size), interpolation=cv2.INTER_LINEAR)
    tensor = resized.astype(np.float32) / 255.0          # HWC, [0, 1]
    tensor = np.transpose(tensor, (2, 0, 1))             # CHW
    tensor = np.expand_dims(tensor, axis=0)              # NCHW
    return np.ascontiguousarray(tensor)


def parse_output(output, conf_threshold):
    """
    output: model tensor of shape [1, 5, 8400] (or [5, 8400]).
    Returns list of dicts with cx, cy, w, h (in 640-space) and confidence.
    """
    out = np.squeeze(output)             # -> [5, 8400]
    if out.shape[0] != 5:
        out = out.T                      # handle [8400, 5]
    cx, cy, w, h, conf = out[0], out[1], out[2], out[3], out[4]

    keep = conf >= conf_threshold
    return [
        {"cx": float(cx[i]), "cy": float(cy[i]),
         "w": float(w[i]), "h": float(h[i]), "confidence": float(conf[i])}
        for i in np.where(keep)[0]
    ]


def iou(a, b):
    ax1, ay1 = a["cx"] - a["w"] / 2, a["cy"] - a["h"] / 2
    ax2, ay2 = a["cx"] + a["w"] / 2, a["cy"] + a["h"] / 2
    bx1, by1 = b["cx"] - b["w"] / 2, b["cy"] - b["h"] / 2
    bx2, by2 = b["cx"] + b["w"] / 2, b["cy"] + b["h"] / 2

    iw = max(0.0, min(ax2, bx2) - max(ax1, bx1))
    ih = max(0.0, min(ay2, by2) - max(ay1, by1))
    inter = iw * ih
    if inter == 0:
        return 0.0
    return inter / (a["w"] * a["h"] + b["w"] * b["h"] - inter)


def nms(detections, iou_threshold=IOU_THRESHOLD):
    """Greedy NMS, identical logic to src/lib/yolo/nms.ts."""
    kept = []
    for cand in sorted(detections, key=lambda d: d["confidence"], reverse=True):
        if not any(iou(cand, k) > iou_threshold for k in kept):
            kept.append(cand)
    return kept


def to_pixel_boxes(detections, orig_w, orig_h, size=MODEL_INPUT_SIZE):
    """Scale 640-space center boxes back to original image pixel corners."""
    sx, sy = orig_w / size, orig_h / size
    boxes = []
    for d in detections:
        cx, cy, w, h = d["cx"] * sx, d["cy"] * sy, d["w"] * sx, d["h"] * sy
        boxes.append({
            "x1": int(cx - w / 2), "y1": int(cy - h / 2),
            "x2": int(cx + w / 2), "y2": int(cy + h / 2),
            "confidence": d["confidence"],
        })
    return boxes


def main():
    ap = argparse.ArgumentParser(description="WeldInsight YOLOv8n weld detector")
    ap.add_argument("image", help="Path to an input image")
    ap.add_argument("--model", default=str(Path(__file__).resolve().parents[1] / "best.onnx"),
                    help="Path to the ONNX model (default: repo best.onnx)")
    ap.add_argument("--conf", type=float, default=CONFIDENCE_THRESHOLD, help="Confidence threshold")
    ap.add_argument("--out", default=None, help="Optional path to save an annotated image")
    args = ap.parse_args()

    try:
        import cv2
        import onnxruntime as ort
    except ImportError as e:
        sys.exit(f"Missing dependency: {e}. Run: pip install -r scripts/requirements.txt")

    image = cv2.imread(args.image)
    if image is None:
        sys.exit(f"Could not read image: {args.image}")
    orig_h, orig_w = image.shape[:2]

    session = ort.InferenceSession(args.model, providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name

    tensor = preprocess(image)
    start = time.perf_counter()
    output = session.run(None, {input_name: tensor})[0]
    elapsed_ms = (time.perf_counter() - start) * 1000

    detections = nms(parse_output(output, args.conf))
    boxes = to_pixel_boxes(detections, orig_w, orig_h)

    print(f"Model:      {args.model}")
    print(f"Image:      {args.image} ({orig_w}x{orig_h})")
    print(f"Inference:  {elapsed_ms:.1f} ms")
    print(f"Detections: {len(boxes)} '{CLASS_NAME}' (conf >= {args.conf}, IoU {IOU_THRESHOLD})")
    for i, b in enumerate(boxes, 1):
        print(f"  #{i}  conf={b['confidence']:.3f}  "
              f"box=({b['x1']},{b['y1']})-({b['x2']},{b['y2']})")

    if args.out:
        for b in boxes:
            cv2.rectangle(image, (b["x1"], b["y1"]), (b["x2"], b["y2"]), (0, 255, 0), 2)
            cv2.putText(image, f"{CLASS_NAME} {b['confidence']:.2f}",
                        (b["x1"], max(0, b["y1"] - 6)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
        cv2.imwrite(args.out, image)
        print(f"Saved annotated image -> {args.out}")


if __name__ == "__main__":
    main()

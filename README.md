# WeldInsight Pro

Real-time weld quality inspection for React Native. On-device YOLOv8 Nano detects weld beads via the camera; a tap sends the crop to Gemma 4 for a structured AWS D1.1  analysisCWI returning a PASS/FAIL report.

---

## How it works

1. Point the camera at a weld bead
2. YOLOv8 Nano runs on-device at 15 fps — a green box tracks the bead
3. Tap **Capture** to crop the detection region (with 20% padding)
4. The crop is sent to `gemma-4-31b-it` with a 6-point CWI prompt
5. A PASS/FAIL report appears covering surface condition, bead geometry, fusion quality, discontinuities, recommended actions, and AI confidence

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54, expo-router |
| Camera | react-native-vision-camera v4 |
| On-device inference | react-native-fast-tflite v2 (YOLOv8 Nano) |
| Cloud analysis | @google/generative-ai → gemma-4-31b-it |
| Animations | Reanimated v4, SharedValue bbox overlay |
| UI | NativeWind v4, react-native-svg |
| Testing | Jest (ts-jest + jest-expo split config) |

---

## Prerequisites

- Node 18+
- Xcode 15+ (iOS) or Android Studio (Android)
- EAS CLI: `npm install -g eas-cli`
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- Your YOLOv8 weld detection model in TFLite format

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API key

```bash
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
```

### 3. Add the TFLite model

Place your converted model at:

```
assets/models/yolov8n_weld.tflite
```

See [Model Conversion](#model-conversion) below if you have a `.pt` file.

### 4. Build and run

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

> Expo Go is not supported — the app uses native modules (camera + TFLite) that require a development build.

---

## Model Conversion

If you have a YOLOv8 `.pt` file, convert it to TFLite on [Google Colab](https://colab.research.google.com) (recommended for Apple Silicon):

```python
!pip install ultralytics -q
from ultralytics import YOLO
YOLO('best.pt').export(format='tflite', imgsz=640)
```

Download `best_saved_model/best_float32.tflite`, rename it to `yolov8n_weld.tflite`, and place it in `assets/models/`.

The app expects output shape `[1, 5, 8400]` (single-class YOLOv8 Nano, row-major).

---

## Testing

```bash
# All tests
npx jest --no-coverage

# Unit tests only (YOLO parsing, NMS, image utils, Gemini service)
npx jest --testPathPattern=__tests__/lib --no-coverage

# Hook tests only
npx jest --testPathPattern=__tests__/hooks --no-coverage
```

---

## Project Structure

```
app/
  _layout.tsx          # Root navigator
  index.tsx            # Dashboard screen
  camera.tsx           # Camera + detection + analysis
src/
  hooks/
    useCamera.ts       # Device + permission
    useWeldDetection.ts  # TFLite frame processor + SharedValue
    useWeldAnalysis.ts   # Gemini call state machine
    useThinkingAnimation.ts
  lib/
    yolo/              # parseOutput → NMS → DetectionResult pipeline
    gemini/            # CWI prompt, client singleton, analyzeWeld
    imageUtils.ts      # cropAndPadFrame (20% padding, clamped)
  components/
    BoundingBoxOverlay.tsx   # Animated SVG rect via useAnimatedProps
    ThinkingOverlay.tsx      # Pulsing "Thinking..." overlay
    ResultsModal.tsx         # PASS/FAIL report sheet
    CaptureButton.tsx
    StatusBadge.tsx
    AnalysisCard.tsx
  types/index.ts
  constants/
    model.ts           # Thresholds, anchor count, model path
    ui.ts              # Color tokens, animation durations
assets/
  models/
    yolov8n_weld.tflite  # Place your model here
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key |

---

## EAS Build

```bash
# Development build (internal testing)
eas build --profile development --platform android

# Production
eas build --profile production --platform all
```

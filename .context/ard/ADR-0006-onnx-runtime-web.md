# ADR-0006: Runtime Choice — ONNX Runtime Web (WebGPU, WASM Fallback)

**Status:** Accepted
**Source:** TODO.md §4, §12

## Context
A lightweight browser-compatible food model is needed (MobileNet, EfficientNet-Lite, small Food-101-derived classifier, or compact ONNX/TF.js model) without unnecessary large downloads.

## Decision
Prefer ONNX Runtime Web (WebGPU when available, WASM fallback) as primary runtime; TensorFlow.js remains an alternative registry `runtime` value if the existing project's constraints favor it.

## Consequences
Model format constraints (ONNX) and browser support variance; heuristic fallback exists until a real model file ships (see US-9 caveat).

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Image as ImageIcon, Sparkles, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useVisionPipeline } from '../../hooks/useVisionPipeline';
import type { FoodAnalysis } from '../../types/ml';
import type { MealEntry } from '../../types/meal';
import { getLocalDateString, getLocalTimeString } from '../../utils/date';
import { formatConfidence } from '../../utils/formatters';
import { defaultNutritionProvider } from '../../ml/nutrition/provider';
import { calculateCaloriesFromPortion } from '../../utils/calculations';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMeal: (meal: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  targetDate?: string;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onConfirmMeal,
  targetDate,
}) => {
  const { t, i18n } = useTranslation();
  const { status, analysis, errorMessage, analyzeImage, reset } = useVisionPipeline();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmedFoodName, setConfirmedFoodName] = useState('');
  const [confirmedPortionGrams, setConfirmedPortionGrams] = useState<number>(150);
  const [confirmedCalories, setConfirmedCalories] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Run on-device vision pipeline
    const result = await analyzeImage(file);
    if (result) {
      setConfirmedFoodName(result.foodName);
      setConfirmedPortionGrams(result.portionGrams);
      setConfirmedCalories(result.calories);
    }
  };

  const handleSelectAlternative = (alt: NonNullable<FoodAnalysis['topAlternatives']>[0]) => {
    const food = defaultNutritionProvider.getFoodById(alt.foodId);
    setConfirmedFoodName(alt.foodName);
    if (food) {
      const newCalories = calculateCaloriesFromPortion(food.caloriesPer100g, confirmedPortionGrams);
      setConfirmedCalories(newCalories);
    } else {
      setConfirmedCalories(alt.calories);
    }
  };

  const handlePortionChange = (newPortion: number) => {
    setConfirmedPortionGrams(newPortion);
    if (analysis) {
      const food = defaultNutritionProvider.getFoodById(analysis.foodId);
      const c100 = food ? food.caloriesPer100g : analysis.caloriesPer100g;
      setConfirmedCalories(calculateCaloriesFromPortion(c100, newPortion));
    }
  };

  const handleSaveToDiary = async () => {
    if (!analysis) return;

    await onConfirmMeal({
      name: confirmedFoodName || analysis.foodName,
      calories: confirmedCalories || analysis.calories,
      amount: confirmedPortionGrams,
      amountUnit: 'g',
      mealType: 'lunch',
      date: targetDate || getLocalDateString(),
      time: getLocalTimeString(),
      source: 'vision',
      visionPrediction: {
        foodId: analysis.foodId,
        foodName: confirmedFoodName || analysis.foodName,
        confidence: analysis.confidence,
        detectedPortionGrams: analysis.portionGrams,
        modelId: analysis.modelId,
        modelVersion: analysis.modelVersion,
        isMock: analysis.isMock,
        analyzedAt: new Date().toISOString(),
      },
    });

    handleClose();
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('vision.title')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hidden File Inputs for Native Camera & Gallery */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Initial Selection State */}
        {!imagePreview && status !== 'analyzing' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                border: '2px dashed var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 6 }}>{t('vision.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: 360, margin: '0 auto' }}>
                {t('vision.subtitle')}
              </p>
            </div>

            <div className="action-grid">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => cameraInputRef.current?.click()}
                aria-label={t('vision.takePhoto')}
              >
                <Camera size={18} />
                <span>{t('vision.takePhoto')}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                aria-label={t('vision.chooseGallery')}
              >
                <ImageIcon size={18} />
                <span>{t('vision.chooseGallery')}</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Loading / Analyzing State */}
        {(status === 'loading_model' || status === 'analyzing') && (
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '3px solid rgba(16, 185, 129, 0.2)',
                borderTopColor: 'var(--accent-primary)',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto',
              }}
            />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t('vision.analyzing')}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
              WebGPU / WASM On-Device
            </p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div
            style={{
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#fca5a5',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={20} />
              <span style={{ fontWeight: 600 }}>{t('vision.errors.noFoodFound')}</span>
            </div>
            <p style={{ fontSize: '0.85rem' }}>{errorMessage || t('vision.errors.genericError')}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setImagePreview(null);
                  reset();
                }}
              >
                <RotateCcw size={16} />
                {t('vision.tryAgain')}
              </button>
            </div>
          </div>
        )}

        {/* Result & Confirmation State */}
        {status === 'success' && analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Image Preview & Badges */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                maxHeight: 220,
                background: '#000',
              }}
            >
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Food to analyze"
                  style={{ width: '100%', height: 220, objectFit: 'cover' }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  display: 'flex',
                  gap: 6,
                }}
              >
                {analysis.isMock ? (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.9)',
                      color: '#000',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {t('vision.demoNotice')}
                  </span>
                ) : (
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.9)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    ONNX On-Device
                  </span>
                )}
              </div>
            </div>

            {/* Prediction Details Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {t('vision.detectedFood')}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    {confirmedFoodName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t('vision.confidence')}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                    {formatConfidence(analysis.confidence, i18n.language)}
                  </div>
                </div>
              </div>

              {/* Editable portion & calories */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                <div className="form-group">
                  <label className="form-label">{t('vision.estimatedPortion')}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={confirmedPortionGrams}
                    onChange={(e) => handlePortionChange(Number(e.target.value))}
                    min="10"
                    step="5"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('vision.estimatedCalories')}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={confirmedCalories}
                    onChange={(e) => setConfirmedCalories(Number(e.target.value))}
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: 2,
                }}
              >
                ⚠️ <strong>{t('vision.approximateNotice')}:</strong> {t('vision.approximateDisclaimer')}
              </div>

              {/* Alternatives */}
              {analysis.topAlternatives && analysis.topAlternatives.length > 0 ? (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    {t('vision.alternativesTitle')}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {analysis.topAlternatives.map((alt) => (
                      <button
                        key={alt.foodId}
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: 'auto' }}
                        onClick={() => handleSelectAlternative(alt)}
                      >
                        {alt.foodName} ({formatConfidence(alt.confidence, i18n.language)})
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setImagePreview(null);
                  reset();
                }}
              >
                <RotateCcw size={16} />
                <span>{t('vision.tryAgain')}</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={handleSaveToDiary}
              >
                <Check size={18} />
                <span>{t('vision.addToDiary')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

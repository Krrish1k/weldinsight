import { buildCwiPrompt } from '../../../src/lib/gemini/prompt';

describe('buildCwiPrompt', () => {
  const prompt = buildCwiPrompt();

  it('contains all 6 assessment axis keywords', () => {
    expect(prompt).toContain('surface_condition');
    expect(prompt).toContain('bead_geometry');
    expect(prompt).toContain('fusion_quality');
    expect(prompt).toContain('discontinuities');
    expect(prompt).toContain('verdict');
    expect(prompt).toContain('recommended_actions');
  });

  it('requests JSON output', () => {
    expect(prompt).toContain('JSON');
  });

  it('includes confidence_score', () => {
    expect(prompt).toContain('confidence_score');
  });
});

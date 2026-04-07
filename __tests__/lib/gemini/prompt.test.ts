import { buildCwiPrompt } from '../../../src/lib/gemini/prompt';

describe('buildCwiPrompt', () => {
  const prompt = buildCwiPrompt();

  it('contains PASS/FAIL verdict instruction', () => {
    expect(prompt).toContain('PASS/FAIL');
    expect(prompt).toContain('verdict');
  });

  it('asks for a technical reason', () => {
    expect(prompt).toContain('reason');
  });

  it('requests JSON output', () => {
    expect(prompt).toContain('JSON');
  });

  it('mentions common weld defects', () => {
    expect(prompt).toContain('porosity');
    expect(prompt).toContain('undercut');
    expect(prompt).toContain('cracks');
  });
});

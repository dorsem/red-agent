import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateConfig } from '../src/config.js';
import { validateProposal } from '../src/policy.js';
import { validateImported } from '../src/intake.js';
import { generate } from '../src/model.js';

const base = JSON.parse(readFileSync(new URL('../agent.config.example.json', import.meta.url), 'utf8'));

test('disclosure is optional but rejects non-string configuration', () => {
  assert.equal(base.disclosure, '');
  for (const value of [undefined, '', '   ', 'Automated contribution.']) {
    const config = structuredClone(base);
    if (value === undefined) delete config.disclosure;
    else config.disclosure = value;
    assert.doesNotThrow(() => validateConfig(config));
  }
  for (const value of [null, false, 1, {}]) assert.throws(() => validateConfig({ ...base, disclosure: value }), /disclosure/);
});

test('generated and imported text can use the full length without an empty footer', () => {
  for (const disclosure of [undefined, '', ' \n ']) {
    const config = { ...base, editorialProfile: 'none', disclosure, limits: { ...base.limits, maxBodyChars: 100 } };
    const body = 'a'.repeat(100);
    for (const kind of ['post', 'comment']) {
      assert.equal(validateProposal({ action: kind, title: 'Title', text: body }, kind, config).text, body);
      assert.throws(() => validateProposal({ action: kind, title: 'Title', text: body + 'a' }, kind, config), /length/);
    }
    assert.equal(validateImported('Title', body, config).text, body);
    assert.throws(() => validateImported('Title', body + 'a', config), /maxBodyChars/);
    assert.throws(() => validateImported('Title', '', config), /empty/);
  }
});

test('explicit footer appears once and counts toward the final length', () => {
  const config = { ...base, editorialProfile: 'none', disclosure: 'Automated.', limits: { ...base.limits, maxBodyChars: 100 } };
  const body = 'a'.repeat(84);
  const expected = body + '\n\n---\nAutomated.';
  assert.equal(validateProposal({ action: 'comment', text: body }, 'comment', config).text, expected);
  assert.equal(validateImported('Title', body, config).text, expected);
  assert.throws(() => validateProposal({ action: 'comment', text: body + 'a' }, 'comment', config), /length/);
  assert.throws(() => validateImported('Title', body + 'a', config), /maxBodyChars/);
});

test('model receives the real body budget and configured disclosure requirements', async () => {
  for (const [disclosure, budget] of [[undefined, 100], ['', 100], ['Automated.', 84]]) {
    const config = { ...base, disclosure, limits: { ...base.limits, maxBodyChars: 100 }, ollama: { ...base.ollama, model: 'fixture' } };
    await generate(config, { kind: 'comment', rules: [] }, async (_url, init) => {
      const prompt = JSON.parse(init.body).messages[0].content;
      assert.ok(prompt.includes(`Maximum body length: ${budget} characters.`));
      assert.ok(prompt.includes(`Configured disclosure: ${JSON.stringify(disclosure || '')}`));
      assert.match(prompt, /community rules require disclosure/);
      return new Response(JSON.stringify({ message: { content: '{"action":"skip"}' } }));
    });
  }
});

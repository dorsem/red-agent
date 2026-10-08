// Synthetic, offline fixtures. No account, network or language model is used.
export function demoReddit() {
  const post = { id: 'demo1', name: 't3_demo1', subreddit: 'writing_lab', author: 'fictional_reader', title: 'Who should control an AI flood-warning system?', selftext: 'If a company builds the system, should it decide which towns receive warnings?', created_utc: Date.now() / 1000 };
  return {
    clientId: 'offline-demo',
    me: async () => ({ id: 'synthetic-agent', name: 'synthetic_agent' }),
    rules: async () => ({ rules: [{ title: 'Be constructive', text: 'Discuss AI and public-interest technology; automated assistance is welcome in this synthetic example.', kind: 'all' }], description: '', publicDescription: '', submitText: '', submissionType: 'any', about: { display_name: 'writing_lab', subreddit_type: 'public' } }),
    recent: async () => [post], info: async () => post,
    context: async () => ['The communities at risk should have a say.'],
    submit: async () => { throw new Error('Offline demo cannot publish.'); }
  };
}
export const demoModel = async () => ({ action: 'comment', text: "Getting paid for building the system makes sense. Deciding which towns get a warning is a bigger claim. Can the affected towns challenge that decision?\n\nThen there's the evacuation itself. A correct forecast helps, but someone still has to arrange transport for people who can't leave on their own.", editorial: { relevant: true, strategy: 'practical_alternative', humor: 'none', sensitive: false, publicationRisk: 'low', evidenceMode: 'reflection' } });

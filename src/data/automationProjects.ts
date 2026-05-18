export type FlowNode = {
  id: string;
  label: string;
  sublabel: string;
  type: 'trigger' | 'step' | 'branch' | 'wait' | 'action';
};

export type StackItem = {
  role: string;
  name: string;
};

export type Screenshot = {
  caption: string;
  src?: string;
};

export type AutomationProject = {
  id: string;
  name: string;
  tool: 'n8n' | 'Zapier' | 'Make';
  status: 'live' | 'idle';
  client?: string;
  short: string;
  problem: string;
  solution: string;
  stack: StackItem[];
  flow: FlowNode[];
  edges: [string, string][];
  shots: Screenshot[];
};

export const AUTOMATION_PROJECTS: AutomationProject[] = [
	{
		id: 'proline-zapier',
		name: 'ProLine Zapier — Triggers & Actions',
		tool: 'Zapier',
		status: 'live',
		short:
			'Built and updated production Zapier triggers and actions for the ProLine roofing CRM — covering Project Created/Updated and Contact Created/Updated, the integration\'s two highest-volume entry points.',
		problem:
			'ProLine ships one of the most extensive Zapier integrations in the roofing CRM space — projects, contacts, events, communications, payments — and every trigger has to fire reliably the moment a record changes in production. Existing triggers needed updates to keep up with new fields and stage logic, and the team needed additional coverage so customers could automate downstream tools (HubSpot, Mailchimp, Slack, QuickBooks) without writing custom webhooks. Anything that misfires or drops events shows up in a customer\'s revenue.',
		solution:
			'Worked inside ProLine\'s Zapier app to build and update the Project Created or Updated trigger (fires on stage change or any field edit) and the Contact Created or Updated trigger (fires when contact info changes or a campaign starts/stops), plus the corresponding Create or Update Project and Create or Update Contact actions used as the most common downstream steps. Each trigger was wired to ProLine\'s API with auth via API key, polling behavior tuned for low latency, and field mapping covering project name, stage, contact details, and event metadata so customers can pipe records straight into HubSpot, QuickBooks, Mailchimp, or Slack with a single Zap step.',
		stack: [
			{ role: 'Platform', name: 'Zapier (Public app)' },
			{ role: 'Source', name: 'ProLine API' },
			{ role: 'Auth', name: 'API Key' },
			{ role: 'Trigger', name: 'Project / Contact Created or Updated' },
			{ role: 'Actions', name: 'Create or Update Project / Contact' },
			{ role: 'Searches', name: 'Find Contact / Project / Event' },
		],
		flow: [
			{ id: 'trigger', label: 'ProLine event', sublabel: 'project / contact', type: 'trigger' },
			{ id: 'api', label: 'ProLine API', sublabel: 'auth + fetch', type: 'step' },
			{ id: 'zap-trigger', label: 'Zap trigger fires', sublabel: 'Created or Updated', type: 'step' },
			{ id: 'branch', label: 'Customer Zap', sublabel: 'user-defined', type: 'branch' },
			{ id: 'hubspot', label: 'HubSpot', sublabel: 'sync contact', type: 'action' },
			{ id: 'mailchimp', label: 'Mailchimp', sublabel: 'add to list', type: 'action' },
			{ id: 'slack', label: 'Slack', sublabel: 'notify channel', type: 'action' },
			{ id: 'quickbooks', label: 'QuickBooks', sublabel: 'create invoice', type: 'action' },
		],
		edges: [
			['trigger', 'api'],
			['api', 'zap-trigger'],
			['zap-trigger', 'branch'],
			['branch', 'hubspot'],
			['branch', 'mailchimp'],
			['branch', 'slack'],
			['branch', 'quickbooks'],
		],
		shots: [],
	},
	{
		id: 'grain-automations',
		name: 'Grain Meeting Automations',
		tool: 'n8n',
		status: 'live',
		client: 'Internal',
		short:
			'Turns every Grain meeting recording into a leadership Slack digest, ClickUp tasks, and targeted DMs to the right owners — driven by an AI agent over the transcript.',
		problem:
			"The team was recording every meeting in Grain, but the recordings just sat there. Decisions slipped, action items never made it into ClickUp, and individuals weren't told that something on the call was tagged for them. Watching back a 45-minute call to find a two-line action item was the worst possible use of anyone's time.",
		solution:
			'A Grain webhook fires the moment a meeting recording is processed. n8n pulls the transcript, runs it through an AI agent with a structured output parser to extract: meeting summary, decisions, action items, and per-person pings. From there the workflow branches — the summary goes to a leadership Slack channel, action items become ClickUp tasks (with the assignee resolved against a data table), and individual mentions trigger a personal Slack DM.',
		stack: [
			{ role: 'Trigger', name: 'Grain webhook' },
			{ role: 'Workflow', name: 'n8n' },
			{ role: 'AI', name: 'GPT-4o agent + structured output' },
			{ role: 'Tasks', name: 'ClickUp' },
			{ role: 'Notify', name: 'Slack (channel + DMs)' },
			{ role: 'Storage', name: 'n8n Data Table' },
		],
		flow: [
			{
				id: 'webhook',
				label: 'Grain webhook',
				sublabel: 'meeting done',
				type: 'trigger',
			},
			{
				id: 'hook',
				label: 'Get / create hook',
				sublabel: 'Grain API',
				type: 'step',
			},
			{
				id: 'transcript',
				label: 'Get transcript',
				sublabel: 'HTTP fetch',
				type: 'step',
			},
			{
				id: 'agent',
				label: 'AI agent',
				sublabel: 'summary + actions',
				type: 'step',
			},
			{
				id: 'parse',
				label: 'Structured parse',
				sublabel: 'JSON schema',
				type: 'step',
			},
			{
				id: 'route',
				label: 'Route output',
				sublabel: 'switch',
				type: 'branch',
			},
			{
				id: 'summary',
				label: 'Leadership ping',
				sublabel: 'Slack channel',
				type: 'action',
			},
			{
				id: 'loop',
				label: 'Loop actions',
				sublabel: 'split in batches',
				type: 'step',
			},
			{
				id: 'clickup',
				label: 'Create task',
				sublabel: 'ClickUp',
				type: 'action',
			},
			{
				id: 'lookup',
				label: 'Resolve owner',
				sublabel: 'data table',
				type: 'step',
			},
			{ id: 'dm', label: 'Personal DM', sublabel: 'Slack', type: 'action' },
		],
		edges: [
			['webhook', 'hook'],
			['hook', 'transcript'],
			['transcript', 'agent'],
			['agent', 'parse'],
			['parse', 'route'],
			['route', 'summary'],
			['route', 'loop'],
			['loop', 'clickup'],
			['loop', 'lookup'],
			['lookup', 'dm'],
		],
		shots: [
			{
				caption: 'n8n canvas — meeting summary + leadership ping',
				src: '/shots/grain-automations.png',
			},
		],
	},
	{
		id: 'qa-process-automation',
		name: 'QA Process Automation',
		tool: 'n8n',
		status: 'live',
		client: 'Internal',
		short:
			'Scheduled scan of the ClickUp board that filters vague tasks, pings their owners, and uses GPT-4o to draft QA documentation for everything that passes the bar.',
		problem:
			'Every dev task needed QA documentation before it could ship, but two things kept breaking. First, tasks landed in the board with descriptions like "fix the bug" that nobody could write QA against. Second, even for well-written tasks, drafting QA docs by hand consumed PM time the team didn\'t have. The board kept piling up and the QA backlog kept growing.',
		solution:
			'A scheduled n8n run hits the ClickUp API, applies an API-error gate (alerts the PM via Slack and stops the run if the API is down), then runs every task through a description-quality filter. Vague tasks trigger a Slack DM to the owner asking them to expand the description. Tasks that pass go into an AI agent that generates a structured QA documentation packet (test cases, edge cases, regression checks). The packet gets attached to the ClickUp task and a QA review slot is booked via Google Calendar.',
		stack: [
			{ role: 'Trigger', name: 'n8n schedule (cron)' },
			{ role: 'Workflow', name: 'n8n' },
			{ role: 'Source', name: 'ClickUp API' },
			{ role: 'AI', name: 'GPT-4o agent' },
			{ role: 'Notify', name: 'Slack (DMs + channel)' },
			{ role: 'Schedule', name: 'Google Calendar' },
		],
		flow: [
			{ id: 'cron', label: 'Schedule', sublabel: 'n8n cron', type: 'trigger' },
			{
				id: 'fetch',
				label: 'Fetch tasks',
				sublabel: 'ClickUp API',
				type: 'step',
			},
			{
				id: 'gate',
				label: 'API error gate',
				sublabel: 'stop if down',
				type: 'branch',
			},
			{ id: 'alert', label: 'Notify PM', sublabel: 'Slack', type: 'action' },
			{
				id: 'filter',
				label: 'Filter vague',
				sublabel: 'description check',
				type: 'step',
			},
			{
				id: 'vague',
				label: 'Ping owner',
				sublabel: 'Slack DM',
				type: 'action',
			},
			{
				id: 'qa',
				label: 'Generate QA doc',
				sublabel: 'GPT-4o agent',
				type: 'step',
			},
			{
				id: 'attach',
				label: 'Attach to task',
				sublabel: 'ClickUp',
				type: 'action',
			},
			{
				id: 'book',
				label: 'Book QA review',
				sublabel: 'Google Calendar',
				type: 'action',
			},
		],
		edges: [
			['cron', 'fetch'],
			['fetch', 'gate'],
			['gate', 'alert'],
			['gate', 'filter'],
			['filter', 'vague'],
			['filter', 'qa'],
			['qa', 'attach'],
			['qa', 'book'],
		],
		shots: [
			{
				caption: 'n8n canvas — scheduled QA pipeline',
				src: '/shots/qa-process-automation.png',
			},
		],
	},
	{
		id: 'focus-digital-seo-generator',
		name: 'AI Content & Fact-Checking Pipeline',
		tool: 'n8n',
		status: 'live',
		client: 'Focus Digital',
		short:
			'Drop a URL into a form, get back a fact-checked, SEO-polished article in a shared Google Doc. 81 nodes — scrape, research, draft, verify every claim, three-pass refinement, then publish.',
		problem:
			"The agency was paying writers to produce SEO articles that still needed a research pass, a fact-checking pass, an SEO audit, and a copy edit before anything could go live. Every step lived in a different person's head, citations were inconsistent, and the same competitor URL would get researched from scratch every time someone touched a similar brief. The cost per article was high, the lead time was longer, and nobody trusted the output without a final human read.",
		solution:
			'A single n8n form takes a URL + email. The pipeline hashes the URL into a Postgres cache key so repeated work on the same competitor is free. Cache miss → Firecrawl scrapes the page and SerpApi pulls SERP results in parallel, then two LLM chains (with OpenAI primary + Claude fallback) extract brand voice and research findings. A copywriter chain drafts the article; a claim-extractor chain pulls every factual statement out of it; each claim is split, fanned out, verified against fresh web evidence, and tagged TRUE / FALSE / UNCLEAR. The verdicts merge back in for three refinement passes (revise → SEO audit → copy edit), schema markup is generated, and the final markdown is rendered into a Google Doc via the Docs batchUpdate API. The user gets an email with a shareable Doc link.',
		stack: [
			{ role: 'Trigger', name: 'n8n Form' },
			{ role: 'Workflow', name: 'n8n' },
			{ role: 'Scrape', name: 'Firecrawl' },
			{ role: 'Research', name: 'SerpApi' },
			{ role: 'AI', name: 'GPT-4o + Claude (fallback chains)' },
			{ role: 'State', name: 'Postgres (cache)' },
			{ role: 'Render', name: 'Google Docs API' },
			{ role: 'Storage', name: 'Google Drive' },
			{ role: 'Deliver', name: 'Gmail' },
			{ role: 'Alerts', name: 'Error Trigger flow' },
		],
		flow: [
			{
				id: 'form',
				label: 'Form intake',
				sublabel: 'URL + email',
				type: 'trigger',
			},
			{
				id: 'validate',
				label: 'Validate URL',
				sublabel: 'clean + check',
				type: 'step',
			},
			{
				id: 'hash',
				label: 'Hash + setup',
				sublabel: 'Postgres cache key',
				type: 'step',
			},
			{
				id: 'cache',
				label: 'Cache lookup',
				sublabel: 'voice + SERP',
				type: 'branch',
			},
			{
				id: 'scrape',
				label: 'Firecrawl scrape',
				sublabel: 'target page',
				type: 'step',
			},
			{
				id: 'serp',
				label: 'SerpApi search',
				sublabel: 'top organic',
				type: 'step',
			},
			{
				id: 'voice',
				label: 'Voice analyzer',
				sublabel: 'tone + audience',
				type: 'step',
			},
			{
				id: 'research',
				label: 'Research agent',
				sublabel: 'findings',
				type: 'step',
			},
			{
				id: 'draft',
				label: 'Copywriter',
				sublabel: 'first draft',
				type: 'step',
			},
			{
				id: 'claims',
				label: 'Extract claims',
				sublabel: 'split + fan-out',
				type: 'step',
			},
			{
				id: 'verify',
				label: 'Verify each claim',
				sublabel: 'TRUE/FALSE/UNCLEAR',
				type: 'step',
			},
			{ id: 'revise', label: 'Revise', sublabel: 'pass 1', type: 'step' },
			{ id: 'seo', label: 'SEO audit', sublabel: 'pass 2', type: 'step' },
			{ id: 'edit', label: 'Copy edit', sublabel: 'pass 3', type: 'step' },
			{
				id: 'doc',
				label: 'Render to Doc',
				sublabel: 'Docs batchUpdate',
				type: 'action',
			},
			{ id: 'email', label: 'Email link', sublabel: 'Gmail', type: 'action' },
		],
		edges: [
			['form', 'validate'],
			['validate', 'hash'],
			['hash', 'cache'],
			['cache', 'scrape'],
			['cache', 'serp'],
			['scrape', 'voice'],
			['serp', 'research'],
			['voice', 'draft'],
			['research', 'draft'],
			['draft', 'claims'],
			['claims', 'verify'],
			['verify', 'revise'],
			['revise', 'seo'],
			['seo', 'edit'],
			['edit', 'doc'],
			['doc', 'email'],
		],
		shots: [
			{
				caption: 'n8n canvas — 11-phase pipeline',
				src: '/shots/focus-digital-seo-generator.png',
			},
		],
	},
	{
		id: 'shingo-video-transcripts',
		name: 'Video Transcripts Production Line',
		tool: 'n8n',
		status: 'live',
		client: 'Shingo Production',
		short:
			'End-to-end pipeline that turns a raw lesson video into a transcript, AI-generated metadata, and a publish-ready HTML lesson — 67 nodes across 7 phases, triggered from a Bubble app.',
		problem:
			'Producing lesson content was the slowest step in the curriculum pipeline. Every video needed a transcript, structured metadata (subject, level, learning objectives), an HTML lesson page, and a safeguarding pass before it could be published. Doing this by hand for hundreds of videos was unsustainable — and worse, the format drifted every time a new producer touched it.',
		solution:
			'A 7-phase n8n workflow triggered by the Bubble admin app. The webhook validates the payload, looks up subject/curriculum/level in Supabase, pulls the video via signed URL, extracts audio, transcribes through Whisper, parses the SRT, generates lesson metadata + HTML through Claude, runs a safeguarding validation pass, then inserts the generated content back into Supabase, uploads the SRT, and POSTs success back to Bubble. A separate Error Trigger flow catches any failure and POSTs a structured error payload to the caller.',
		stack: [
			{ role: 'Trigger', name: 'Bubble webhook' },
			{ role: 'Workflow', name: 'n8n (self-hosted)' },
			{ role: 'Storage', name: 'Supabase' },
			{ role: 'Transcribe', name: 'OpenAI Whisper' },
			{ role: 'Render', name: 'Claude (Anthropic)' },
			{ role: 'Alerts', name: 'Error Trigger flow' },
		],
		flow: [
			{
				id: 'webhook',
				label: 'Webhook',
				sublabel: 'Bubble payload',
				type: 'trigger',
			},
			{
				id: 'validate',
				label: 'Validate payload',
				sublabel: 'P0',
				type: 'step',
			},
			{
				id: 'lookup',
				label: 'DB lookups',
				sublabel: 'P1 · Supabase',
				type: 'step',
			},
			{
				id: 'download',
				label: 'Signed URL + DL',
				sublabel: 'P2 · audio extract',
				type: 'step',
			},
			{
				id: 'whisper',
				label: 'Whisper + SRT',
				sublabel: 'P3 · transcription',
				type: 'step',
			},
			{
				id: 'claude',
				label: 'Claude metadata',
				sublabel: 'P4 · AI generation',
				type: 'step',
			},
			{
				id: 'html',
				label: 'HTML + Markdown',
				sublabel: 'P5 · composition',
				type: 'step',
			},
			{
				id: 'safe',
				label: 'Safeguarding',
				sublabel: 'P6 · validation',
				type: 'branch',
			},
			{
				id: 'insert',
				label: 'Insert content',
				sublabel: 'P7 · Supabase',
				type: 'action',
			},
			{
				id: 'upload',
				label: 'Upload SRT',
				sublabel: 'storage bucket',
				type: 'action',
			},
			{
				id: 'callback',
				label: 'Success POST',
				sublabel: 'Bubble callback',
				type: 'action',
			},
		],
		edges: [
			['webhook', 'validate'],
			['validate', 'lookup'],
			['lookup', 'download'],
			['download', 'whisper'],
			['whisper', 'claude'],
			['claude', 'html'],
			['html', 'safe'],
			['safe', 'insert'],
			['insert', 'upload'],
			['upload', 'callback'],
		],
		shots: [
			{
				caption: 'n8n canvas — all 7 phases',
				src: '/shots/shingo-video-transcripts.png',
			},
		],
	},
	{
		id: 'shingo-quiz-production',
		name: 'Quiz Production Line',
		tool: 'n8n',
		status: 'live',
		client: 'Shingo Production',
		short:
			'Generates curriculum-aligned quizzes on demand. 78 nodes, Bubble-triggered, Anthropic-powered, structured JSON in and out.',
		problem:
			"The platform needed quizzes attached to every lesson, aligned to a specific subject, curriculum, and level. Writing them by hand didn't scale, and earlier attempts with raw LLM calls produced inconsistent formats that broke the Bubble UI. The pipeline had to be deterministic enough for production: validate inputs strictly, fail loudly, and always return a shape Bubble could render.",
		solution:
			'A phased n8n workflow that accepts a quiz request from the Bubble app, validates the payload, looks up the subject in Supabase, builds a Phase-0 context object, then drives Claude through structured quiz generation. Each phase has its own error branch with a respondToWebhook that returns a typed error code — invalid payload, subject not found, generation failed — so the front-end can show a precise message instead of a generic failure.',
		stack: [
			{ role: 'Trigger', name: 'Bubble webhook' },
			{ role: 'Workflow', name: 'n8n' },
			{ role: 'Storage', name: 'Supabase' },
			{ role: 'Generation', name: 'Claude (Anthropic)' },
			{ role: 'Target', name: 'Bubble (response)' },
		],
		flow: [
			{
				id: 'webhook',
				label: 'Receive request',
				sublabel: 'Bubble webhook',
				type: 'trigger',
			},
			{
				id: 'validate',
				label: 'Validate payload',
				sublabel: 'P0',
				type: 'step',
			},
			{
				id: 'vbranch',
				label: 'Payload valid?',
				sublabel: 'fork',
				type: 'branch',
			},
			{
				id: 'verr',
				label: 'Error: payload',
				sublabel: 'respond to webhook',
				type: 'action',
			},
			{
				id: 'subj',
				label: 'Lookup subject',
				sublabel: 'Supabase',
				type: 'step',
			},
			{
				id: 'sbranch',
				label: 'Subject found?',
				sublabel: 'fork',
				type: 'branch',
			},
			{
				id: 'serr',
				label: 'Error: not found',
				sublabel: 'respond to webhook',
				type: 'action',
			},
			{
				id: 'build',
				label: 'Build context',
				sublabel: 'P0 output',
				type: 'step',
			},
			{
				id: 'claude',
				label: 'Generate quiz',
				sublabel: 'Claude',
				type: 'step',
			},
			{
				id: 'respond',
				label: 'Respond OK',
				sublabel: 'Bubble',
				type: 'action',
			},
		],
		edges: [
			['webhook', 'validate'],
			['validate', 'vbranch'],
			['vbranch', 'verr'],
			['vbranch', 'subj'],
			['subj', 'sbranch'],
			['sbranch', 'serr'],
			['sbranch', 'build'],
			['build', 'claude'],
			['claude', 'respond'],
		],
		shots: [
			{
				caption: 'n8n canvas — quiz generation pipeline',
				src: '/shots/shingo-quiz-production.png',
			},
		],
	},
	{
		id: 'massive-cms-landing',
		name: 'Programmatic SEO Page Generator',
		tool: 'n8n',
		status: 'live',
		client: 'Internal',
		short:
			'Taxonomy-driven CMS pipeline that generates Service Pillar, Capability, and Use Case landing pages at scale — batched GPT-4o with structured output, written straight back to Google Sheets as CMS-ready JSON.',
		problem:
			"Programmatic SEO needs hundreds of pages — every service crossed with every industry crossed with every capability. Writing them is the part that doesn't scale. Earlier attempts produced shallow, repetitive content with broken JSON, and the team was hand-fixing output before it could land in the CMS.",
		solution:
			'A taxonomy sheet in Google Sheets drives the whole pipeline. n8n splits rows into single-item batches, categorizes them (Layer 1 / Layer 2 / Layer 3), and switches into the right LLM chain for each layer. Layer 1 = Service Pillar Pages (~3,000 words, entity-rich, 10+ FAQs); Layer 2 = Capability Pages (~2,000–2,500 words, workflow-heavy); Layer 3 = Industry × Capability Use Case Pages (~2,000–3,500 words, before/after framing). Each chain uses an auto-fixing structured output parser so malformed JSON gets repaired in-flight. Results are written back to Sheets with a 1-second wait between batches to control rate limits.',
		stack: [
			{ role: 'Trigger', name: 'Webhook + manual' },
			{ role: 'Workflow', name: 'n8n' },
			{ role: 'Source', name: 'Google Sheets (taxonomy)' },
			{ role: 'Render', name: 'GPT-4o + chains' },
			{ role: 'Target', name: 'Google Sheets (CMS-ready)' },
			{ role: 'Notify', name: 'Slack' },
		],
		flow: [
			{
				id: 'trigger',
				label: 'Trigger',
				sublabel: 'webhook / manual',
				type: 'trigger',
			},
			{
				id: 'taxonomy',
				label: 'Get taxonomy',
				sublabel: 'Google Sheets',
				type: 'step',
			},
			{
				id: 'batch',
				label: 'Split in batches',
				sublabel: '1 item / batch',
				type: 'step',
			},
			{
				id: 'categorize',
				label: 'Categorize',
				sublabel: 'layer 1 / 2 / 3',
				type: 'branch',
			},
			{
				id: 'layer1',
				label: 'Pillar page',
				sublabel: 'GPT-4o · 3k words',
				type: 'step',
			},
			{
				id: 'layer2',
				label: 'Capability page',
				sublabel: 'GPT-4o · 2.5k',
				type: 'step',
			},
			{
				id: 'layer3',
				label: 'Use case page',
				sublabel: 'GPT-4o · 3k',
				type: 'step',
			},
			{
				id: 'autofix',
				label: 'Auto-fix JSON',
				sublabel: 'structured parser',
				type: 'step',
			},
			{
				id: 'save',
				label: 'Save to Sheets',
				sublabel: 'CMS-ready',
				type: 'action',
			},
			{ id: 'wait', label: 'Wait 1s', sublabel: 'rate limit', type: 'wait' },
			{
				id: 'notify',
				label: 'Slack digest',
				sublabel: 'batch summary',
				type: 'action',
			},
		],
		edges: [
			['trigger', 'taxonomy'],
			['taxonomy', 'batch'],
			['batch', 'categorize'],
			['categorize', 'layer1'],
			['categorize', 'layer2'],
			['categorize', 'layer3'],
			['layer1', 'autofix'],
			['layer2', 'autofix'],
			['layer3', 'autofix'],
			['autofix', 'save'],
			['save', 'wait'],
			['wait', 'notify'],
		],
		shots: [
			{
				caption: 'n8n canvas — taxonomy → 3-layer generation',
				src: '/shots/massive-cms-landing.png',
			},
		],
	},
];

export const TOOL_META: Record<string, { color: string; label: string }> = {
  n8n: { color: '#ea4b71', label: 'n8n' },
  Zapier: { color: '#ff4f00', label: 'Zapier' },
  Make: { color: '#6d3ad6', label: 'Make' },
};

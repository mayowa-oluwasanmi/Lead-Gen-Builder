import { useState } from 'react'
import { generateHtml } from '../utils/generateHtml'
import type { GeneratedTool, OrgDetails, FormatType } from '../types'

interface Props {
  tool: GeneratedTool
  orgDetails: OrgDetails
  format: FormatType
}

type CopyState = 'idle' | 'copied'

function useCopy() {
  const [state, setState] = useState<CopyState>('idle')
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setState('copied')
      setTimeout(() => setState('idle'), 2000)
    })
  }
  return { state, copy }
}

function CopyButton({ copyState, onClick }: { copyState: CopyState; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors',
        copyState === 'copied'
          ? 'bg-light-green/15 text-light-green'
          : 'bg-dark-green/8 hover:bg-dark-green/15 text-dark-green',
      ].join(' ')}
    >
      {copyState === 'copied' ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

export function ExportPanel({ tool, orgDetails, format }: Props) {
  const socialCopy = useCopy()
  const emailCopy = useCopy()
  const embedCopy = useCopy()
  const [mailchimpUrl, setMailchimpUrl] = useState('')
  const [showMailchimpHelp, setShowMailchimpHelp] = useState(false)

  const embedSnippet = `<iframe src="YOUR-FILE-URL-HERE" width="100%" height="720" frameborder="0" style="border:none;border-radius:12px;box-shadow:0 2px 20px rgba(0,0,0,0.08);overflow:hidden" scrolling="no" loading="lazy"></iframe>`

  const isMailchimp =
    mailchimpUrl.includes('list-manage.com/subscribe/post') &&
    mailchimpUrl.includes('u=') &&
    mailchimpUrl.includes('id=')
  const isFormspree = mailchimpUrl.includes('formspree.io/f/')
  const isValidMailchimpUrl = isMailchimp || isFormspree

  function downloadHtml() {
    const url = isValidMailchimpUrl ? mailchimpUrl : undefined
    const html = generateHtml(tool, orgDetails, format, url)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    const slug = tool.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    a.download = `${slug || 'lead-gen-tool'}.html`
    a.click()
    URL.revokeObjectURL(objectUrl)
  }

  const hashtagString = tool.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')
  const fullSocialPost = `${tool.socialPost}\n\n${hashtagString}`

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="font-bold text-dark-green text-lg mb-1">Export & Share</h2>
      <p className="text-dark-green/50 text-sm mb-5">
        Download your tool, connect it to your mailing list, and share it on social media.
      </p>

      <div className="grid gap-4">
        {/* Mailchimp connection */}
        <div className="rounded-xl border-2 border-light-green/30 bg-light-green/5 p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-light-green flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-dark-green text-sm">Connect to Mailchimp <span className="text-dark-green/40 font-normal">(optional)</span></p>
              <p className="text-xs text-dark-green/50 leading-relaxed mt-0.5">
                Connect a form endpoint and the downloaded HTML will send submissions directly to your inbox or mailing list — works with Gmail, Outlook, Yahoo, or Mailchimp.
              </p>
            </div>
          </div>

          <input
            type="url"
            placeholder="https://yourorg.us1.list-manage.com/subscribe/post?u=...&id=..."
            value={mailchimpUrl}
            onChange={(e) => setMailchimpUrl(e.target.value)}
            className={[
              'w-full px-3 py-2.5 rounded-lg border-2 text-xs font-mono outline-none transition-colors mb-2',
              isValidMailchimpUrl
                ? 'border-light-green bg-white text-dark-green'
                : mailchimpUrl
                ? 'border-red-300 bg-red-50 text-dark-green'
                : 'border-dark-green/10 bg-white text-dark-green',
            ].join(' ')}
          />

          {mailchimpUrl && !isValidMailchimpUrl && (
            <p className="text-xs text-red-500 mb-2">
              That doesn't look like a Mailchimp signup URL. Check the instructions below.
            </p>
          )}

          {isValidMailchimpUrl && (
            <p className="text-xs text-light-green font-semibold mb-2">
              ✓ {isFormspree ? 'Formspree' : 'Mailchimp'} connected — submissions will go straight to your {isFormspree ? 'inbox' : 'list'}
            </p>
          )}

          <button
            onClick={() => setShowMailchimpHelp((v) => !v)}
            className="text-xs text-dark-green/50 hover:text-dark-green underline underline-offset-2 transition-colors"
          >
            {showMailchimpHelp ? 'Hide instructions' : 'How do I set this up?'}
          </button>

          {showMailchimpHelp && (
            <div className="mt-3 bg-white rounded-lg p-3 border border-dark-green/8 text-xs text-dark-green/70 leading-relaxed space-y-3">
              <div>
                <p className="font-semibold text-dark-green mb-1">Using Gmail, Outlook or Yahoo? Use Formspree (free)</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <strong>formspree.io</strong> and sign up with your email address</li>
                  <li>Create a new form — name it anything</li>
                  <li>Copy your form endpoint — it looks like <code className="bg-dark-green/8 px-1 rounded">https://formspree.io/f/abc12345</code></li>
                  <li>Paste it in the field above</li>
                </ol>
                <p className="mt-1 text-dark-green/50">Submissions will arrive in your inbox. Free tier: 50/month.</p>
              </div>
              <div className="border-t border-dark-green/8 pt-3">
                <p className="font-semibold text-dark-green mb-1">Using Mailchimp?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <strong>Audience → Signup forms → Embedded forms</strong></li>
                  <li>Find the <code className="bg-dark-green/8 px-1 rounded">action="..."</code> in the form code</li>
                  <li>Copy and paste that URL above</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Download HTML */}
        <div className="rounded-xl border-2 border-dark-green/8 bg-cream/30 p-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-dark-green flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-dark-green text-sm">Download as HTML</p>
              <p className="text-xs text-dark-green/50 leading-relaxed">
                {isValidMailchimpUrl
                  ? 'Includes live Mailchimp signup — embed on any website or share as a standalone page.'
                  : 'Self-contained file — embed on any website or share as a standalone page.'}
              </p>
            </div>
          </div>
          <button
            onClick={downloadHtml}
            className="flex-shrink-0 bg-dark-green hover:bg-light-green text-cream text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Download
          </button>
        </div>

        {/* Embed snippet */}
        <div className="rounded-xl border-2 border-dark-green/8 bg-cream/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-dark-green/8 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-dark-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <p className="font-semibold text-dark-green text-sm">Embed on your website</p>
            </div>
            <CopyButton copyState={embedCopy.state} onClick={() => embedCopy.copy(embedSnippet)} />
          </div>
          <div className="bg-white rounded-lg p-3 border border-dark-green/6 font-mono text-xs text-dark-green/60 leading-relaxed break-all">
            {embedSnippet}
          </div>
          <p className="text-xs text-dark-green/40 mt-2 leading-relaxed">
            Upload your downloaded HTML file to your hosting, then replace <span className="font-semibold text-dark-green/60">YOUR-FILE-URL-HERE</span> with its URL. Paste the snippet into any website builder's "Custom HTML" block.
          </p>
        </div>

        {/* Social post */}
        <div className="rounded-xl border-2 border-dark-green/8 bg-cream/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#0A66C2] flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <p className="font-semibold text-dark-green text-sm">Social Media Post</p>
            </div>
            <CopyButton copyState={socialCopy.state} onClick={() => socialCopy.copy(fullSocialPost)} />
          </div>
          <div className="bg-white rounded-lg p-3 border border-dark-green/6">
            <p className="text-xs text-dark-green/70 leading-relaxed whitespace-pre-wrap">{tool.socialPost}</p>
            <p className="text-xs text-light-green mt-2 font-medium">{hashtagString}</p>
          </div>
        </div>

        {/* Email subject */}
        <div className="rounded-xl border-2 border-dark-green/8 bg-cream/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-cream border border-dark-green/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-dark-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-semibold text-dark-green text-sm">Email Subject Line</p>
            </div>
            <CopyButton copyState={emailCopy.state} onClick={() => emailCopy.copy(tool.emailSubject)} />
          </div>
          <div className="bg-white rounded-lg p-3 border border-dark-green/6">
            <p className="text-sm text-dark-green font-medium">{tool.emailSubject}</p>
          </div>
        </div>
      </div>

      {tool.hashtags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.hashtags.map((tag, i) => (
            <span key={i} className="text-xs font-medium text-light-green bg-light-green/10 px-2.5 py-1 rounded-full">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

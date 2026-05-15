import type { GeneratedTool, OrgDetails, FormatType } from '../types'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getMailchimpBotField(url: string): string {
  try {
    const u = new URL(url).searchParams.get('u') ?? ''
    const id = new URL(url).searchParams.get('id') ?? ''
    return `b_${u}_${id}`
  } catch {
    return 'b__'
  }
}

// Org-neutral styles — professional and clean, works on any website
const sharedStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Barlow', sans-serif; background: #f4f6f4; color: #1a2e1a; min-height: 100vh; }
  header { background: #1a2e1a; padding: 1rem 1.5rem; }
  header h1 { color: #ffffff; font-size: 1.125rem; font-weight: 700; }
  .container { max-width: 700px; margin: 2rem auto; padding: 0 1rem 2rem; }
  .card { background: #ffffff; border-radius: 14px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.07); }
  h2 { font-size: 1.75rem; font-weight: 700; color: #1a2e1a; margin-bottom: 0.625rem; line-height: 1.25; }
  .desc { color: #4a5e4a; line-height: 1.65; margin-bottom: 1.75rem; font-size: 1rem; }
  .progress-wrap { margin-bottom: 1.5rem; }
  .progress-label { font-size: 0.8125rem; color: #3a7d44; font-weight: 600; margin-bottom: 0.4rem; }
  .progress-track { background: #e8f5e9; border-radius: 99px; height: 7px; overflow: hidden; }
  .progress-fill { background: #3a7d44; height: 7px; border-radius: 99px; transition: width 0.35s ease; }
  .btn { display: inline-block; background: #3a7d44; color: #fff; border: none; padding: 0.8125rem 1.75rem; border-radius: 8px; font-family: 'Barlow', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; text-align: center; width: 100%; }
  .btn:hover { background: #2d6235; }
  .btn:disabled { background: #aaa; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: #3a7d44; border: 2px solid #3a7d44; width: auto; }
  .btn-ghost:hover { background: #e8f5e9; }
  .email-gate { padding-top: 1.75rem; margin-top: 1.75rem; border-top: 2px solid #f0f4f0; }
  .email-gate h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
  .email-gate p { color: #4a5e4a; line-height: 1.6; margin-bottom: 1.25rem; font-size: 0.9375rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.625rem; margin-bottom: 1rem; }
  .form-group input { padding: 0.75rem 1rem; border: 2px solid #dde8dd; border-radius: 8px; font-family: 'Barlow', sans-serif; font-size: 0.9375rem; color: #1a2e1a; outline: none; transition: border-color 0.2s; width: 100%; }
  .form-group input:focus { border-color: #3a7d44; }
  .thank-you { text-align: center; padding: 2.5rem 1rem; display: none; }
  .thank-you .check { font-size: 3rem; margin-bottom: 0.75rem; }
  .thank-you h3 { font-size: 1.5rem; font-weight: 700; color: #3a7d44; margin-bottom: 0.5rem; }
  .thank-you p { color: #4a5e4a; line-height: 1.6; }
  footer { text-align: center; padding: 2rem; color: #aaa; font-size: 0.8125rem; }
  footer a { color: #aaa; text-decoration: none; }
  footer a:hover { color: #3a7d44; }
  @media (max-width: 480px) { .card { padding: 1.25rem; } h2 { font-size: 1.4rem; } }
`

const googleFonts = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
`

function emailGateHtml(tool: GeneratedTool, endpointUrl?: string): string {
  const isFormspree = endpointUrl?.includes('formspree.io/f/')
  const isMailchimp = endpointUrl && !isFormspree

  if (isFormspree) {
    return `
      <div class="email-gate" id="email-gate">
        <h3>${escapeHtml(tool.emailGateTitle)}</h3>
        <p>${escapeHtml(tool.emailGateCopy)}</p>
        <div id="gate-form">
          <div class="form-group">
            <input type="text" id="inp-name" placeholder="Your name" required>
            <input type="email" id="inp-email" placeholder="Your email address" required>
          </div>
          <button id="submit-btn" class="btn" onclick="handleSubmit(event)">${escapeHtml(tool.ctaText)}</button>
        </div>
        <div class="thank-you" id="thank-you">
          <div class="check">🎉</div>
          <h3>You're on the list!</h3>
          <p>Thank you — check your inbox for what's next.</p>
        </div>
      </div>`
  }

  if (isMailchimp) {
    const botField = getMailchimpBotField(endpointUrl)
    return `
      <div class="email-gate" id="email-gate">
        <h3>${escapeHtml(tool.emailGateTitle)}</h3>
        <p>${escapeHtml(tool.emailGateCopy)}</p>
        <iframe name="mc_embed_frame" style="display:none"></iframe>
        <form id="mc-form" action="${escapeHtml(endpointUrl)}" method="POST" target="mc_embed_frame" onsubmit="handleMcSubmit(event)">
          <div class="form-group">
            <input type="text" name="FNAME" id="inp-name" placeholder="Your name" required>
            <input type="email" name="EMAIL" id="inp-email" placeholder="Your email address" required>
          </div>
          <div style="position:absolute;left:-5000px" aria-hidden="true">
            <input type="text" name="${botField}" tabindex="-1" value="">
          </div>
          <button type="submit" class="btn">${escapeHtml(tool.ctaText)}</button>
        </form>
        <div class="thank-you" id="thank-you">
          <div class="check">🎉</div>
          <h3>You're on the list!</h3>
          <p>Thank you — check your inbox for what's next.</p>
        </div>
      </div>`
  }

  return `
    <div class="email-gate" id="email-gate">
      <h3>${escapeHtml(tool.emailGateTitle)}</h3>
      <p>${escapeHtml(tool.emailGateCopy)}</p>
      <div id="gate-form">
        <div class="form-group">
          <input type="text" id="inp-name" placeholder="Your name">
          <input type="email" id="inp-email" placeholder="Your email address">
        </div>
        <button class="btn" onclick="submitGate()">${escapeHtml(tool.ctaText)}</button>
      </div>
      <div class="thank-you" id="thank-you">
        <div class="check">🎉</div>
        <h3>Thank you!</h3>
        <p>We'll be in touch with your next steps very soon.</p>
      </div>
    </div>`
}

function emailGateScript(endpointUrl?: string): string {
  if (!endpointUrl) {
    return `
    function submitGate() {
      var name = document.getElementById('inp-name').value.trim();
      var email = document.getElementById('inp-email').value.trim();
      if (!name || !email) { alert('Please fill in your name and email.'); return; }
      document.getElementById('gate-form').style.display = 'none';
      document.getElementById('thank-you').style.display = 'block';
    }`
  }

  const isFormspree = endpointUrl.includes('formspree.io/f/')

  if (isFormspree) {
    // Formspree supports clean AJAX submission — no page redirect
    return `
    function handleSubmit(e) {
      e.preventDefault();
      var name = document.getElementById('inp-name').value.trim();
      var email = document.getElementById('inp-email').value.trim();
      if (!name || !email) { alert('Please fill in your name and email.'); return; }
      var btn = document.getElementById('submit-btn');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      fetch('${endpointUrl}', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.ok) {
          document.getElementById('gate-form').style.display = 'none';
          document.getElementById('thank-you').style.display = 'block';
        } else {
          btn.disabled = false;
          btn.textContent = 'Try Again';
          alert('Something went wrong — please try again.');
        }
      })
      .catch(function() {
        btn.disabled = false;
        btn.textContent = 'Try Again';
        alert('Could not connect — please check your internet connection.');
      });
    }`
  }

  // Mailchimp — use hidden iframe to avoid page redirect
  return `
    function handleMcSubmit(e) {
      var name = document.getElementById('inp-name').value.trim();
      var email = document.getElementById('inp-email').value.trim();
      if (!name || !email) { e.preventDefault(); alert('Please fill in your name and email.'); return; }
      setTimeout(function() {
        document.getElementById('mc-form').style.display = 'none';
        document.getElementById('thank-you').style.display = 'block';
      }, 800);
    }`
}

const avocadoFooter = `<footer><a href="https://theavocadohub.co.uk" target="_blank">Built with The AVOCADO HUB</a></footer>`

export function generateChecklistHtml(
  tool: GeneratedTool,
  orgDetails: OrgDetails,
  mailchimpUrl?: string
): string {
  const items = tool.items ?? []
  const total = items.length

  const itemsHtml = items
    .map(
      (item, i) => `
      <div class="item" id="item-wrap-${i}">
        <label class="item-label">
          <input type="checkbox" id="cb-${i}" onchange="onCheck(${i})">
          <span class="item-box" id="box-${i}"></span>
          <span class="item-content">
            <span class="item-title">${escapeHtml(item.title)}</span>
            <span class="item-detail">${escapeHtml(item.detail)}</span>
          </span>
        </label>
      </div>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(tool.title)}</title>
  ${googleFonts}
  <style>
    ${sharedStyles}
    .item { padding: 0.625rem 0.5rem; border-radius: 8px; transition: background 0.15s; }
    .item:hover { background: #f4f6f4; }
    .item-label { display: flex; align-items: flex-start; gap: 0.875rem; cursor: pointer; }
    .item-label input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; }
    .item-box { width: 22px; height: 22px; min-width: 22px; border: 2px solid #ccc; border-radius: 5px; display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all 0.2s; font-size: 13px; font-weight: 700; color: white; }
    .item-box.checked { border-color: #3a7d44; background: #3a7d44; }
    .item-box.checked::after { content: '✓'; }
    .item-content { display: flex; flex-direction: column; gap: 0.2rem; }
    .item-title { font-weight: 600; font-size: 0.9375rem; line-height: 1.4; transition: all 0.2s; }
    .item-title.done { text-decoration: line-through; color: #aaa; }
    .item-detail { font-size: 0.8125rem; color: #6a7e6a; line-height: 1.5; }
    .items-list { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.5rem; }
    .gate-hidden { display: none; }
  </style>
</head>
<body>
  <header><h1>${escapeHtml(orgDetails.orgName)}</h1></header>
  <div class="container">
    <div class="card">
      <h2>${escapeHtml(tool.title)}</h2>
      <p class="desc">${escapeHtml(tool.description)}</p>
      <div class="progress-wrap">
        <div class="progress-label" id="prog-label">0 of ${total} completed</div>
        <div class="progress-track"><div class="progress-fill" id="prog-fill" style="width:0%"></div></div>
      </div>
      <div class="items-list">${itemsHtml}</div>
      <div class="gate-hidden" id="email-gate-wrap">
        ${emailGateHtml(tool, mailchimpUrl)}
      </div>
    </div>
  </div>
  ${avocadoFooter}
  <script>
    var total = ${total};
    var checkedCount = 0;
    ${emailGateScript(mailchimpUrl)}
    function onCheck(idx) {
      var cb = document.getElementById('cb-' + idx);
      var box = document.getElementById('box-' + idx);
      var title = document.querySelector('#item-wrap-' + idx + ' .item-title');
      if (cb.checked) {
        checkedCount++;
        box.className = 'item-box checked';
        if (title) title.className = 'item-title done';
      } else {
        checkedCount = Math.max(0, checkedCount - 1);
        box.className = 'item-box';
        if (title) title.className = 'item-title';
      }
      var pct = Math.round((checkedCount / total) * 100);
      document.getElementById('prog-fill').style.width = pct + '%';
      document.getElementById('prog-label').textContent = checkedCount + ' of ' + total + ' completed';
      if (checkedCount >= Math.ceil(total * 0.7)) {
        document.getElementById('email-gate-wrap').classList.remove('gate-hidden');
        document.getElementById('email-gate-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  </script>
</body>
</html>`
}

export function generateQuizHtml(
  tool: GeneratedTool,
  orgDetails: OrgDetails,
  format: FormatType,
  mailchimpUrl?: string
): string {
  const questions = tool.questions ?? []
  const formatLabel =
    format === 'audit' ? 'Audit' : format === 'self-assessment' ? 'Assessment' : 'Quiz'

  const questionsJson = JSON.stringify(
    questions.map((q) => ({ q: q.question, o: q.options }))
  ).replace(/<\/script>/gi, '<\\/script>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(tool.title)}</title>
  ${googleFonts}
  <style>
    ${sharedStyles}
    .intro .badge { display: inline-block; background: #e8f5e9; color: #3a7d44; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; }
    .quiz-body { display: none; }
    .question-text { font-size: 1.2rem; font-weight: 700; line-height: 1.4; margin-bottom: 1.25rem; color: #1a2e1a; }
    .options { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.75rem; }
    .opt { padding: 0.875rem 1rem; border: 2px solid #dde8dd; border-radius: 9px; cursor: pointer; font-size: 0.9375rem; line-height: 1.4; transition: all 0.18s; font-family: 'Barlow', sans-serif; background: #fff; color: #1a2e1a; text-align: left; width: 100%; }
    .opt:hover { border-color: #3a7d44; background: #f0f9f0; }
    .opt.selected { border-color: #3a7d44; background: #e8f5e9; font-weight: 600; }
    .nav { display: flex; justify-content: space-between; align-items: center; }
    .gate-wrap { display: none; }
  </style>
</head>
<body>
  <header><h1>${escapeHtml(orgDetails.orgName)}</h1></header>
  <div class="container">
    <div class="card">
      <div id="intro">
        <span class="badge">${formatLabel} &middot; ${questions.length} questions</span>
        <h2>${escapeHtml(tool.title)}</h2>
        <p class="desc">${escapeHtml(tool.description)}</p>
        <button class="btn" onclick="startQuiz()" style="width:auto;padding:0.8125rem 2rem">Start Now &rarr;</button>
      </div>
      <div class="quiz-body" id="quiz-body">
        <div class="progress-wrap">
          <div class="progress-label" id="prog-label">Question 1 of ${questions.length}</div>
          <div class="progress-track"><div class="progress-fill" id="prog-fill" style="width:0%"></div></div>
        </div>
        <div id="q-container"></div>
      </div>
      <div class="gate-wrap" id="gate-wrap">
        ${emailGateHtml(tool, mailchimpUrl)}
      </div>
    </div>
  </div>
  ${avocadoFooter}
  <script>
    var qs = ${questionsJson};
    var cur = 0;
    var answers = {};
    ${emailGateScript(mailchimpUrl)}
    function startQuiz() {
      document.getElementById('intro').style.display = 'none';
      document.getElementById('quiz-body').style.display = 'block';
      renderQ(0);
    }
    function renderQ(idx) {
      cur = idx;
      var q = qs[idx];
      var total = qs.length;
      document.getElementById('prog-label').textContent = 'Question ' + (idx + 1) + ' of ' + total;
      document.getElementById('prog-fill').style.width = Math.round(((idx + 1) / total) * 100) + '%';
      var html = '<p class="question-text">' + escHtml(q.q) + '</p><div class="options">';
      q.o.forEach(function(opt, i) {
        var sel = answers[idx] === i ? ' selected' : '';
        html += '<button class="opt' + sel + '" onclick="pick(' + idx + ',' + i + ')">' + escHtml(opt) + '</button>';
      });
      html += '</div><div class="nav">';
      if (idx > 0) html += '<button class="btn btn-ghost" onclick="go(' + (idx - 1) + ')">&#8592; Back</button>';
      else html += '<span></span>';
      var isLast = idx === total - 1;
      var dis = answers[idx] === undefined ? ' disabled' : '';
      html += '<button class="btn" style="width:auto;padding:0.8125rem 1.75rem"' + dis + ' onclick="' + (isLast ? 'showGate()' : 'go(' + (idx + 1) + ')') + '">' + (isLast ? 'Get Results &rarr;' : 'Next &rarr;') + '</button>';
      html += '</div>';
      document.getElementById('q-container').innerHTML = html;
    }
    function pick(qIdx, optIdx) { answers[qIdx] = optIdx; renderQ(qIdx); }
    function go(idx) { if (idx >= 0 && idx < qs.length) renderQ(idx); }
    function showGate() {
      document.getElementById('quiz-body').style.display = 'none';
      document.getElementById('gate-wrap').style.display = 'block';
    }
    function escHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
  </script>
</body>
</html>`
}

export function generateHtml(
  tool: GeneratedTool,
  orgDetails: OrgDetails,
  format: FormatType,
  mailchimpUrl?: string
): string {
  if (format === 'checklist') {
    return generateChecklistHtml(tool, orgDetails, mailchimpUrl)
  }
  return generateQuizHtml(tool, orgDetails, format, mailchimpUrl)
}

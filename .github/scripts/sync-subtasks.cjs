// PR이 가리키는 이슈의 "## 하위 작업" 칸에 PR을 자동으로 넣고, 머지되면 체크한다.
// 연결 기준: PR 본문의 #번호 (HTML 주석 안은 무시), PR 제목의 [OLP-번호]
const HEAD = '## 하위 작업';

function referencedIssues(pr) {
  const nums = new Set();
  const body = (pr.body || '').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of body.matchAll(/(?:^|[^\w&/])#(\d+)\b/g)) nums.add(Number(m[1]));
  const t = (pr.title || '').match(/\[OLP-(\d+)\]/i);
  if (t) nums.add(Number(t[1]));
  nums.delete(pr.number);
  return [...nums];
}

function updateBody(body, prNumber, merged) {
  body = body || '';
  const line = `- [${merged ? 'x' : ' '}] #${prNumber}`;
  const idx = body.indexOf(HEAD);
  let before, section, after;
  if (idx === -1) {
    before = body.replace(/\s*$/, '') + '\n\n<br>\n\n';
    section = HEAD + '\n';
    after = '';
  } else {
    before = body.slice(0, idx);
    const rest = body.slice(idx);
    const next = rest.slice(HEAD.length).search(/\n## /);
    section = next === -1 ? rest : rest.slice(0, HEAD.length + next);
    after = next === -1 ? '' : rest.slice(HEAD.length + next);
  }
  // 템플릿의 빈 칸 "- [ ] #" 제거
  let lines = section.replace(/\r/g, '').split('\n').filter(l => l.trim() !== '- [ ] #');
  const re = new RegExp(`^- \\[[ xX]\\] #${prNumber}(?!\\d)`);
  const i = lines.findIndex(l => re.test(l.trim()));
  if (i >= 0) {
    lines[i] = lines[i].replace(/\[[ xX]\]/, `[${merged ? 'x' : ' '}]`);
  } else {
    let end = lines.length;
    while (end > 0 && lines[end - 1].trim() === '') end--;
    lines.splice(end, 0, line);
  }
  const newSection = lines.join('\n').replace(/\s*$/, '\n');
  return before + newSection + (after ? '\n' + after.replace(/^\n+/, '') : '');
}

async function run({ github, context, core }) {
  const pr = context.payload.pull_request;
  const { owner, repo } = context.repo;
  const merged = pr.merged === true;
  for (const n of referencedIssues(pr)) {
    let issue;
    try {
      issue = (await github.rest.issues.get({ owner, repo, issue_number: n })).data;
    } catch (e) {
      core.info(`#${n}: 찾을 수 없음, 건너뜀`);
      continue;
    }
    if (issue.pull_request) { core.info(`#${n}: PR이라 건너뜀`); continue; }
    const newBody = updateBody(issue.body, pr.number, merged);
    if (newBody !== (issue.body || '')) {
      await github.rest.issues.update({ owner, repo, issue_number: n, body: newBody });
      core.info(`#${n}: 하위 작업에 #${pr.number} 반영 (merged=${merged})`);
    } else {
      core.info(`#${n}: 변경 없음`);
    }
  }
}

module.exports = run;
module.exports.updateBody = updateBody;
module.exports.referencedIssues = referencedIssues;

# Café Chico · Cloudflare-only 部署 + Domain 採購

> 2026-08-22 編製 by Café Chico 網絡連接監察
> 決策：Studio Nestir Ltd 長期投入 Cloudflare ecosystem，所有 hosting / domain / email / 防 spam 統一喺 Cloudflare
> 對齊 SN 系列技術偏好（account 偏好見 user memory: SN 系列雙平台原生 + Cloudflare 偏好）

---

## 0. 個站現況

- **6 個 HTML pages**：`index.html`, `menu.html`, `platters.html`, `party-room.html`, `ice-cream-bike.html`, `catering.html`
- **純 static**：HTML + CSS + JS + photos，冇 build step, 冇 Node, 冇 server runtime
- 已有 `.git/`，commit history 已迭代到 Phase 4（`menu: replace with full Deliveroo menu — 76 items, 6 categories`）
- `_dist/` 係舊 build artifact，已 ignore；production 喺 root
- Logo / 圖片 / data 全部 settle 喺 `assets/`

**結論：純 static 站，Cloudflare Pages 一行搞掂，冇需要 server。**

---

## 1. 點解整個 stack 都放 Cloudflare

| 好處 | 解釋 |
|---|---|
| 單一 dashboard | Domain / DNS / Hosting / Email / Analytics / DDoS 同一個 panel |
| 單一帳號 | CCConan 一個 login 管理 Café Chico + SN 系列 + BodyGravity 全部 sub-domain |
| 統一 billing | 一張卡，年費一目了然 |
| API 一致 | 之後寫 deployment automation（GitHub Actions → Cloudflare API）唔使學新 stack |
| 零 vendor lock-in cost | Pages 同 Registrar 都係 at-cost / no markup，搬走都唔蝕 |
| Long-term stable | Cloudflare 唔似新 startup 突然收皮，UK 又有 edge node（Manchester / London） |

Studio Nestir 已經有 Cloudflare 帳號（用緊 Workers / Turnstile 之類），Café Chico 直接掛入去，唔使新開 vendor。

---

## 2. Hosting — Cloudflare Pages

**揀 Pages 唔揀 Netlify / Vercel / GitHub Pages**：
- 唯一免費 plan 冇流量 cap（Netlify / Vercel / GH Pages 都 cap 100GB/mo）
- 300+ city CDN，Bolton / Manchester / London edge 都覆蓋
- Free SSL、free DDoS、free Web Analytics
- 500 build / month（呢個站 push 一次 build 唔過 1 分鐘，500 = 一年 push 500 次）
- 100 個自訂網域 quota（夠 Café Chico + 之後 sub-domain 例如 `menu.cafechico.co.uk`）
- Pages Functions（Workers 入口）100k requests/day free，之後要加 form backend 唔使再砌

**Deploy 流程**：
1. Push repo 上去 GitHub（如果未 push）
2. Cloudflare → Workers & Pages → Create → Connect to Git
3. 揀 `Cafe Chico website` repo，framework preset = **None**（static）
4. Build command：**留空**
5. Build output directory：**留空**（`.html` 喺 root）
6. Save and deploy → 即時拎到 `cafe-chico.pages.dev` preview URL
7. 跟住 §3 加 custom domain

---

## 3. Domain — Cloudflare Registrar

### 3.1 揀邊個 TLD

| TLD | 適合度 | Cloudflare 首年 + 續費 | 備註 |
|---|---|---|---|
| **.co.uk** | ⭐⭐⭐⭐⭐ | **~£3.66 / yr** | **Primary** — 81% UK market，UK 客戶一眼認到 |
| .uk | ⭐⭐⭐ | ~£3.66 / yr | Short variant，13% market；.co.uk 認受性高啲 |
| .com | ⭐⭐⭐ | ~£7.30 / yr | **Defensive** — 防止 squatter，國際 query 嘅人用 |

**Café Chico 推薦**：
- Primary：`cafechico.co.uk`（**無 accent** — IDN domain 易撞 font / email / SEO 問題）
- Defensive：`cafechico.com`（如果未俾人搶咗，£7.30/yr 拎住）

`caféchico.co.uk` 唔建議 — IDN 喺 URL bar 顯示成 `xn--cafchico-xxa.co.uk`，分享/輸入框/SEO sitemap 都會撞 bug。

### 3.2 點解 Cloudflare Registrar 唔揀其他人

| 註冊商 | .co.uk 3 年總成本 | 備註 |
|---|---|---|
| **Cloudflare Registrar** | **~£11** | at-cost，冇 upsell，強制用 Cloudflare DNS |
| Porkbun | ~£11.84 | 第二平，但分開兩個 dashboard |
| Namecheap | £20.30 | 平，但分開 dashboard |
| GoDaddy | £25.99 | **避** — 首年 £0.01 係 trap，upsell 多 |
| Names.co.uk | £55.18 | **避** — 最貴，鎖你 |

> **對齊你哋 long-term 策略：domain 同 hosting 同一個 Cloudflare 帳號，零額外 DNS 設定，auto SSL 1-click。**

---

## 4. 自訂網域 + Pages 連接

1. Cloudflare Dashboard → Pages → 你個 project → **Custom domains** → Set up a custom domain
2. 輸入 `cafechico.co.uk`
3. 因為 domain 已經喺 Cloudflare，**auto 加 CNAME + 設 SSL**，1-click 唔使手動改 nameserver
4. 幾分鐘後 `cafechico.co.uk` 就 live，SSL 即時生效
5. 重複步驟加 `cafechico.com`（指去同一個 site，防 squatter）

---

## 5. 完整 stack（全部 Cloudflare，0 月費）

| 項目 | 服務 | 月費 |
|---|---|---|
| Static hosting | Cloudflare Pages | £0 |
| Domain `.co.uk` | Cloudflare Registrar | ~£3.66 / yr |
| Domain `.com` (defensive) | Cloudflare Registrar | ~£7.30 / yr |
| DNS | Cloudflare DNS | £0 |
| SSL | Cloudflare Universal SSL | £0 |
| DDoS | Cloudflare 內建 | £0 |
| Web Analytics | Cloudflare Web Analytics (無 cookie) | £0 |
| Email `hello@cafechico.co.uk` | Cloudflare Email Routing → Aaliyah 個人 Gmail | £0 |
| Form anti-spam | Cloudflare Turnstile | £0 |
| Contact / booking form | Cloudflare Pages Functions + Email Workers 或 Formspree | £0 (低用量) |
| **Total 年費** | | **~£11 / yr** |

---

## 6. 之後可能要升級嘅 paid tier

| 觸發條件 | 升級到 | 月費 |
|---|---|---|
| 想用 `hello@cafechico.co.uk` 而唔係 forward | Google Workspace / M365 | £5 / user / mo |
| Form submissions > 50 / 月 | Formspree paid / Workers + D1 | £8+ / mo |
| 想加 A/B testing / funnel | Cloudflare Workers Paid | £5 / mo 起 |
| 多個 SN app 共享 edge config | Cloudflare for Teams (Zero Trust) | Free tier 夠 MVP |

> 大部分小 café 頭 2 年都唔會觸發以上 paid tier。

---

## 7. 執行 sequence

1. 確認 domain spelling：accent 定唔 accent（**預設用 `cafechico`**，要你 sign off）
2. 確認係咪即刻 deploy，定等 Aaliyah sign off content 先 deploy
3. Push repo 上去 GitHub
4. 開 Cloudflare Pages project，connect GitHub repo，deploy
5. 喺 Cloudflare Registrar 買 `cafechico.co.uk`（+ `.com` 防守）
6. Pages → Custom domains → 加 `cafechico.co.uk` + `cafechico.com`
7. （Optional）Email Routing：`hello@` / `bookings@` forward 去 Aaliyah Gmail
8. （Optional）喺 contact section 加 Turnstile + form
9. 通知 Aaliyah 試用 + 收 feedback

---

## 8. Pending decisions（要 CCConan sign off）

- [ ] Domain 拼法：`cafechico`（推薦）vs `caféchico`（IDN 唔建議）
- [ ] 買唔買 `.com` 防守 domain
- [ ] 即刻 deploy 定等 Aaliyah sign off content 先
- [ ] 需唔需要 contact / booking form（影響 §5 嘅 form 選擇）
- [ ] 需唔需要 `hello@cafechico.co.uk` 商業 email

# photo from Faruk

老闆 (Faruk) 直接 send 過嚟嘅 raw deliveries，66 個 files（65 JPGs + 1 MP4）。
**未分類前係一 pat 全 hash 命名嘅 file — 好難搵返想要嘅 shot。**

呢個 directory 已經喺 2026-08-19 重新分類成 9 個 subfolders，方便日後搵 shot。

## 點解要分類

之前 66 個 files 全部以 UUID 命名，搵特定 shot 要逐個 open。先按主題分類先可以：

- 揀 shot 嗰陣可以一個 folder 內揀晒
- 唔會再重用錯 shot（例如之前誤將 `DLE-wuTIdBf_1.jpg` 當 trike）
- 重複 shot（2 個 filename 加 " 2" 但 byte-identical）已經 trashed
- 新 design 階段可以快速 scan 一個 category 嘅所有 options

## Subfolder 結構

| # | Folder | 內容 | Files |
|---|---|---|---|
| 00 | `00_renovation_in_progress/` | Pre-launch：未裝修好、bare brick、未裝 furniture | 21 |
| 01 | `01_interior_finished/` | 完工嘅 café 室內：counter、bar、party room、dining area | 22 |
| 02 | `02_exterior/` | 舖面外觀、signage、storefront 街景 | 3 |
| 03 | `03_food_and_drinks/` | 食物、platter、brownies、burger、bagel 等菜式 | 7 |
| 04 | `04_ice_cream_bike/` | Ice-cream trike + ice cream menu board | 2 |
| 05 | `05_press_and_media/` | Bolton News 報道、display board 上嘅 press 剪報 | 3 |
| 06 | `06_community_and_events/` | Community / events / charity 相關 | 1 |
| 07 | `07_owners_and_customers/` | 員工同客人（老闆 Aaliyah、熟客 selfie、staff 制服） | 3 |
| 08 | `08_misc_uncategorized/` | 唔知點分類嘅（logo mockup、MP4 video、text review 截圖） | 3 |

Total: **65 JPGs + 1 MP4 = 66 files**

## 各 folder 內容簡述

### `00_renovation_in_progress/`
裝修前/中嘅 raw shots，bare brick、construction debris、未裝 lights/furniture。多數係 2024 年 café 未開張之前影嘅。
*Examples:* `04566da6` empty room, `26f4847c` green tables being installed, `bcebb061` bar counter being framed

### `01_interior_finished/`
Café 室內完成後嘅 shots：counter 角度、party room、dining area、菜牌 letterboard、evening mood。
*Examples:* `0c2c38e7` counter, `50d5a0bd` evening interior, `b60cc54f` party room with LED strips, `dd1e4a91` letterboard menu

### `02_exterior/`
舖面外觀：`5937f4f6` 馬車經過 (signature shot), `ba78b9ff` 雨天 moody, `ea85e15c` Ramadan Iftar + kids drawings

### `03_food_and_drinks/`
真實菜式 shots：`0cd16726` 兩個 burger plates, `341f21d9` wraps platter, `ba76605f` 完整 catering platter, `d9d8c1cb` bagel + parfait combo, `ea8ebc8b` 玻璃碟 brownies
*Notes:* 全部係真實食物，唔係 AI-generated

### `04_ice_cream_bike/`
`c89ff63e` 室內 trike + 員工豎拇指, `9ecbbcfd` 價錢 menu (Wafer £2.50, Waffle £3.50/£4.50, Tub £2.50/£3.50)
*Notes:* 只有 2 張真實 trike shot。AI-generated 嘅 trike shots 喺 `assets/site-images/_pending/`

### `05_press_and_media/`
3 個 press 來源：`3a4ab075` Bolton News 手機截圖 (Aaliyah + dad 2 人), `3a999d74` Bolton News 手機截圖 (6 人 group photo), `4f8093e1` Display board 上嘅 Bolton News clipping + Bolton at Home certificate + Palestine Emergency Appeal

### `06_community_and_events/`
`3c7a45aa` "View our menu by scanning the QR code" — community engagement / accessibility
*Notes:* 只有 1 張。如果將來有更多 community shots 可以擴展

### `07_owners_and_customers/`
人像類：`59f0d436` 3 個朋友食 French toast selfie, `7e3fda77` 7 個客人喺 café, `ed1b4d10` 2 個著 Café Chico hoodie 嘅員工

### `08_misc_uncategorized/`
3 個唔知點放：
- `450180cc` — Logo mockup (Bolton Angling 街景 + Café Chico logo overlay)，似係 design studio 模擬用
- `6a9e469d` — MP4 video clip，內容未知（可能要睇下）
- `79d0ebbd` — Text review 截圖 (Robertson North West Senior PM)，已經修飾嵌入 `index.html` 嘅 `#neighbours` section，呢度 source 留個底

## Naming convention 保留

呢度**冇 rename**任何 file — UUID 係 Faruk 原本 send 嚟嘅 identifier，rename 會斷 traceability。
如果想 human-readable 名，可以喺 INDEX.md / 各 folder 內 add alias table，但 source files 保持 UUID 不變。

## Source archive 規則

呢個 directory 同 `../`（即係 `assets/photos/`）都係 **read-only source archive**。

- ✋ **唔好直接 edit** 呢度嘅 file
- ✓ 如果要修改（例如 upscale、AI enhance、crop），先 copy 去 `../../../site-images/` 嘅對應 bucket 做新版本
- ✓ INDEX 喺 `../../../site-images/INDEX.json` — 記低 source path 同 modifications

## Re-classification 流程

如果之後有新 shot 送嚟：
1. 放入 root level
2. 參考 `_classify.py` 嘅 `CLASSIFY` dict style，加 description + category
3. 跑 `python3 _classify.py`
4. 喺本 README 更新 count

`_classify.py` 係 one-time script，留喺度做 reference。如果改 schema / category 名，記住同步更新。

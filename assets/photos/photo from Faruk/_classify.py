#!/usr/bin/env python3
"""Classify the 65 JPGs + 1 MP4 in photo from Faruk/ into 9 subfolders.

Categories (in display order):
  00_renovation_in_progress   — pre-launch, no furniture, exposed brick
  01_interior_finished        — completed café interior
  02_exterior                 — storefront, signage
  03_food_and_drinks          — dishes, platters, drinks
  04_ice_cream_bike           — trike + ice-cream related
  05_press_and_media          — newspaper articles, press clippings
  06_community_and_events     — events, kids, charity
  07_owners_and_customers     — people (owners, staff, customers)
  08_misc_uncategorized       — anything that doesn't fit

Each entry maps filename -> (category, brief description).
"""
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

# filename -> (category, description)
CLASSIFY = {
    # 00_renovation_in_progress
    "04566da6-4c1f-41c7-a7b2-1ec5e169b89f.JPG": ("00_renovation_in_progress", "Renovation — empty room, broom on floor, no furniture"),
    "09c7c7e8-a3b3-424e-90fe-34e675186bee.JPG": ("00_renovation_in_progress", "Renovation — window frame with reverse 'BREAKFAST' stickers"),
    "1b11f52c-e18e-4ff7-b8d2-a86061ac8a34.JPG": ("00_renovation_in_progress", "Renovation — wood filler on raw cabinets below plywood wall"),
    "26f4847c-6372-4c46-bf9f-784bdaf728e4.JPG": ("00_renovation_in_progress", "Renovation — green tables being installed, man on knees with drill"),
    "27b91590-c51b-494f-8849-36a17be23323.JPG": ("00_renovation_in_progress", "Renovation — pendant lights hung over green tables, wood bench seating"),
    "44e9ea0c-e3ef-443a-be6d-a5de8ae01f5e.JPG": ("00_renovation_in_progress", "Renovation — back-corridor shot through doorway, brick wall"),
    "4ce57a67-0bb5-4ac2-a074-f16b5759038b.JPG": ("00_renovation_in_progress", "Renovation — demolition in progress, exposed brick + wiring"),
    "50508f10-8c03-4ed6-96e8-c60146f733b8.JPG": ("00_renovation_in_progress", "Renovation — kitchen shell, plywood ceiling, bare walls"),
    "65fa6f1f-10a1-40e5-9bf9-6f1bfd8f34df.JPG": ("00_renovation_in_progress", "Renovation — bare back-counter, person in green hoodie visible"),
    "67c69cae-112e-49dc-80ba-6e125e4ec593.JPG": ("00_renovation_in_progress", "Renovation — live-edge wood counter installed, pendant lights working"),
    "6868f203-0df6-48dc-a29d-b9d42c5b7ea5.JPG": ("00_renovation_in_progress", "Renovation — back-corridor, exposed brick + concrete sub-floor"),
    "6b394176-f9eb-44de-bdbc-d5318efe2c39.JPG": ("00_renovation_in_progress", "Renovation — back-corridor, single pendant light, no furniture"),
    "6f6fa092-6b98-43a4-af70-8bae6054caec.JPG": ("00_renovation_in_progress", "Renovation — brick room, broom on floor, bare walls"),
    "838f7fe2-ee04-4668-8e79-ece4e274b232.JPG": ("00_renovation_in_progress", "Renovation — three-tier shelf being built, drill + triangle square on top"),
    "8ff1b9a7-f968-4b39-bbc3-ca650bf8653d.JPG": ("00_renovation_in_progress", "Renovation — completed floor + pendant lights, log pile (transition shot)"),
    "99930b35-3d59-46bc-a7c7-4a0476a51c56.JPG": ("00_renovation_in_progress", "Renovation — table with fairy lights embedded in glass top, log coasters"),
    "bcebb061-677d-4810-b594-8d65d82ba28e.JPG": ("00_renovation_in_progress", "Renovation — bar counter being framed, ladder + bread basket frame"),
    "d47d3eb7-0868-4498-942d-37a522059607.JPG": ("00_renovation_in_progress", "Renovation — finished green table top with log-slice coasters"),
    "e51908df-a7e6-4dc3-8993-3007d076c260.JPG": ("00_renovation_in_progress", "Renovation — full room view, pendant lights + log stools, no chairs yet"),
    "ec1a470e-bddc-4eae-850c-1d52a05299ee.JPG": ("00_renovation_in_progress", "Renovation — slate-panelled feature wall, raw wood side panel"),
    "efc310df-5fb9-4a6b-ab24-edd43b6ddac3.JPG": ("00_renovation_in_progress", "Renovation — sweeping up after fit-out, single pendant light"),

    # 01_interior_finished
    "0b0bdedb-6581-4950-80f5-dc5ad828697c.JPG": ("01_interior_finished", "Ficus plant in Café Chico branded pot on a round wood table"),
    "0c2c38e7-de8c-4684-ae58-32dae1dba9ff.JPG": ("01_interior_finished", "Counter view — specials board visible, brick wall + globe decor"),
    "0f0280ff-21bd-4b47-8235-634fca4dbb7c.JPG": ("01_interior_finished", "All-green tables + wood bench, brick walls, pendant lights — pre-launch"),
    "182bccab-3b09-4bcb-a3d1-a430b238a4fd.JPG": ("01_interior_finished", "Counter with QR menu stand, small potted plant, globe, mirror"),
    "1a9074c3-d0c1-4614-908a-4fd5ddab65c2.JPG": ("01_interior_finished", "Chalkboard quote 'No one's a stranger, it's just a friend you haven't met…'"),
    "299a59d2-8c5d-45a4-94a7-4ef3450ded7d.JPG": ("01_interior_finished", "Vintage globe on counter ledge with greenery"),
    "2baf3821-8c1c-4df5-9a66-83db69a9942d.JPG": ("01_interior_finished", "Window interior — large plant, glass-top table, café Chico sign reflection"),
    "28fff6de-d019-40cc-abad-c93ed0ec9ac8.JPG": ("01_interior_finished", "Counter — food menu board + brick wall + globe + globe shelf"),
    "335b8cfa-8f81-443c-941f-5b742ef0b64a.JPG": ("01_interior_finished", "Counter — vintage bicycle wall art + globe + slat wall"),
    "421013be-d6f2-43fc-a76c-32f132f5d99f.JPG": ("01_interior_finished", "Chalkboard quote — 'No one's a stranger…' (alternate angle of 1a9074c3)"),
    "4395d099-afea-41ec-bf02-747a4a39c8ee.JPG": ("01_interior_finished", "Books on shelf: Junior Dictionary, Ferguson, Coffee Book + cast iron anchor"),
    "479419c6-a8d9-4cae-abc7-cc83b1e8e5cc.JPG": ("01_interior_finished", "Party room — long wood table, 8 chairs, TV, vertical slat feature wall"),
    "47cd7152-e5ef-4888-a124-ba5d544a25cc.JPG": ("01_interior_finished", "Party room — same setup, alternate angle showing TV + toilet door"),
    "50d5a0bd-4900-43c2-a3ec-410dff6360c4.JPG": ("01_interior_finished", "Evening interior — pendant lights, bicycle wall art, drinks menu board"),
    "645822c1-6002-4e2f-b965-0d48b4f989b6.JPG": ("01_interior_finished", "Counter view — CAFE CHICO chalkboard, menu board, breakfast/brunch sections"),
    "a5494cdf-3e57-419f-9125-2e89ba5cae6f.JPG": ("01_interior_finished", "Counter backshelf — Monin mango + strawberry + Monin hazelnut/ginger syrups"),
    "af5eddd5-afa0-4260-9059-0505e80719ae.JPG": ("01_interior_finished", "Evening interior — Edison-bulb lights, brick wall, leather stools, large flowers"),
    "b60cc54f-8095-4e88-b285-140b92b377fc.JPG": ("01_interior_finished", "Party room — dark slat wall + vertical LED strips, plant, 2 round tables"),
    "c05202fa-9383-4cae-83d1-c13ec2e6c7cf.JPG": ("01_interior_finished", "Counter mirror shot — 'Café Chico' gold sign reflected, wood bench seating"),
    "dd1e4a91-8155-4d9b-a843-19cf98e9415f.JPG": ("01_interior_finished", "Letterboard — 'CHICO / HEALTHY & HEARTY / BREAKFAST / SANDWICHES / SALADS…'"),
    "e050ca5a-402d-4ec9-ae70-ac8f2c3374d8.JPG": ("01_interior_finished", "Evening interior — warm pendant lighting, globe, brick wall, Edison bulbs"),
    "f253bf8b-db2b-48dd-afca-08ad387f863a.JPG": ("01_interior_finished", "Evening interior — soft lighting, plants, wood counter, exit sign"),

    # 02_exterior
    "5937f4f6-d9ee-4b27-9db5-7079f4e5a334.JPG": ("02_exterior", "Exterior — CAFÉ CHICO storefront with white horse-drawn carriage passing"),
    "ba78b9ff-8390-478d-8c30-927526ba3637.JPG": ("02_exterior", "Exterior — moody rain-grey Bolton afternoon, storefront lit warm (used in #story)"),
    "ea85e15c-20db-4e92-af67-f66b8d9d6d8e.JPG": ("02_exterior", "Exterior — CAFE CHICO sign + Ramadan Iftar press, kids' drawings on door"),

    # 03_food_and_drinks
    "0cd16726-f4b4-428f-8714-ccbc1bfd6a57.JPG": ("03_food_and_drinks", "Two plated burgers (one halal, one cheese) with CAFE CHICO 'Freshly Made Daily' sign"),
    "341f21d9-b265-4993-bb88-c0556a545ccf.JPG": ("03_food_and_drinks", "Catering wraps platter on wooden board, fresh salad garnish"),
    "44c980ff-7de7-4b5a-bf73-9cca77125ce9.JPG": ("03_food_and_drinks", "Baked with love brownies — chocolate brownies with paper heart label"),
    "67e3e6b4-702f-491c-a5bf-24b0bcf6954e.JPG": ("03_food_and_drinks", "Baked with love brownies — packaging close-up, two labelled cellophane bags"),
    "ba76605f-f02f-4959-9877-b303a165b17b.JPG": ("03_food_and_drinks", "Real catering platter — wraps, sandwiches, fruit, sweet treats on wood board"),
    "d9d8c1cb-6a2b-47bb-9411-38c7b0fb1a37.JPG": ("03_food_and_drinks", "Food photography — bagel sandwich + granola parfait + bacon/egg bagel"),
    "ea8ebc8b-eb5f-4970-b22f-c16c50464a91.JPG": ("03_food_and_drinks", "Brownies on a glass cake stand, Café Chico display board in background"),

    # 04_ice_cream_bike
    "9ecbbcfd-21ff-4c22-8510-47a202d85cea.JPG": ("04_ice_cream_bike", "CHICO'S ice-cream menu chalkboard — Wafer Cone £2.50, Waffle £3.50/£4.50, Tub £2.50/£3.50"),
    "c89ff63e-6328-47f2-af1f-2c76b847151a.JPG": ("04_ice_cream_bike", "Indoor trike — Café Chico ice-cream trike with menu board + staff thumbs-up"),

    # 05_press_and_media
    "3a4ab075-d312-49ef-9efd-a3252401725a.JPG": ("05_press_and_media", "Bolton News article — phone screenshot, Aaliyah + dad photo, 'café opens its doors'"),
    "3a999d74-456b-4328-bfa7-d6c506983739.JPG": ("05_press_and_media", "Bolton News article — phone screenshot, 6-person group photo, 'lovely gesture'"),
    "4f8093e1-1844-42fc-be03-d27d892ca13c.JPG": ("05_press_and_media", "Display board — Bolton News clipping + Palestine Emergency Appeal + Bolton at Home + kids drawings"),

    # 06_community_and_events
    "3c7a45aa-8128-4c30-a5d1-52fd7957a544.JPG": ("06_community_and_events", "View our menu by scanning the QR code — branded Café Chico table sign"),

    # 07_owners_and_customers
    "59f0d436-0a26-438d-b419-1c109f9dbbdd.JPG": ("07_owners_and_customers", "Three friends at table — man + 2 young women eating French toast + tea, mirror reflection"),
    "7e3fda77-f87f-46d8-9a0d-a2551dd48afa.JPG": ("07_owners_and_customers", "7 customers seated around café tables, busy lunch service"),
    "ed1b4d10-09eb-4d93-bba2-ded880b9324f.JPG": ("07_owners_and_customers", "Two staff members wearing Café Chico hoodies, bicycle wall art behind"),

    # 08_misc_uncategorized
    "450180cc-8c91-45c7-a903-ba6f80df7b45.JPG": ("08_misc_uncategorized", "Logo mockup — Bolton Angling Centre storefront with Café Chico logo overlaid"),
    "6a9e469d-954f-4267-9b28-04960c07dd70.MP4": ("08_misc_uncategorized", "MP4 video clip — content unknown, needs review"),
    "79d0ebbd-6421-4473-a698-7cac2cd3a6ad.JPG": ("08_misc_uncategorized", "Text review screenshot — Senior PM at Robertson North West thank-you message (already polished into index.html)"),
}

moves = []
for fname, (cat, desc) in CLASSIFY.items():
    src = os.path.join(ROOT, fname)
    dst_dir = os.path.join(ROOT, cat)
    dst = os.path.join(dst_dir, fname)
    if not os.path.exists(src):
        print(f"  MISSING: {fname}")
        continue
    if os.path.exists(dst):
        print(f"  ALREADY THERE: {fname}")
        continue
    shutil.move(src, dst)
    moves.append((fname, cat, desc))

print(f"\nMoved {len(moves)} / {len(CLASSIFY)} files")

# Print summary
from collections import Counter
counts = Counter(cat for _, cat, _ in moves)
print("\n=== Per-category counts ===")
for cat in sorted(counts.keys()):
    print(f"  {cat}: {counts[cat]}")

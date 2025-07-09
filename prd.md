# 🐾 PRD: Hashlings – A Monster-Raising Web Game

---

## 📌 Overview

**Hashlings** is a web-based monster-raising game inspired by classics like _Monster Rancher_ and _Tamagotchi_. Users generate a unique monster based on their chosen username, which determines their creature's initial stats and appearance. Players can raise, evolve, and care for their monsters through simple time-based actions, with optional PvP and seasonal events for long-term engagement.

---

## 🌟 Goals

- Launch a lightweight, nostalgic monster-raising game with high replay value.
    
- Allow players to create unique monsters with no two alike.
    
- Encourage daily/weekly check-ins through idle-care mechanics.
    
- Create a game loop that supports sharing, casual competition, and personalization.
    

---

## 🧹 Key Features

### 1. Username-Based Monster Generation

- Deterministic monster creation from username input (e.g., via hash function).
    
- Stats and visual traits derived from the seed:
    
    - **Species** (e.g., Drake, Golem, Sprite)
        
    - **Element** (Fire, Water, Nature, Shadow, etc.)
        
    - **Visuals** (body shape, colors, accessories)
        
    - **Base Stats** (Strength, Agility, Intelligence, Mood, Health)
        

### 2. Monster Stats & Evolution

- Monsters have core stats that evolve with training and time:
    
    - **Strength** → Affects **damage output**
        
    - **Intelligence** → Affects **magic damage**
        
    - **Fortitude** → Affects **health pool**
        
    - **Agility** → Affects **dodge chance**
        
    - **Perception** → Affects **accuracy (to hit)**
        
    - **Mood** → Affects **obedience and training success**
        
- Evolutions triggered by reaching certain stat patterns and ages.
    
- Optional "mutation" evolutions from neglect or edge cases.
    

### 3. Daily Care & Activities

- Players can perform up to 3 actions per day:
    
    - Feed → affects mood, weight
        
    - Train → boosts stats, lowers mood
        
    - Rest → recovers energy
        
- Certain actions unlock based on monster stage.
    

### 4. Idle-First Loop

- Game time moves in real-world time (monsters grow daily).
    
- Push notifications (or browser pings) for food reminders, evolutions, etc.
    
- Occasional "events" like sickness or dreams prompt care or unlock bonuses.
    

### 5. Public Profile & Sharing

- Each player has a unique monster profile page:
    
    - View stats, evolution path, actions log
        
    - Rename monster, decorate enclosure
        
- Encourage sharing with screenshots, direct links, and QR codes.
    

### 6. PvP (Stretch Goal / Phase 2)

- Turn-based battles using stat-influenced dice rolls.
    
- Tournaments run weekly with stat-matching brackets.
    
- Seasonal champions displayed in the Hall of Fame.
    

---

## 🔀 User Flow

1. **Landing Page** → Enter username
    
2. **Monster is Generated** → Name, stats, appearance revealed
    
3. **Tutorial** → Learn to feed, train, rest
    
4. **Daily Loop** → Care → Stat growth → Evolution trigger
    
5. **Profile Customization** → Decor, rename, show off
    
6. **Optional PvP / Events** (stretch goal)
    

---

## 🛠️ Technical Requirements

### Frontend

- **Framework:** React.js or SvelteKit
    
- **Styling:** TailwindCSS or CSS Modules
    
- **State:** Zustand or React Context
    
- **UI Elements:** SVG-based monster sprites; dynamic stat display
    

### Backend

- **Auth & Storage:** Firebase or Supabase
    
- **Database:** Real-time DB for monster state & user sessions
    
- **Game Logic:** Serverless functions for stat updates, evolution checks
    
- **Seed Generator:** Hashing algorithm (SHA256 or CRC32) to convert usernames to deterministic seeds
    

### Database Schema

To ensure monsters persist across sessions, the following schema is proposed:

#### `users` Table

|Field|Type|Description|
|---|---|---|
|id|UUID|Unique user identifier|
|username|String|Login name (used to generate seed)|
|created_at|Timestamp|Date account was created|

#### `monsters` Table

|   |   |   |
|---|---|---|
|Field|Type|Description|
|id|UUID|Unique monster ID|
|user_id|UUID|Foreign key to `users` table|
|species|String|Monster species|
|element|String|Elemental affinity|
|size_category|String|Small / Medium / Large|
|base_size|Float|Numeric size after size modifier|
|stats|JSON|Object storing Strength, Agility, etc.|
|mood|Integer|Mood score (0–100)|
|energy|Integer|Current energy level|
|favorite_food|String|Preferred food item|
|stage|Integer|Evolution stage|
|created_at|Timestamp|Date the monster was generated|

#### `actions` Table

|   |   |   |
|---|---|---|
|Field|Type|Description|
|id|UUID|Unique action ID|
|monster_id|UUID|Foreign key to `monsters` table|
|action_type|String|e.g., "feed", "train", "rest"|
|result|JSON|Stat gains, mood effects, event trigger|
|timestamp|Timestamp|Time of the action|

This schema ensures persistent storage of player monsters, their growth, and daily interactions. Additional tables (e.g., for inventory or achievements) can be added later.

### Game Engine

- Lightweight rules engine (custom JS logic) for:
    
    - Stat influence
        
    - Time-based events
        
    - Evolution tree
        

### Frontend

- **Framework:** React.js or SvelteKit
    
- **Styling:** TailwindCSS or CSS Modules
    
- **State:** Zustand or React Context
    
- **UI Elements:** SVG-based monster sprites; dynamic stat display
    

### Backend

- **Auth & Storage:** Firebase or Supabase
    
- **Database:** Real-time DB for monster state & user sessions
    
- **Game Logic:** Serverless functions for stat updates, evolution checks
    
- **Seed Generator:** Hashing algorithm (SHA256 or CRC32) to convert usernames to deterministic seeds
    

### Game Engine

- Lightweight rules engine (custom JS logic) for:
    
    - Stat influence
        
    - Time-based events
        
    - Evolution tree
        

### Username-to-Monster Generation Logic

When a user enters their login name, the system generates a deterministic monster with a specific species, elemental affinity, and size category using the following pipeline:

1. **Hashing**:
    
    - The username string is passed through a hash function (e.g., SHA256) to produce a large hexadecimal value.
        
2. **Seed Derivation**:
    
    - The hash is split into substrings to derive values for species, element, and size. For example:
        
        - First 4 hex digits → `Species Index`
            
        - Next 4 hex digits → `Element Index`
            
        - Next 4 hex digits → `Size Modifier`
            
3. **Species Assignment**:
    
    - Convert the `Species Index` into a number and use modulo operation to map it to the species list.
        
4. **Element Assignment**:
    
    - Same approach with `Element Index` and the 8 defined elements.
        
5. **Size Category Assignment**:
    
    - The `Size Modifier` is mapped to one of three categories:
        
        - `0x0000`–`0x5555` → Small
            
        - `0x5556`–`0xAAAA` → Medium
            
        - `0xAAAB`–`0xFFFF` → Large
            
6. **Stat Adjustment**:
    
    - Base stats from species table.
        
    - Adjusted by size category rules:
        
        - Small: -0.5 base size, +Agility, -Fortitude
            
        - Medium: No change
            
        - Large: +1.5 base size, +Fortitude, -Agility
            
7. **Final Output**:
    
    - A fully generated monster with:
        
        - Species
            
        - Element
            
        - Size Category
            
        - Modified Stats
            
        - Special Ability
            

---

## 🧪 MVP Scope (Milestone 1)

|   |   |
|---|---|
|Feature|Included in MVP?|
|Username-based monster generation|✅|
|Visual traits and basic stat generation|✅|
|Daily care actions (feed, train, rest)|✅|
|Basic evolution mechanic (1 stage)|✅|
|Monster profile page|✅|
|Daily login reminder logic|✅|
|Light background music / sound FX|❌|
|PvP battle loop|❌|
|Seasonal events|❌|
|Decorative monster pens|❌|

---

## 📅 Milestones & Timeline

|   |   |   |
|---|---|---|
|Milestone|Description|Est. Time|
|Planning & Design|Define visual style, game logic, data model|1 week|
|Core Engine|Username → Seed → Monster → Stat System|2 weeks|
|UI & Frontend|Core game loop, monster viewer, care UI|3 weeks|
|Database & Hosting|Firebase/Supabase, deploy to Vercel|1 week|
|MVP Launch|Landing page, core loop, monster profiles|Week 7|

---

## 📊 Success Metrics

- **Day 1 Retention ≥ 25%**
    
- **Avg Session Time ≥ 2 minutes**
    
- **Avg Monsters Created Per User ≥ 2**
    
- **Share Rate ≥ 10% (users posting monster links or screenshots)**
    

---

## 🗨️ Open Questions

- Should monsters persist anonymously, or require login?
    
- How do we handle multiple monsters per user?
    
- Should evolutions be deterministic or allow for RNG + care influence?
    
- Monetization plan: purely for fun, or optional cosmetics / collectibles?
    

---

## 🌋 Elemental Affinities

Each monster is aligned to one of several elements. This alignment affects their training efficiency, stat growth, combat interactions, mood preferences, and evolution paths.

|   |   |   |   |   |
|---|---|---|---|---|
|Element|Training Bias|Stat Bonus|Combat Bonus|Mood Triggers / Notes|
|**Fire**|Strength|+5% Strength|Bonus vs Nature, Weak vs Water|Angry if overfed|
|**Water**|Agility|+5% Agility|Bonus vs Fire, Weak vs Lightning|Loves rainy days|
|**Nature**|Fortitude|+5% Fortitude|Bonus vs Lightning, Weak vs Fire|Calms down from rest|
|**Shadow**|Intelligence|+5% Intelligence|Bonus vs Light, Weak vs Spirit|High mood at night|
|**Spirit**|Mood-based Growth|+10% Mood Effects|Bonus vs Shadow, Weak vs Metal|Evolves differently|
|**Metal**|Slower Overall Growth|+5% Resistances|Bonus vs Spirit, Weak vs Nature|Becomes restless when idle|
|**Lightning**|Perception|+5% Perception|Bonus vs Water, Weak vs Earth|Dislikes rest|
|**Earth**|Fortitude & Health|+10% Health|Bonus vs Lightning, Weak vs Wind|Hates sweets|

---

## 🔮 Mood, Training & Feeding Systems

### Mood System

- Mood is a dynamic stat ranging from 0 to 100.
    
- Influences training success, obedience, and special evolution conditions.
    
- Mood Modifiers:
    
    - Feeding favorite food: +10
        
    - Feeding disliked food: -10
        
    - Training success: +5
        
    - Training failure: -5
        
    - Ignored for a day: -15
        
    - Resting: +5–15 (scales with element)
        

**Mood Effects**:

|   |   |   |
|---|---|---|
|Mood Range|Description|Effect|
|80–100|Joyful|+10% to training success and obedience|
|50–79|Neutral|Normal behavior|
|20–49|Moody|-10% training success; may refuse commands|
|0–19|Rebellious or Depressed|Refuses care actions, evolution blocked|

---

### Training

- Each day, player may select **one stat to train**.
    
- Training has a chance to succeed based on:
    
    - Current mood
        
    - Elemental affinity
        
    - Monster's size (e.g., Large = harder to train Agility)
        
- Training Outcome:
    
    - Success → +1 to +3 in targeted stat
        
    - Failure → +0 or -1 Mood
        

**Sample Success Formula**:  
`Base Chance = 80%`  
`+ Elemental Bonus (if stat matches element)`  
`+ Mood Modifier (±10%)`  
`- Size Penalty (if applicable)`

---

### Feeding

- Each monster has preferred and disliked food types (e.g., meat, plants, sweets).
    
- Feeding affects mood and weight (future feature for evolutions/appearance).
    

|   |   |   |   |
|---|---|---|---|
|Food Type|Example Items|Effect on Mood|Notes|
|Favorite|Roast Beast, Berries|+10 Mood|Increases bond|
|Neutral|Standard Feed|+0 to +5 Mood||
|Disliked|Spoiled Meat, Candy|-10 Mood|Can trigger rebellion|

Feeding also restores **energy** and may occasionally trigger **dream events** or **elemental reactions** based on affinity.

---

## 🧙 Species

Each species has a defined **base size**, which can be modified based on the user's generated size category. This modifier affects stats and physical scale:

- **Small**: -0.5 from base size (minimum of 0.2); **+Agility**, **-Fortitude**
    
- **Medium**: Unchanged base size; balanced stats
    
- **Large**: +1.5 to base size; **+Fortitude**, **-Agility**
    

|   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|
|Species|Base Size|Strength|Intelligence|Fortitude|Agility|Perception|Special Ability|Favorite Food|
|Drake|1.2|20|10|15|15|10|Flame Burst|Spicy Jerky|
|Golem|2.5|25|5|30|5|8|Stone Skin|Ironroot Bark|
|Hellhound|1.0|18|8|10|20|12|Inferno Howl|Charcoal Biscuits|
|Gargoyle|1.3|16|6|20|10|14|Petrify Glare|Cave Mushrooms|
|Manticore|1.8|22|12|18|14|13|Poison Spike|Scorpion Honey|
|Kraken|3.0|28|15|25|6|9|Tentacle Snare|Salted Eel|
|Zombie Minotaur|2.0|24|4|22|6|7|Undying Charge|Rotroot Stew|
|Phoenix|0.9|14|20|12|16|18|Rebirth Flame|Sunfruit Nectar|
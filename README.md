# 🐾 Hashlings - Monster Raising Game

A web-based monster-raising game inspired by classics like Monster Rancher and Tamagotchi. Generate unique monsters based on your email and care for them daily with real user accounts!

## 🌟 Features

### User Authentication & Persistence
- **Email/Password Registration**: Create secure accounts
- **Email/Password Login**: Sign in to your monster world
- **Persistent Sessions**: Stay logged in across browser sessions
- **Secure Logout**: Safely sign out when done
- **Data Persistence**: Your monster and progress are saved to the database
- **Cross-Device Sync**: Access your monster from any device

### Username-Based Monster Generation
- **Deterministic Creation**: Every email creates a unique monster
- **SHA256 Hashing**: Uses cryptographic hashing to ensure consistency
- **8 Species**: Drake, Golem, Hellhound, Gargoyle, Manticore, Kraken, Zombie Minotaur, Phoenix
- **8 Elements**: Fire, Water, Nature, Shadow, Spirit, Metal, Lightning, Earth
- **3 Sizes**: Small, Medium, Large (affects stats)

### Monster Stats & Evolution
- **Core Stats**: Strength, Intelligence, Fortitude, Agility, Perception, Mood, Energy
- **Elemental Bonuses**: Each element provides unique stat bonuses
- **Size Modifiers**: Size affects base stats and training effectiveness

### Daily Care System
- **3 Actions Per Day**: Feed, Train, or Rest your monster
- **Element-Specific Effects**: Different elements react differently to actions
- **Mood System**: Affects training success and monster behavior
- **Energy Management**: Monsters need rest to recover energy

### Game Mechanics
- **Training Success**: Based on mood, element affinity, and size
- **Favorite Foods**: Each species has preferred foods that boost mood
- **Action Log**: Track all your monster's activities
- **Daily Reset**: Actions reset each day for continued engagement

## 🛡️ Security

This game uses **server-side validation** with Supabase Edge Functions for enhanced security:

### ✅ **Secure Features**
- **Server-side validation** for all game actions
- **Anti-cheat protection** against client manipulation
- **Rate limiting** (3 actions per day)
- **Input sanitization** and validation
- **Audit logging** of all actions
- **Authentication required** for all operations

### 🚀 **Architecture**
```
Frontend → Edge Function → Database → Frontend
```

All game logic runs on the server, making it much harder to hack or manipulate.

**For maximum security**, also consider:
- Advanced rate limiting per user
- Suspicious activity detection
- Real-time monitoring
- Backup and recovery systems

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hashlings
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Go to Project Settings → API
   - Copy your Project URL and anon public key
   - Go to SQL Editor and run the schema from `database-schema.sql`

4. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Deploy Edge Functions (Optional but Recommended)**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Initialize and deploy secure functions
   supabase init
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy perform-action
   supabase functions deploy rename-monster
   ```
   See `DEPLOYMENT_GUIDE.md` for detailed instructions.

6. **Start the development server**
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Play

1. **Create Account**: Sign up with your email and password
2. **Generate Your Monster**: Your unique monster is created based on your email
3. **Meet Your Monster**: View your monster's stats, element, and species
4. **Daily Care**: Perform up to 3 actions per day:
   - **Feed**: Restores energy and affects mood
   - **Train**: Boosts stats (success depends on mood and element)
   - **Rest**: Recovers energy and improves mood
5. **Watch Growth**: Monitor your monster's progress through the action log
6. **Stay Logged In**: Your monster persists across sessions

## 🏗️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Hashing**: js-sha256
- **Authentication & Database**: Supabase
- **Backend**: Supabase Auth + Postgres

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AuthPage.tsx     # Login/signup interface
│   ├── LandingPage.tsx  # Username input page
│   ├── MonsterProfile.tsx # Main game interface
│   ├── MonsterSprite.tsx # SVG monster visualization
│   └── StatBar.tsx      # Stat display component
├── data/
│   └── species.ts       # Monster species data
├── store/
│   └── gameStore.ts     # Zustand state management
├── types/
│   ├── game.ts          # TypeScript interfaces
│   └── js-sha256.d.ts   # Type declarations
├── utils/
│   ├── auth.ts          # Authentication functions
│   ├── monsterGenerator.ts # Monster creation logic
│   ├── gameActions.ts   # Action processing
│   └── supabaseClient.ts # Supabase configuration
└── App.tsx              # Main application component
```

## 🎯 Game Rules

### Authentication
- **Email Required**: Use a valid email address for registration
- **Password Security**: Choose a strong password
- **Session Persistence**: Stay logged in until you sign out
- **Account Recovery**: Password reset available via email

### Monster Generation
- Email is hashed using SHA256
- First 4 hex digits → Species selection
- Next 4 hex digits → Element selection  
- Next 4 hex digits → Size category
- Base stats from species + element/size modifiers

### Daily Actions
- **Maximum 3 actions per day**
- Actions reset at midnight (local time)
- Each action affects stats, mood, and energy
- Element-specific bonuses and penalties apply

### Training System
- **Base Success Rate**: 80%
- **Elemental Bonus**: +10% for element's preferred stat
- **Mood Modifier**: ±10% based on current mood
- **Size Penalties**: Large monsters harder to train agility, small monsters harder to train fortitude

### Mood Effects
- **80-100**: Joyful (+10% training success)
- **50-79**: Neutral (normal behavior)
- **20-49**: Moody (-10% training success)
- **0-19**: Rebellious (may refuse actions)

## 🔮 Future Features (Phase 2)

- **PvP Battles**: Turn-based combat system
- **Evolution System**: Multiple evolution stages
- **Seasonal Events**: Special events and rewards
- **Monster Sharing**: Share your monster with friends
- **Achievements**: Unlock achievements for milestones
- **Sound Effects**: Audio feedback for actions
- **Real-time Updates**: Live updates when multiple users interact

## 🎨 Customization

### Adding New Species
1. Add species data to `src/data/species.ts`
2. Update the species list in `src/utils/monsterGenerator.ts`
3. Add sprite representation in `src/components/MonsterSprite.tsx`

### Adding New Elements
1. Add element data to `src/data/species.ts`
2. Update element arrays in `src/utils/monsterGenerator.ts`
3. Add element colors to `tailwind.config.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Monster Rancher and Tamagotchi
- Built with modern web technologies
- Designed for nostalgic monster-raising gameplay
- Powered by Supabase for authentication and data persistence

---

**Happy Monster Raising! 🐾✨**

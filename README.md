# Golf Charity Platform

A modern web application that combines golf scoring with charitable giving. Players can subscribe, track their Stableford scores, and enter monthly prize draws while supporting their chosen charities.

## ✨ Features

- **User Authentication**: Secure signup and login with Supabase Auth
- **Charity Selection**: Choose from featured charities to support
- **Score Tracking**: Log Stableford scores (1-45 points)
- **Monthly Draws**: Automatic prize draws based on recent scores
- **Admin Dashboard**: Manage charities, users, draws, and reports
- **Responsive Design**: Mobile-first UI with glassmorphism effects
- **Real-time Updates**: Live score and draw status updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Deployment**: Vercel
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Emoji and custom SVGs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/golf-charity-platform.git
   cd golf-charity-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the schema SQL from `supabase/schema.sql`
   - Run the RLS fixes from `supabase/fix-rls-recursion.sql`
   - Copy your project URL and anon key

4. **Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
golf-charity-platform/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # User dashboard
│   │   └── ...
│   ├── components/         # Reusable React components
│   ├── context/            # React context providers
│   └── lib/                # Utility functions
├── supabase/               # Database schema and migrations
├── public/                 # Static assets
└── ...
```

## 🗄️ Database Schema

### Core Tables
- **users**: User profiles with charity preferences
- **charities**: Charity organizations
- **scores**: Golf scores (Stableford format)
- **draws**: Monthly prize draws
- **winners**: Draw winners
- **prize_pool**: Available prizes

### Key Features
- Row Level Security (RLS) enabled
- Public read access for charities
- User-scoped access for scores and profiles
- Admin-only management operations

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- Uses ESLint with Next.js config
- Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub Repository**
   - Import your repo to Vercel
   - Auto-detects Next.js settings

2. **Environment Variables**
   - Add Supabase URL and keys in Vercel dashboard

3. **Deploy**
   - Automatic deployments on push
   - Custom domain support

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation
- Review the TODO.md for planned features

---

**Happy Golfing & Giving! ⛳💚**

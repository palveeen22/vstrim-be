// import bcrypt from 'bcrypt'
// import { PrismaClient, JoinReason, VibeType } from '@prisma/client';

// const prisma = new PrismaClient();

// // Default password for all test users
// const DEFAULT_PASSWORD = 'Password123!'
// const saltRounds = 10

// // ============================================
// // LOCATION DATA
// // ============================================

// // Moscow area locations
// const MOSCOW_LOCATIONS = [
//   { city: 'Moscow', district: 'Tverskoy', province: 'Moscow Oblast', country: 'Russia', lat: 55.7558, lng: 37.6173 },
//   { city: 'Moscow', district: 'Arbat', province: 'Moscow Oblast', country: 'Russia', lat: 55.7520, lng: 37.5930 },
//   { city: 'Moscow', district: 'Zamoskvorechye', province: 'Moscow Oblast', country: 'Russia', lat: 55.7400, lng: 37.6280 },
//   { city: 'Moscow', district: 'Khamovniki', province: 'Moscow Oblast', country: 'Russia', lat: 55.7280, lng: 37.5700 },
//   { city: 'Moscow', district: 'Meshchansky', province: 'Moscow Oblast', country: 'Russia', lat: 55.7780, lng: 37.6350 },
//   { city: 'Saint Petersburg', district: 'Admiralteysky', province: 'Leningrad Oblast', country: 'Russia', lat: 59.9311, lng: 30.3609 },
//   { city: 'Saint Petersburg', district: 'Vasileostrovsky', province: 'Leningrad Oblast', country: 'Russia', lat: 59.9420, lng: 30.2730 },
//   { city: 'Moscow', district: 'Presnensky', province: 'Moscow Oblast', country: 'Russia', lat: 55.7600, lng: 37.5800 },
// ];

// // Jakarta area locations
// const JAKARTA_LOCATIONS = [
//   { city: 'Jakarta Selatan', district: 'Kebayoran Baru', province: 'DKI Jakarta', country: 'Indonesia', lat: -6.2615, lng: 106.8106 },
//   { city: 'Jakarta Pusat', district: 'Menteng', province: 'DKI Jakarta', country: 'Indonesia', lat: -6.1862, lng: 106.8341 },
//   { city: 'Jakarta Utara', district: 'Kelapa Gading', province: 'DKI Jakarta', country: 'Indonesia', lat: -6.1383, lng: 106.8633 },
//   { city: 'Jakarta Barat', district: 'Grogol Petamburan', province: 'DKI Jakarta', country: 'Indonesia', lat: -6.1668, lng: 106.7599 },
//   { city: 'Jakarta Timur', district: 'Cakung', province: 'DKI Jakarta', country: 'Indonesia', lat: -6.2250, lng: 106.9002 },
//   { city: 'Tangerang Selatan', district: 'Pondok Indah', province: 'Banten', country: 'Indonesia', lat: -6.2880, lng: 106.7172 },
//   { city: 'Bekasi', district: 'Bekasi Barat', province: 'Jawa Barat', country: 'Indonesia', lat: -6.2383, lng: 106.9756 },
//   { city: 'Depok', district: 'Pancoran Mas', province: 'Jawa Barat', country: 'Indonesia', lat: -6.4025, lng: 106.7942 },
// ];

// // New York area locations
// const NEWYORK_LOCATIONS = [
//   { city: 'New York', district: 'Manhattan', province: 'New York', country: 'United States', lat: 40.7831, lng: -73.9712 },
//   { city: 'New York', district: 'Brooklyn', province: 'New York', country: 'United States', lat: 40.6782, lng: -73.9442 },
//   { city: 'New York', district: 'Queens', province: 'New York', country: 'United States', lat: 40.7282, lng: -73.7949 },
//   { city: 'New York', district: 'Bronx', province: 'New York', country: 'United States', lat: 40.8448, lng: -73.8648 },
//   { city: 'Jersey City', district: 'Downtown', province: 'New Jersey', country: 'United States', lat: 40.7178, lng: -74.0431 },
//   { city: 'Hoboken', district: 'Uptown', province: 'New Jersey', country: 'United States', lat: 40.7439, lng: -74.0324 },
//   { city: 'New York', district: 'Staten Island', province: 'New York', country: 'United States', lat: 40.5795, lng: -74.1502 },
//   { city: 'Yonkers', district: 'Downtown', province: 'New York', country: 'United States', lat: 40.9312, lng: -73.8987 },
// ];

// // Combine all locations
// const ALL_LOCATIONS = [
//   ...MOSCOW_LOCATIONS,
//   ...JAKARTA_LOCATIONS,
//   ...NEWYORK_LOCATIONS
// ];

// // ============================================
// // HANGOUT PLACES DATA
// // ============================================

// const MOSCOW_HANGOUT_PLACES = [
//   { name: 'Starbucks Tverskaya', type: 'cafe', lat: 55.7615, lng: 37.6082, address: 'Tverskaya St, 22', city: 'Moscow' },
//   { name: 'Gorky Park', type: 'park', lat: 55.7280, lng: 37.6010, address: 'Krymsky Val, 9', city: 'Moscow' },
//   { name: 'World Gym Moscow', type: 'gym', lat: 55.7558, lng: 37.6230, address: 'Novy Arbat, 15', city: 'Moscow' },
//   { name: 'Bolshoi Theatre', type: 'art_gallery', lat: 55.7601, lng: 37.6186, address: 'Theatre Square, 1', city: 'Moscow' },
//   { name: 'Sixty Bar', type: 'bar', lat: 55.7539, lng: 37.5850, address: 'Presnenskaya Emb, 12', city: 'Moscow' },
// ];

// const JAKARTA_HANGOUT_PLACES = [
//   { name: 'Starbucks Senopati', type: 'cafe', lat: -6.2425, lng: 106.7983, address: 'Jl. Senopati No. 10', city: 'Jakarta Selatan' },
//   { name: 'Central Park Mall', type: 'mall', lat: -6.1775, lng: 106.7926, address: 'Jl. Letjen S. Parman', city: 'Jakarta Barat' },
//   { name: 'GBK Sports Complex', type: 'sports_venue', lat: -6.2188, lng: 106.8019, address: 'Jl. Pintu Satu Senayan', city: 'Jakarta Pusat' },
//   { name: 'Ancol Beach', type: 'beach', lat: -6.1225, lng: 106.8424, address: 'Jl. Lodan Timur No.7', city: 'Jakarta Utara' },
//   { name: 'Skye Bar', type: 'bar', lat: -6.2088, lng: 106.8456, address: 'Jl. MH Thamrin No.1', city: 'Jakarta Pusat' },
// ];

// const NEWYORK_HANGOUT_PLACES = [
//   { name: 'Starbucks Times Square', type: 'cafe', lat: 40.7580, lng: -73.9855, address: '1585 Broadway', city: 'New York' },
//   { name: 'Central Park', type: 'park', lat: 40.7829, lng: -73.9654, address: 'Central Park West', city: 'New York' },
//   { name: 'Equinox Gym', type: 'gym', lat: 40.7614, lng: -73.9776, address: '897 Broadway', city: 'New York' },
//   { name: 'MoMA', type: 'museum', lat: 40.7614, lng: -73.9776, address: '11 W 53rd St', city: 'New York' },
//   { name: 'The Rooftop Bar', type: 'bar', lat: 40.7505, lng: -73.9934, address: '2 6th Ave', city: 'New York' },
// ];

// const ALL_HANGOUT_PLACES = [
//   ...MOSCOW_HANGOUT_PLACES,
//   ...JAKARTA_HANGOUT_PLACES,
//   ...NEWYORK_HANGOUT_PLACES
// ];

// // ============================================
// // MOOD & JOIN REASONS
// // ============================================

// // const MOOD_TYPES = [
// //   'energetic', 'calm', 'adventurous', 'chill',
// //   'social', 'introspective', 'creative', 'focused'
// // ] as const;

// const ALL_JOIN_REASONS = [
//   JoinReason.MAKE_FRIENDS,
//   JoinReason.FIND_ACTIVITY_PARTNERS,
//   JoinReason.EXPLORE_CITY,
//   JoinReason.TRY_NEW_EXPERIENCES,
//   JoinReason.PROFESSIONAL_NETWORKING,
//   JoinReason.DATING_RELATIONSHIPS,
//   JoinReason.NEW_TO_AREA,
//   JoinReason.EXPAND_SOCIAL_CIRCLE,
//   JoinReason.FIND_HOBBY_COMMUNITY,
//   JoinReason.ATTEND_EVENTS
// ];

// const ALL_VIBES = [
//   VibeType.cozy,
//   VibeType.active,
//   VibeType.adventurous,
//   VibeType.energetic,
// ];

// // Helper to get random join reasons (1-3)
// function getRandomJoinReasons(): JoinReason[] {
//   const count = Math.floor(Math.random() * 3) + 1; // 1-3
//   const shuffled = [...ALL_JOIN_REASONS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

// // Helper to get random join reasons (1-3)
// function getRandomJVibes(): VibeType[] {
//   const count = Math.floor(Math.random() * 3) + 1; // 1-3
//   const shuffled = [...ALL_VIBES].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

// // ============================================
// // INTERESTS WITH CATEGORIES
// // ============================================

// const INTERESTS_DATA = [
//   // SPORTS (5)
//   { name: 'Football', slug: 'football', category: 'sports', icon: '⚽' },
//   { name: 'Basketball', slug: 'basketball', category: 'sports', icon: '🏀' },
//   { name: 'Tennis', slug: 'tennis', category: 'sports', icon: '🎾' },
//   { name: 'Yoga', slug: 'yoga', category: 'sports', icon: '🧘' },
//   { name: 'Fitness', slug: 'fitness', category: 'sports', icon: '💪' },

//   // ARTS (5)
//   { name: 'Painting', slug: 'painting', category: 'arts', icon: '🎨' },
//   { name: 'Photography', slug: 'photography', category: 'arts', icon: '📷' },
//   { name: 'Drawing', slug: 'drawing', category: 'arts', icon: '✏️' },
//   { name: 'Sculpture', slug: 'sculpture', category: 'arts', icon: '🗿' },
//   { name: 'Design', slug: 'design', category: 'arts', icon: '🎭' },

//   // MUSIC (4)
//   { name: 'Playing Guitar', slug: 'guitar', category: 'music', icon: '🎸' },
//   { name: 'Piano', slug: 'piano', category: 'music', icon: '🎹' },
//   { name: 'Singing', slug: 'singing', category: 'music', icon: '🎤' },
//   { name: 'DJ', slug: 'dj', category: 'music', icon: '🎧' },

//   // FOOD (4)
//   { name: 'Cooking', slug: 'cooking', category: 'food', icon: '👨‍🍳' },
//   { name: 'Baking', slug: 'baking', category: 'food', icon: '🧁' },
//   { name: 'Wine Tasting', slug: 'wine', category: 'food', icon: '🍷' },
//   { name: 'Coffee', slug: 'coffee', category: 'food', icon: '☕' },

//   // TECH (5)
//   { name: 'Programming', slug: 'programming', category: 'tech', icon: '💻' },
//   { name: 'AI & Machine Learning', slug: 'ai', category: 'tech', icon: '🤖' },
//   { name: 'Web Development', slug: 'webdev', category: 'tech', icon: '🌐' },
//   { name: 'Mobile Apps', slug: 'mobile', category: 'tech', icon: '📱' },
//   { name: 'Blockchain', slug: 'blockchain', category: 'tech', icon: '⛓️' },

//   // GAMING (3)
//   { name: 'Video Games', slug: 'videogames', category: 'gaming', icon: '🎮' },
//   { name: 'Board Games', slug: 'boardgames', category: 'gaming', icon: '🎲' },
//   { name: 'Chess', slug: 'chess', category: 'gaming', icon: '♟️' },

//   // FITNESS (3)
//   { name: 'Running', slug: 'running', category: 'fitness', icon: '🏃' },
//   { name: 'Gym', slug: 'gym', category: 'fitness', icon: '🏋️' },
//   { name: 'Swimming', slug: 'swimming', category: 'fitness', icon: '🏊' },

//   // READING (3)
//   { name: 'Fiction', slug: 'fiction', category: 'reading', icon: '📚' },
//   { name: 'Non-Fiction', slug: 'nonfiction', category: 'reading', icon: '📖' },
//   { name: 'Poetry', slug: 'poetry', category: 'reading', icon: '📝' },

//   // TRAVEL (4)
//   { name: 'Adventure Travel', slug: 'adventure', category: 'travel', icon: '🏕️' },
//   { name: 'City Tours', slug: 'city-tours', category: 'travel', icon: '🏙️' },
//   { name: 'Beach Vacations', slug: 'beach', category: 'travel', icon: '🏖️' },
//   { name: 'Hiking', slug: 'hiking', category: 'travel', icon: '⛰️' },

//   // WELLNESS (3)
//   { name: 'Meditation', slug: 'meditation', category: 'wellness', icon: '🧘‍♀️' },
//   { name: 'Mindfulness', slug: 'mindfulness', category: 'wellness', icon: '🌸' },
//   { name: 'Spa & Massage', slug: 'spa', category: 'wellness', icon: '💆' },

//   // SOCIAL (3)
//   { name: 'Networking', slug: 'networking', category: 'social', icon: '🤝' },
//   { name: 'Parties', slug: 'parties', category: 'social', icon: '🎉' },
//   { name: 'Volunteering', slug: 'volunteering', category: 'social', icon: '🙌' },

//   // LEARNING (3)
//   { name: 'Languages', slug: 'languages', category: 'learning', icon: '🗣️' },
//   { name: 'Online Courses', slug: 'courses', category: 'learning', icon: '🎓' },
//   { name: 'Podcasts', slug: 'podcasts', category: 'learning', icon: '🎙️' },

//   // ENTERTAINMENT (3)
//   { name: 'Movies', slug: 'movies', category: 'entertainment', icon: '🎬' },
//   { name: 'Theater', slug: 'theater', category: 'entertainment', icon: '🎭' },
//   { name: 'Concerts', slug: 'concerts', category: 'entertainment', icon: '🎵' },
// ];

// async function main() {
//   console.log('🌱 Starting seed...\n')

//   // Clean existing data
//   console.log('🧹 Cleaning existing data...')
//   await prisma.eventRecommendation.deleteMany()
//   await prisma.placeRecommendation.deleteMany()
//   await prisma.match.deleteMany()
//   // await prisma.dailyMood.deleteMany()
//   await prisma.userHangoutPlace.deleteMany() // 🆕
//   await prisma.userCoordinates.deleteMany()
//   await prisma.userMatch.deleteMany()
//   await prisma.userInterest.deleteMany()
//   await prisma.userEvent.deleteMany()
//   await prisma.userCommunity.deleteMany()
//   await prisma.promo.deleteMany()
//   await prisma.event.deleteMany()
//   await prisma.interest.deleteMany()
//   await prisma.place.deleteMany()
//   await prisma.community.deleteMany()
//   await prisma.user.deleteMany()
//   console.log('✅ Cleaned existing data\n')

//   // Hash password
//   console.log('🔐 Hashing default password...')
//   const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds)
//   console.log('✅ Password hashed\n')

//   // ============================================
//   // CREATE USERS
//   // ============================================
//   console.log('👥 Creating users...')

//   const userData = [
//     {
//       name: 'Dmitry Ivanov',
//       email: 'dmitry@example.com',
//       username: 'dmitry_moscow',
//       password: hashedPassword,
//       bio: 'Tech entrepreneur from Moscow',
//       image: 'https://i.pravatar.cc/150?img=1',
//       isVerified: true,
//       dateOfBirth: new Date('1990-01-15'),
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//       vibes: getRandomJVibes()
//     },
//     {
//       name: 'Anna Petrova',
//       email: 'anna@example.com',
//       username: 'anna_spb',
//       password: hashedPassword,
//       bio: 'Artist and photographer',
//       image: 'https://i.pravatar.cc/150?img=2',
//       isVerified: true,
//       dateOfBirth: new Date('1992-03-20'),
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//       vibes: getRandomJVibes()
//     },
//     {
//       name: 'John Smith',
//       email: 'john@example.com',
//       username: 'john_nyc',
//       password: hashedPassword,
//       bio: 'Software engineer and fitness enthusiast',
//       image: 'https://i.pravatar.cc/150?img=3',
//       isVerified: true,
//       dateOfBirth: new Date('1988-07-10'),
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//       vibes: getRandomJVibes()
//     },
//     {
//       name: 'Sarah Williams',
//       email: 'sarah@example.com',
//       username: 'sarah_brooklyn',
//       password: hashedPassword,
//       bio: 'Marketing consultant and yoga teacher',
//       image: 'https://i.pravatar.cc/150?img=4',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//       vibes: getRandomJVibes()
//     },
//     {
//       name: 'Budi Santoso',
//       email: 'budi@example.com',
//       username: 'budi_jakarta',
//       password: hashedPassword,
//       bio: 'Entrepreneur and food lover',
//       image: 'https://i.pravatar.cc/150?img=5',
//       isVerified: true,
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//       vibes: getRandomJVibes()
//     },
//     {
//       name: 'Siti Nurhaliza',
//       email: 'siti@example.com',
//       username: 'siti_jkt',
//       password: hashedPassword,
//       bio: 'Designer and creative director',
//       image: 'https://i.pravatar.cc/150?img=6',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Vladimir Sokolov',
//       email: 'vladimir@example.com',
//       username: 'vladimir_msk',
//       password: hashedPassword,
//       bio: 'Music producer and DJ',
//       image: 'https://i.pravatar.cc/150?img=7',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Emily Chen',
//       email: 'emily@example.com',
//       username: 'emily_manhattan',
//       password: hashedPassword,
//       bio: 'Investment banker and marathon runner',
//       image: 'https://i.pravatar.cc/150?img=8',
//       isVerified: true,
//       dateOfBirth: new Date('1991-11-05'),
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Rina Wijaya',
//       email: 'rina@example.com',
//       username: 'rina_jakarta',
//       password: hashedPassword,
//       bio: 'Travel blogger and content creator',
//       image: 'https://i.pravatar.cc/150?img=9',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Michael Brown',
//       email: 'michael@example.com',
//       username: 'michael_queens',
//       password: hashedPassword,
//       bio: 'Architect and urban planner',
//       image: 'https://i.pravatar.cc/150?img=10',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Olga Kuznetsova',
//       email: 'olga@example.com',
//       username: 'olga_moscow',
//       password: hashedPassword,
//       bio: 'Fashion designer and stylist',
//       image: 'https://i.pravatar.cc/150?img=11',
//       isVerified: true,
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'David Lee',
//       email: 'david@example.com',
//       username: 'david_nyc',
//       password: hashedPassword,
//       bio: 'Chef and restaurant owner',
//       image: 'https://i.pravatar.cc/150?img=12',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Andi Wijaya',
//       email: 'andi@example.com',
//       username: 'andi_tangerang',
//       password: hashedPassword,
//       bio: 'Graphic designer and illustrator',
//       image: 'https://i.pravatar.cc/150?img=13',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Lisa Johnson',
//       email: 'lisa@example.com',
//       username: 'lisa_brooklyn',
//       password: hashedPassword,
//       bio: 'Writer and book editor',
//       image: 'https://i.pravatar.cc/150?img=14',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Igor Volkov',
//       email: 'igor@example.com',
//       username: 'igor_spb',
//       password: hashedPassword,
//       bio: 'Professional photographer',
//       image: 'https://i.pravatar.cc/150?img=15',
//       isVerified: true,
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Maya Putri',
//       email: 'maya@example.com',
//       username: 'maya_depok',
//       password: hashedPassword,
//       bio: 'Yoga instructor and wellness coach',
//       image: 'https://i.pravatar.cc/150?img=16',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'James Wilson',
//       email: 'james@example.com',
//       username: 'james_manhattan',
//       password: hashedPassword,
//       bio: 'Data scientist and AI researcher',
//       image: 'https://i.pravatar.cc/150?img=17',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Ekaterina Smirnova',
//       email: 'ekaterina@example.com',
//       username: 'kate_moscow',
//       password: hashedPassword,
//       bio: 'Startup founder and mentor',
//       image: 'https://i.pravatar.cc/150?img=18',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Rachel Green',
//       email: 'rachel@example.com',
//       username: 'rachel_nyc',
//       password: hashedPassword,
//       bio: 'Fashion buyer and influencer',
//       image: 'https://i.pravatar.cc/150?img=19',
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//     {
//       name: 'Ahmad Rizki',
//       email: 'ahmad@example.com',
//       username: 'ahmad_bekasi',
//       password: hashedPassword,
//       bio: 'Personal trainer and nutritionist',
//       image: 'https://i.pravatar.cc/150?img=20',
//       isVerified: true,
//       joinReasons: getRandomJoinReasons(),
//       onboardingCompleted: true,
//     },
//   ]

//   const users = await Promise.all(
//     userData.map((data) =>
//       prisma.user.create({
//         data,
//       })
//     )
//   )

//   console.log(`✅ Created ${users.length} users`)
//   console.log('\n📝 Test User Credentials:')
//   console.log('========================')
//   console.log('All users have the same password')
//   console.log(`Password: ${DEFAULT_PASSWORD}`)
//   console.log('========================\n')

//   // ============================================
//   // CREATE USER COORDINATES
//   // ============================================
//   console.log('📍 Creating user coordinates...')
//   for (let i = 0; i < users.length; i++) {
//     const locationData = ALL_LOCATIONS[i % ALL_LOCATIONS.length];

//     await prisma.userCoordinates.create({
//       data: {
//         userId: users[i].id,
//         latitude: locationData.lat,
//         longitude: locationData.lng,
//         city: locationData.city,
//         district: locationData.district,
//         province: locationData.province,
//         country: locationData.country,
//         source: 'manual',
//       },
//     });
//   }
//   console.log(`✅ Created coordinates for ${users.length} users\n`)

//   // ============================================
//   // CREATE USER HANGOUT PLACES
//   // ============================================
//   console.log('🏢 Creating user hangout places...')
//   for (let i = 0; i < users.length; i++) {
//     // Each user gets 1-3 hangout places
//     const placeCount = Math.floor(Math.random() * 3) + 1;
//     const shuffledPlaces = [...ALL_HANGOUT_PLACES].sort(() => 0.5 - Math.random());

//     for (let j = 0; j < placeCount; j++) {
//       const place = shuffledPlaces[j];

//       await prisma.userHangoutPlace.create({
//         data: {
//           userId: users[i].id,
//           placeName: place.name,
//           placeType: place.type as any,
//           latitude: place.lat,
//           longitude: place.lng,
//           address: place.address,
//           city: place.city,
//           isPrimary: j === 0, // First place is primary
//           visitFrequency: j === 0 ? 'daily' : (j === 1 ? 'weekly' : 'monthly'),
//         },
//       });
//     }
//   }
//   console.log(`✅ Created hangout places for ${users.length} users\n`)

//   // // ============================================
//   // // CREATE DAILY MOODS
//   // // ============================================
//   // console.log('😊 Creating daily moods...')
//   // const today = new Date();
//   // today.setHours(0, 0, 0, 0);

//   // for (let i = 0; i < users.length; i++) {
//   //   const mood = MOOD_TYPES[i % MOOD_TYPES.length];
//   //   const energy = Math.floor(Math.random() * 5) + 5; // 5-10
//   //   const sociable = Math.floor(Math.random() * 5) + 5; // 5-10

//   //   await prisma.dailyMood.create({
//   //     data: {
//   //       userId: users[i].id,
//   //       date: today,
//   //       mood: mood,
//   //       energy: energy,
//   //       sociable: sociable,
//   //       reasons: i % 3 === 0 
//   //         ? ['make new friends', 'try something new'] 
//   //         : (i % 2 === 0 ? ['explore city', 'attend events'] : ['relax', 'have fun']),
//   //       source: 'manual',
//   //     },
//   //   });
//   // }
//   // console.log(`✅ Created moods for ${users.length} users\n`)

//   // ============================================
//   // CREATE INTERESTS (WITH CATEGORIES & ICONS)
//   // ============================================
//   console.log('💡 Creating interests...')

//   const interests = await Promise.all(
//     INTERESTS_DATA.map((data, index) =>
//       prisma.interest.create({
//         data: {
//           name: data.name,
//           slug: data.slug,
//           category: data.category as any,
//           icon: data.icon,
//           order: index,
//         },
//       })
//     )
//   )
//   console.log(`✅ Created ${interests.length} interests\n`)

//   // ============================================
//   // ASSIGN INTERESTS TO USERS
//   // ============================================
//   console.log('🔗 Assigning interests to users...')

//   // Each user gets 3-5 random interests
//   for (const user of users) {
//     const interestCount = Math.floor(Math.random() * 3) + 3; // 3-5
//     const shuffledInterests = [...interests].sort(() => 0.5 - Math.random());
//     const selectedInterests = shuffledInterests.slice(0, interestCount);

//     await Promise.all(
//       selectedInterests.map((interest) =>
//         prisma.userInterest.create({
//           data: {
//             userId: user.id,
//             interestId: interest.id,
//           },
//         })
//       )
//     );
//   }
//   console.log('✅ Assigned interests to users\n')

//   // ============================================
//   // CREATE COMMUNITIES
//   // ============================================
//   console.log('🏘️ Creating communities...')
//   const communityData = [
//     {
//       name: 'Tech Innovators',
//       description: 'A global community for technology enthusiasts and innovators',
//     },
//     {
//       name: 'Fitness Warriors',
//       description: 'Get fit together with our active community across cities',
//     },
//     {
//       name: 'Creative Minds',
//       description: 'Artists, designers, and creative professionals unite',
//     },
//     {
//       name: 'Music Lovers',
//       description: 'For those who live and breathe music',
//     },
//     {
//       name: 'Foodies Network',
//       description: 'Explore culinary adventures together',
//     },
//     {
//       name: 'Adventure Seekers',
//       description: 'Travel and outdoor activities enthusiasts',
//     },
//     {
//       name: 'Book Club International',
//       description: 'Monthly book discussions and literary events',
//     },
//     {
//       name: 'Startup Founders',
//       description: 'Network with fellow entrepreneurs worldwide',
//     },
//   ]

//   const communities = await Promise.all(
//     communityData.map((data) =>
//       prisma.community.create({
//         data,
//       })
//     )
//   )
//   console.log(`✅ Created ${communities.length} communities\n`)

//   // ============================================
//   // ASSIGN USERS TO COMMUNITIES
//   // ============================================
//   console.log('🔗 Assigning users to communities...')

//   // Each user joins 1-3 communities
//   for (const user of users) {
//     const communityCount = Math.floor(Math.random() * 3) + 1; // 1-3
//     const shuffledCommunities = [...communities].sort(() => 0.5 - Math.random());
//     const selectedCommunities = shuffledCommunities.slice(0, communityCount);

//     await Promise.all(
//       selectedCommunities.map((community) =>
//         prisma.userCommunity.create({
//           data: {
//             userId: user.id,
//             communityId: community.id,
//           },
//         })
//       )
//     );
//   }
//   console.log('✅ Assigned users to communities\n')

//   // ============================================
//   // CREATE PLACES (MIXED LOCATIONS)
//   // ============================================
//   console.log('📍 Creating places...')
//   const placesData = [
//     // Moscow Places
//     { name: 'PowerHouse Gym Moscow', address: 'Tverskaya St, 15', type: 'gym' as const, latitude: 55.7615, longitude: 37.6082, city: 'Moscow', district: 'Tverskoy' },
//     { name: 'Gorky Park', address: 'Krymsky Val, 9', type: 'park' as const, latitude: 55.7280, longitude: 37.6010, city: 'Moscow', district: 'Khamovniki' },
//     { name: 'Red October Bar', address: 'Bersenevskaya Emb, 6', type: 'bar' as const, latitude: 55.7446, longitude: 37.6106, city: 'Moscow', district: 'Zamoskvorechye' },

//     // Jakarta Places
//     { name: 'Fitness First Senayan', address: 'Jl. Asia Afrika, Senayan', type: 'gym' as const, latitude: -6.2188, longitude: 106.8019, city: 'Jakarta Pusat', district: 'Tanah Abang' },
//     { name: 'Taman Suropati', address: 'Jl. Taman Suropati, Menteng', type: 'park' as const, latitude: -6.1924, longitude: 106.8368, city: 'Jakarta Pusat', district: 'Menteng' },
//     { name: 'SKYE Bar & Restaurant', address: 'Jl. MH Thamrin No.1', type: 'bar' as const, latitude: -6.2088, longitude: 106.8456, city: 'Jakarta Pusat', district: 'Menteng' },

//     // New York Places
//     { name: 'Equinox Broadway', address: '897 Broadway', type: 'gym' as const, latitude: 40.7614, longitude: -73.9776, city: 'New York', district: 'Manhattan' },
//     { name: 'Central Park', address: 'Central Park West', type: 'park' as const, latitude: 40.7829, longitude: -73.9654, city: 'New York', district: 'Manhattan' },
//     { name: 'The Rooftop at Pier 17', address: '89 South Street', type: 'bar' as const, latitude: 40.7071, longitude: -74.0032, city: 'New York', district: 'Manhattan' },

//     // Cafes & Restaurants (Mixed)
//     { name: 'Coffee Mania Moscow', address: 'Bolshaya Dmitrovka, 32', type: 'cafe' as const, latitude: 55.7641, longitude: 37.6172, city: 'Moscow', district: 'Tverskoy' },
//     { name: 'Anomali Coffee Jakarta', address: 'Jl. Senopati Raya No.71', type: 'cafe' as const, latitude: -6.2425, longitude: 106.7983, city: 'Jakarta Selatan', district: 'Kebayoran Baru' },
//     { name: 'Blue Bottle Coffee NYC', address: '450 W 15th St', type: 'cafe' as const, latitude: 40.7438, longitude: -74.0065, city: 'New York', district: 'Manhattan' },

//     { name: 'White Rabbit Moscow', address: 'Smolenskaya Square, 3', type: 'restaurant' as const, latitude: 55.7490, longitude: 37.5828, city: 'Moscow', district: 'Arbat' },
//     { name: 'Plataran Menteng', address: 'Jl. HOS Cokroaminoto No.78', type: 'restaurant' as const, latitude: -6.1924, longitude: 106.8300, city: 'Jakarta Pusat', district: 'Menteng' },
//     { name: 'Carbone NYC', address: '181 Thompson St', type: 'restaurant' as const, latitude: 40.7285, longitude: -74.0015, city: 'New York', district: 'Manhattan' },
//   ]

//   const places = await Promise.all(
//     placesData.map((data) =>
//       prisma.place.create({
//         data,
//       })
//     )
//   )
//   console.log(`✅ Created ${places.length} places\n`)

//   // Summary
//   console.log('📊 Seed Summary:')
//   console.log('==================')
//   console.log(`👥 Users: ${users.length}`)
//   console.log(`📍 User Coordinates: ${users.length}`)
//   console.log(`🏢 User Hangout Places: ${users.length * 2} (avg)`)
//   console.log(`😊 Daily Moods: ${users.length}`)
//   console.log(`💡 Interests: ${interests.length} (with categories)`)
//   console.log(`🏘️ Communities: ${communities.length}`)
//   console.log(`📍 Places: ${places.length}`)
//   console.log('==================')
//   console.log('\n✨ Seed completed successfully!')
//   console.log('\n🌍 Locations included:')
//   console.log('- 🇷🇺 Moscow & Saint Petersburg')
//   console.log('- 🇮🇩 Jakarta & surrounding areas')
//   console.log('- 🇺🇸 New York & New Jersey')
//   console.log('\n💡 Next steps:')
//   console.log('- Test profile setup flow')
//   console.log('- Implement matching algorithm')
//   console.log('- Create place/event recommendations')
// }

// main()
//   .catch((e) => {
//     console.error('❌ Error seeding database:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

import bcrypt from 'bcrypt';
import { PrismaClient, JoinReason, VibeType, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'Password123!';
const saltRounds = 10;

async function main() {
  console.log('🌱 Starting SPB-only seed...');

  // Clean SPB-related data
  await prisma.eventRecommendation.deleteMany();
  await prisma.placeRecommendation.deleteMany();
  await prisma.userHangoutPlace.deleteMany();
  await prisma.userCoordinates.deleteMany();
  await prisma.userMatch.deleteMany();
  await prisma.userEvent.deleteMany();
  await prisma.userCommunity.deleteMany();
  await prisma.event.deleteMany();
  await prisma.place.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds);

  // ===== USERS =====
  const usersData = [
    { name: 'Ivan Petrov', email: 'ivan@spb.ru', username: 'ivan_spb', bio: 'Yoga lover', image: 'https://i.pravatar.cc/150?img=1', isVerified: true, dateOfBirth: new Date('1990-05-12'), joinReasons: [JoinReason.FIND_HOBBY_COMMUNITY], onboardingCompleted: true, vibes: [VibeType.cozy, VibeType.active] },
    { name: 'Olga Smirnova', email: 'olga@spb.ru', username: 'olga_spb', bio: 'Runner and fitness enthusiast', image: 'https://i.pravatar.cc/150?img=2', isVerified: true, dateOfBirth: new Date('1992-07-21'), joinReasons: [JoinReason.FIND_ACTIVITY_PARTNERS], onboardingCompleted: true, vibes: [VibeType.energetic] },
    { name: 'Dmitry Sokolov', email: 'dmitry@spb.ru', username: 'dmitry_spb', bio: 'Paddle sports fan', image: 'https://i.pravatar.cc/150?img=3', isVerified: true, dateOfBirth: new Date('1988-11-03'), joinReasons: [JoinReason.EXPLORE_CITY], onboardingCompleted: true, vibes: [VibeType.adventurous] },
    { name: 'Anna Volkova', email: 'anna@spb.ru', username: 'anna_spb', bio: 'Tennis player and coach', image: 'https://i.pravatar.cc/150?img=4', isVerified: true, dateOfBirth: new Date('1995-02-18'), joinReasons: [JoinReason.TRY_NEW_EXPERIENCES], onboardingCompleted: true, vibes: [VibeType.active] },
    { name: 'Sergey Ivanovich', email: 'sergey@spb.ru', username: 'sergey_spb', bio: 'Community organizer', image: 'https://i.pravatar.cc/150?img=5', isVerified: true, dateOfBirth: new Date('1991-09-30'), joinReasons: [JoinReason.MAKE_FRIENDS], onboardingCompleted: true, vibes: [VibeType.cozy, VibeType.social] },
  ];

  const users = await Promise.all(
    usersData.map((data) => prisma.user.create({ data: { ...data, password: hashedPassword } }))
  );

  // ===== USER COORDINATES =====
  const SPB_COORDS = [
    { city: 'Saint Petersburg', district: 'Admiralteysky', province: 'Leningrad Oblast', country: 'Russia', lat: 59.9311, lng: 30.3609 },
    { city: 'Saint Petersburg', district: 'Vasileostrovsky', province: 'Leningrad Oblast', country: 'Russia', lat: 59.9420, lng: 30.2730 },
  ];

  for (let i = 0; i < users.length; i++) {
    const loc = SPB_COORDS[i % SPB_COORDS.length];
    await prisma.userCoordinates.create({
      data: {
        userId: users[i].id,
        latitude: loc.lat,
        longitude: loc.lng,
        city: loc.city,
      },
    });
  }

  // ===== COMMUNITIES =====
  const communityData = [
    { name: 'SPB Yoga Community', description: 'Yoga enthusiasts in Saint Petersburg' },
    { name: 'SPB Runners', description: 'Running events and groups in SPB' },
    { name: 'SPB Paddle Club', description: 'Paddle sports lovers' },
    { name: 'SPB Tennis League', description: 'Tennis players and coaching events' },
    { name: 'SPB Wellness Circle', description: 'Wellness and active lifestyle community' },
  ];

  const communities = await Promise.all(
    communityData.map((data) => prisma.community.create({ data }))
  );

  // ===== ASSIGN USERS TO COMMUNITIES =====
  for (let i = 0; i < users.length; i++) {
    const community = communities[i % communities.length];
    await prisma.userCommunity.create({ data: { userId: users[i].id, communityId: community.id } });
  }

// ===== PLACES (SPB) =====
const placesData = [
  { name: 'Yoga Center SPB', address: 'Nevsky Prospekt 10', type: PlaceType.gym, latitude: 59.9310, longitude: 30.3600, city: 'Saint Petersburg', district: 'Admiralteysky' },
  { name: 'SPB Running Track', address: 'Kamennoostrovsky 20', type: PlaceType.park, latitude: 59.9390, longitude: 30.3100, city: 'Saint Petersburg', district: 'Vasileostrovsky' },

  // новые места
  { name: 'Coffee Time', address: 'Ligovsky Prospekt 50', type: PlaceType.cafe, latitude: 59.9285, longitude: 30.3400, city: 'Saint Petersburg', district: 'Tsentralny' },
  { name: 'Bean & Brew', address: 'Nevsky Prospekt 75', type: PlaceType.cafe, latitude: 59.9340, longitude: 30.3600, city: 'Saint Petersburg', district: 'Admiralteysky' },
  { name: 'Golden Plate', address: 'Bolshaya Morskaya 12', type: PlaceType.restaurant, latitude: 59.9330, longitude: 30.3400, city: 'Saint Petersburg', district: 'Admiralteysky' },
  { name: 'Riverside Dine', address: 'Petrovskaya Naberezhnaya 18', type: PlaceType.restaurant, latitude: 59.9350, longitude: 30.3200, city: 'Saint Petersburg', district: 'Vasileostrovsky' },
  { name: 'Central Cafe', address: 'Sadovaya Street 30', type: PlaceType.cafe, latitude: 59.9315, longitude: 30.3550, city: 'Saint Petersburg', district: 'Tsentralny' },
];

// создание всех мест
const places = await Promise.all(
  placesData.map((data) => prisma.place.create({ data }))
);
  // ===== EVENTS =====
  const now = new Date();
  const eventsData = [
    { name: 'Morning Yoga SPB', description: 'Start your day with yoga', date: new Date(now.getTime() + 86400000), placeId: places[0].id, communityId: communities[0].id, vibes: ['cozy', 'active'] },
    { name: 'SPB City Run', description: 'Join our city running group', date: new Date(now.getTime() + 2*86400000), placeId: places[1].id, communityId: communities[1].id, vibes: ['energetic'] },
    { name: 'Paddle Meetup', description: 'Paddle with local enthusiasts', date: new Date(now.getTime() + 3*86400000), placeId: places[1].id, communityId: communities[2].id, vibes: ['adventurous'] },
    { name: 'Tennis Training SPB', description: 'Weekly tennis sessions', date: new Date(now.getTime() + 4*86400000), placeId: places[1].id, communityId: communities[3].id, vibes: ['active'] },
    { name: 'Wellness Weekend', description: 'Mindfulness and yoga', date: new Date(now.getTime() + 5*86400000), placeId: places[0].id, communityId: communities[4].id, vibes: ['cozy', 'social'] },
  ];

  await Promise.all(eventsData.map((data) => prisma.event.create({ data })));

  console.log('✅ SPB seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

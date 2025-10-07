import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default password untuk semua test users
const DEFAULT_PASSWORD = 'Password123!'
const saltRounds = 10

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data (in correct order to avoid FK constraints)
  console.log('🧹 Cleaning existing data...')
  await prisma.userMatch.deleteMany()
  await prisma.userInterest.deleteMany()
  await prisma.userEvent.deleteMany()
  await prisma.userCommunity.deleteMany()
  await prisma.promo.deleteMany()
  await prisma.event.deleteMany()
  await prisma.interest.deleteMany()
  await prisma.place.deleteMany()
  await prisma.community.deleteMany()
  await prisma.user.deleteMany()

  // Hash password
  console.log('🔐 Hashing default password...')
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds)
  console.log('✅ Password hashed')

  // Create Users
  console.log('👥 Creating users...')

  const userData = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: hashedPassword,
      bio: 'Tech enthusiast and fitness lover',
      location: 'New York, USA',
      image: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
      dateOfBirth: new Date('1990-01-15'),
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      password: hashedPassword,
      bio: 'Music producer and community organizer',
      location: 'Los Angeles, USA',
      image: 'https://i.pravatar.cc/150?img=2',
      isVerified: true,
      dateOfBirth: new Date('1990-01-15'),
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      bio: 'Platform administrator',
      location: 'San Francisco, USA',
      image: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      username: 'alicejohnson',
      password: hashedPassword,
      bio: 'Yoga instructor and wellness coach',
      location: 'Miami, USA',
      image: 'https://i.pravatar.cc/150?img=4',
    },
    {
      name: 'Bob Williams',
      email: 'bob@example.com',
      username: 'bobwilliams',
      password: hashedPassword,
      bio: 'Professional photographer',
      location: 'Seattle, USA',
      image: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Carol Martinez',
      email: 'carol@example.com',
      username: 'carolmartinez',
      password: hashedPassword,
      bio: 'Chef and food blogger',
      location: 'Austin, USA',
      image: 'https://i.pravatar.cc/150?img=6',
    },
    {
      name: 'David Brown',
      email: 'david@example.com',
      username: 'davidbrown',
      password: hashedPassword,
      bio: 'Software engineer and gamer',
      location: 'Boston, USA',
      image: 'https://i.pravatar.cc/150?img=7',
    },
    {
      name: 'Emma Davis',
      email: 'emma@example.com',
      username: 'emmadavis',
      password: hashedPassword,
      bio: 'Travel blogger and adventure seeker',
      location: 'Denver, USA',
      image: 'https://i.pravatar.cc/150?img=8',
    },
    {
      name: 'Frank Miller',
      email: 'frank@example.com',
      username: 'frankmiller',
      password: hashedPassword,
      bio: 'Artist and graphic designer',
      location: 'Portland, USA',
      image: 'https://i.pravatar.cc/150?img=9',
      isVerified: true,
      dateOfBirth: new Date('1990-01-15'),
    },
    {
      name: 'Grace Wilson',
      email: 'grace@example.com',
      username: 'gracewilson',
      password: hashedPassword,
      bio: 'Personal trainer and nutrition expert',
      location: 'Chicago, USA',
      image: 'https://i.pravatar.cc/150?img=10',
      isVerified: true,
      dateOfBirth: new Date('1990-01-15'),
    },
    {
      name: 'Henry Moore',
      email: 'henry@example.com',
      username: 'henrymoore',
      password: hashedPassword,
      bio: 'Entrepreneur and startup advisor',
      location: 'San Diego, USA',
      image: 'https://i.pravatar.cc/150?img=11',
    },
    {
      name: 'Ivy Taylor',
      email: 'ivy@example.com',
      username: 'ivytaylor',
      password: hashedPassword,
      bio: 'Book lover and literature teacher',
      location: 'Philadelphia, USA',
      image: 'https://i.pravatar.cc/150?img=12',
    },
    {
      name: 'Jack Anderson',
      email: 'jack@example.com',
      username: 'jackanderson',
      password: hashedPassword,
      bio: 'DJ and music producer',
      location: 'Las Vegas, USA',
      image: 'https://i.pravatar.cc/150?img=13',
    },
    {
      name: 'Karen Thomas',
      email: 'karen@example.com',
      username: 'karenthomas',
      password: hashedPassword,
      bio: 'Meditation teacher and mindfulness coach',
      location: 'Santa Fe, USA',
      image: 'https://i.pravatar.cc/150?img=14',
    },
    {
      name: 'Leo Jackson',
      email: 'leo@example.com',
      username: 'leojackson',
      password: hashedPassword,
      bio: 'Sports enthusiast and coach',
      location: 'Dallas, USA',
      image: 'https://i.pravatar.cc/150?img=15',
    },
    {
      name: 'Mia White',
      email: 'mia@example.com',
      username: 'miawhite',
      password: hashedPassword,
      bio: 'Fashion designer and stylist',
      location: 'Atlanta, USA',
      image: 'https://i.pravatar.cc/150?img=16',
    },
    {
      name: 'Noah Harris',
      email: 'noah@example.com',
      username: 'noahharris',
      password: hashedPassword,
      bio: 'Data scientist and AI researcher',
      location: 'San Jose, USA',
      image: 'https://i.pravatar.cc/150?img=17',
    },
    {
      name: 'Olivia Martin',
      email: 'olivia@example.com',
      username: 'oliviamartin',
      password: hashedPassword,
      bio: 'Marketing consultant and brand strategist',
      location: 'Nashville, USA',
      image: 'https://i.pravatar.cc/150?img=18',
    },
    {
      name: 'Paul Thompson',
      email: 'paul@example.com',
      username: 'paulthompson',
      password: hashedPassword,
      bio: 'Film director and screenwriter',
      location: 'Los Angeles, USA',
      image: 'https://i.pravatar.cc/150?img=19',
    },
    {
      name: 'Quinn Garcia',
      email: 'quinn@example.com',
      username: 'quinngarcia',
      password: hashedPassword,
      bio: 'Environmental activist and sustainability expert',
      location: 'Portland, USA',
      image: 'https://i.pravatar.cc/150?img=20',
    },
  ]

  const users = await Promise.all(
    userData.map((data) =>
      prisma.user.create({
        data,
      })
    )
  )

  console.log(`✅ Created ${users.length} users`)
  console.log('\n📝 Test User Credentials:')
  console.log('========================')
  console.log('All users have the same password')
  console.log(`Password: ${DEFAULT_PASSWORD}`)
  console.log('========================\n')

  // Create Interests
  console.log('💡 Creating interests...')
  const interestNames = [
    'Fitness',
    'Yoga',
    'Music',
    'Dancing',
    'Technology',
    'Gaming',
    'Photography',
    'Cooking',
    'Travel',
    'Reading',
    'Art',
    'Sports',
    'Meditation',
    'Entrepreneurship',
    'Networking',
  ]

  const interests = await Promise.all(
    interestNames.map((name) =>
      prisma.interest.create({
        data: { name },
      })
    )
  )
  console.log(`✅ Created ${interests.length} interests`)

  // Assign interests to users (manual mapping)
  console.log('🔗 Assigning interests to users...')
  const userInterestMapping = [
    { userId: users[0].id, interestIds: [0, 4, 14] }, // John: Fitness, Tech, Networking
    { userId: users[1].id, interestIds: [2, 10, 14] }, // Jane: Music, Art, Networking
    { userId: users[2].id, interestIds: [4, 13, 14] }, // Admin: Tech, Entrepreneurship, Networking
    { userId: users[3].id, interestIds: [0, 1, 12] }, // Alice: Fitness, Yoga, Meditation
    { userId: users[4].id, interestIds: [6, 8, 10] }, // Bob: Photography, Travel, Art
    { userId: users[5].id, interestIds: [7, 14, 8] }, // Carol: Cooking, Networking, Travel
    { userId: users[6].id, interestIds: [4, 5, 14] }, // David: Tech, Gaming, Networking
    { userId: users[7].id, interestIds: [8, 6, 14] }, // Emma: Travel, Photography, Networking
    { userId: users[8].id, interestIds: [10, 6, 4] }, // Frank: Art, Photography, Tech
    { userId: users[9].id, interestIds: [0, 11, 1] }, // Grace: Fitness, Sports, Yoga
    { userId: users[10].id, interestIds: [13, 4, 14] }, // Henry: Entrepreneurship, Tech, Networking
    { userId: users[11].id, interestIds: [9, 10, 8] }, // Ivy: Reading, Art, Travel
    { userId: users[12].id, interestIds: [2, 3, 14] }, // Jack: Music, Dancing, Networking
    { userId: users[13].id, interestIds: [1, 12, 0] }, // Karen: Yoga, Meditation, Fitness
    { userId: users[14].id, interestIds: [11, 0, 14] }, // Leo: Sports, Fitness, Networking
    { userId: users[15].id, interestIds: [10, 6, 2] }, // Mia: Art, Photography, Music
    { userId: users[16].id, interestIds: [4, 5, 13] }, // Noah: Tech, Gaming, Entrepreneurship
    { userId: users[17].id, interestIds: [14, 4, 10] }, // Olivia: Networking, Tech, Art
    { userId: users[18].id, interestIds: [10, 2, 6] }, // Paul: Art, Music, Photography
    { userId: users[19].id, interestIds: [8, 14, 13] }, // Quinn: Travel, Networking, Entrepreneurship
  ]

  for (const mapping of userInterestMapping) {
    await Promise.all(
      mapping.interestIds.map((idx) =>
        prisma.userInterest.create({
          data: {
            userId: mapping.userId,
            interestId: interests[idx].id,
          },
        })
      )
    )
  }
  console.log('✅ Assigned interests to users')

  // Create Communities
  console.log('🏘️ Creating communities...')
  const communityData = [
    {
      name: 'Tech Innovators',
      description: 'A community for technology enthusiasts and innovators',
    },
    {
      name: 'Fitness Warriors',
      description: 'Get fit together with our active community',
    },
    {
      name: 'Creative Minds',
      description: 'Artists, designers, and creative professionals unite',
    },
    {
      name: 'Music Lovers',
      description: 'For those who live and breathe music',
    },
    {
      name: 'Foodies Network',
      description: 'Explore culinary adventures together',
    },
    {
      name: 'Adventure Seekers',
      description: 'Travel and outdoor activities enthusiasts',
    },
    {
      name: 'Book Club Elite',
      description: 'Monthly book discussions and literary events',
    },
    {
      name: 'Startup Founders',
      description: 'Network with fellow entrepreneurs',
    },
  ]

  const communities = await Promise.all(
    communityData.map((data) =>
      prisma.community.create({
        data,
      })
    )
  )
  console.log(`✅ Created ${communities.length} communities`)

  // Assign users to communities
  console.log('🔗 Assigning users to communities...')
  const userCommunityMapping = [
    { userId: users[0].id, communityIds: [0, 1] }, // John: Tech, Fitness
    { userId: users[1].id, communityIds: [3, 2] }, // Jane: Music, Creative
    { userId: users[2].id, communityIds: [0, 7] }, // Admin: Tech, Startup
    { userId: users[3].id, communityIds: [1, 2] }, // Alice: Fitness, Creative
    { userId: users[4].id, communityIds: [2, 5] }, // Bob: Creative, Adventure
    { userId: users[5].id, communityIds: [4, 5] }, // Carol: Foodies, Adventure
    { userId: users[6].id, communityIds: [0, 7] }, // David: Tech, Startup
    { userId: users[7].id, communityIds: [5, 2] }, // Emma: Adventure, Creative
    { userId: users[8].id, communityIds: [2, 0] }, // Frank: Creative, Tech
    { userId: users[9].id, communityIds: [1, 2] }, // Grace: Fitness, Creative
    { userId: users[10].id, communityIds: [7, 0] }, // Henry: Startup, Tech
    { userId: users[11].id, communityIds: [6, 2] }, // Ivy: Book Club, Creative
    { userId: users[12].id, communityIds: [3, 2] }, // Jack: Music, Creative
    { userId: users[13].id, communityIds: [1, 2] }, // Karen: Fitness, Creative
    { userId: users[14].id, communityIds: [1, 7] }, // Leo: Fitness, Startup
    { userId: users[15].id, communityIds: [2, 3] }, // Mia: Creative, Music
    { userId: users[16].id, communityIds: [0, 7] }, // Noah: Tech, Startup
    { userId: users[17].id, communityIds: [7, 0] }, // Olivia: Startup, Tech
    { userId: users[18].id, communityIds: [2, 3] }, // Paul: Creative, Music
    { userId: users[19].id, communityIds: [5, 7] }, // Quinn: Adventure, Startup
  ]

  for (const mapping of userCommunityMapping) {
    await Promise.all(
      mapping.communityIds.map((idx) =>
        prisma.userCommunity.create({
          data: {
            userId: mapping.userId,
            communityId: communities[idx].id,
          },
        })
      )
    )
  }
  console.log('✅ Assigned users to communities')

  // Create Places
  console.log('📍 Creating places...')
  const placesData = [
    { name: 'PowerHouse Gym', address: '123 Fitness Ave, New York', type: 'gym' },
    { name: 'Yoga Studio Downtown', address: '456 Zen Street, Los Angeles', type: 'studio' },
    { name: 'The Music Lounge', address: '789 Beat Boulevard, Miami', type: 'club' },
    { name: 'TechHub Coworking', address: '321 Innovation Drive, San Francisco', type: 'cafe' },
    { name: 'Sunset Bar & Grill', address: '654 Ocean View, San Diego', type: 'bar' },
    { name: 'Green Leaf Cafe', address: '987 Organic Lane, Portland', type: 'cafe' },
    { name: 'Central Park', address: '111 Park Avenue, New York', type: 'park' },
    { name: 'Elite Fitness Center', address: '222 Health Street, Chicago', type: 'gym' },
    { name: 'Jazz Night Club', address: '333 Music Row, Nashville', type: 'club' },
    { name: 'Coffee & Code', address: '444 Tech Plaza, Austin', type: 'cafe' },
    { name: 'Italian Kitchen', address: '555 Pasta Street, Boston', type: 'restaurant' },
    { name: 'Sports Bar Downtown', address: '666 Game Street, Dallas', type: 'bar' },
    { name: 'Meditation Garden', address: '777 Peace Avenue, Santa Fe', type: 'park' },
    { name: 'Dance Studio Pro', address: '888 Rhythm Road, Las Vegas', type: 'studio' },
    { name: 'Brewery & Bistro', address: '999 Craft Lane, Denver', type: 'bar' },
  ]

  const places = await Promise.all(
    placesData.map((data) =>
      prisma.place.create({
        data,
      })
    )
  )
  console.log(`✅ Created ${places.length} places`)

  // Create Promos for places
  console.log('🎟️ Creating promos...')
  const promosData = [
    {
      placeId: places[0].id,
      title: '30% Off Annual Membership',
      discountCode: 'GYM2025',
      validUntil: new Date('2025-12-31'),
    },
    {
      placeId: places[1].id,
      title: 'First Class Free',
      discountCode: 'YOGA123',
      validUntil: new Date('2025-11-30'),
    },
    {
      placeId: places[2].id,
      title: 'Happy Hour 50% Off',
      discountCode: 'MUSIC50',
      validUntil: new Date('2025-12-15'),
    },
    {
      placeId: places[3].id,
      title: 'Student Discount 20%',
      discountCode: 'STUDENT20',
      validUntil: new Date('2026-06-30'),
    },
    {
      placeId: places[4].id,
      title: 'Weekend Special',
      discountCode: 'WEEKEND',
      validUntil: new Date('2025-10-31'),
    },
    {
      placeId: places[5].id,
      title: 'Buy 2 Get 1 Free',
      discountCode: 'COFFEE3',
      validUntil: new Date('2025-11-15'),
    },
    {
      placeId: places[7].id,
      title: 'Group Discount',
      discountCode: 'GROUP10',
      validUntil: new Date('2025-12-20'),
    },
    {
      placeId: places[8].id,
      title: 'Early Bird Special',
      discountCode: 'EARLY25',
      validUntil: new Date('2025-12-10'),
    },
    {
      placeId: places[10].id,
      title: 'Family Dinner Deal',
      discountCode: 'FAMILY15',
      validUntil: new Date('2025-12-25'),
    },
    {
      placeId: places[14].id,
      title: 'Craft Beer Tasting',
      discountCode: 'BREW20',
      validUntil: new Date('2025-11-20'),
    },
  ]

  const promos = await Promise.all(
    promosData.map((data) =>
      prisma.promo.create({
        data,
      })
    )
  )
  console.log(`✅ Created ${promos.length} promos`)

  // Create Events
  console.log('🎉 Creating events...')
  const eventsData = [
    {
      name: 'Tech Networking Night',
      description: 'Meet fellow tech enthusiasts and innovators',
      date: new Date('2025-11-15T18:00:00Z'),
      placeId: places[3].id,
      communityId: communities[0].id,
      banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    },
    {
      name: 'Morning Yoga Session',
      description: 'Start your day with energy and mindfulness',
      date: new Date('2025-11-10T08:00:00Z'),
      placeId: places[1].id,
      communityId: communities[1].id,
      banner: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    },
    {
      name: 'HIIT Workout Class',
      description: 'High intensity interval training for all levels',
      date: new Date('2025-11-12T17:00:00Z'),
      placeId: places[0].id,
      communityId: communities[1].id,
      banner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    },
    {
      name: 'Art Gallery Opening',
      description: 'Showcase of local artists and their work',
      date: new Date('2025-11-20T19:00:00Z'),
      placeId: places[9].id,
      communityId: communities[2].id,
      banner: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    },
    {
      name: 'Live Jazz Night',
      description: 'Enjoy live music and great vibes',
      date: new Date('2025-11-18T20:00:00Z'),
      placeId: places[8].id,
      communityId: communities[3].id,
      banner: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    },
    {
      name: 'Open Mic Night',
      description: 'Share your talent with the community',
      date: new Date('2025-11-22T19:30:00Z'),
      placeId: places[2].id,
      communityId: communities[3].id,
      banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    },
    {
      name: 'Cooking Workshop',
      description: 'Learn to cook authentic Italian dishes',
      date: new Date('2025-11-25T16:00:00Z'),
      placeId: places[10].id,
      communityId: communities[4].id,
      banner: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    },
    {
      name: 'Wine Tasting Evening',
      description: 'Sample fine wines from around the world',
      date: new Date('2025-11-28T18:30:00Z'),
      placeId: places[4].id,
      communityId: communities[4].id,
      banner: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    },
    {
      name: 'Hiking Adventure',
      description: 'Explore beautiful trails together',
      date: new Date('2025-11-16T09:00:00Z'),
      placeId: places[6].id,
      communityId: communities[5].id,
      banner: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    },
    {
      name: 'Photography Walk',
      description: 'Capture the beauty of the city',
      date: new Date('2025-11-17T10:00:00Z'),
      placeId: places[6].id,
      communityId: communities[5].id,
      banner: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    },
    {
      name: 'Book Discussion',
      description: 'Monthly book club meeting',
      date: new Date('2025-11-19T18:00:00Z'),
      placeId: places[5].id,
      communityId: communities[6].id,
      banner: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
    },
    {
      name: 'Author Meet & Greet',
      description: 'Meet bestselling author and get books signed',
      date: new Date('2025-11-21T17:00:00Z'),
      placeId: places[5].id,
      communityId: communities[6].id,
      banner: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    },
    {
      name: 'Startup Pitch Night',
      description: 'Present your startup idea to investors',
      date: new Date('2025-11-23T19:00:00Z'),
      placeId: places[3].id,
      communityId: communities[7].id,
      banner: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    },
    {
      name: 'Entrepreneurship Workshop',
      description: 'Learn from successful entrepreneurs',
      date: new Date('2025-11-26T18:00:00Z'),
      placeId: places[3].id,
      communityId: communities[7].id,
      banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    },
  ]

  const events = await Promise.all(
    eventsData.map((data) =>
      prisma.event.create({
        data,
      })
    )
  )
  console.log(`✅ Created ${events.length} events`)

  // Assign users to events
  console.log('🔗 Assigning users to events...')
  const userEventMapping = [
    { eventId: events[0].id, userIds: [0, 2, 6, 8, 10, 16] }, // Tech event
    { eventId: events[1].id, userIds: [3, 9, 13] }, // Yoga
    { eventId: events[2].id, userIds: [0, 3, 9, 14] }, // HIIT
    { eventId: events[3].id, userIds: [4, 8, 15, 18] }, // Art
    { eventId: events[4].id, userIds: [1, 12, 15, 18] }, // Jazz
    { eventId: events[5].id, userIds: [1, 12] }, // Open mic
    { eventId: events[6].id, userIds: [5, 7, 19] }, // Cooking
    { eventId: events[7].id, userIds: [5, 7] }, // Wine tasting
    { eventId: events[8].id, userIds: [4, 7, 19] }, // Hiking
    { eventId: events[9].id, userIds: [4, 7, 8] }, // Photography
    { eventId: events[10].id, userIds: [11] }, // Book discussion
    { eventId: events[11].id, userIds: [11] }, // Author meet
    { eventId: events[12].id, userIds: [2, 6, 10, 16, 17] }, // Pitch night
    { eventId: events[13].id, userIds: [2, 10, 17, 19] }, // Workshop
  ]

  for (const mapping of userEventMapping) {
    await Promise.all(
      mapping.userIds.map((idx) =>
        prisma.userEvent.create({
          data: {
            userId: users[idx].id,
            eventId: mapping.eventId,
          },
        })
      )
    )
  }
  console.log('✅ Assigned users to events')

  // Create User Matches (based on shared interests)
  console.log('💝 Creating user matches...')
  const matchesData = [
    { user1Id: users[0].id, user2Id: users[2].id, matchScore: 66.67 }, // John & Admin (Tech, Networking)
    { user1Id: users[0].id, user2Id: users[6].id, matchScore: 66.67 }, // John & David (Tech, Networking)
    { user1Id: users[3].id, user2Id: users[9].id, matchScore: 100.0 }, // Alice & Grace (Fitness, Yoga)
    { user1Id: users[3].id, user2Id: users[13].id, matchScore: 100.0 }, // Alice & Karen (Yoga, Meditation, Fitness)
    { user1Id: users[4].id, user2Id: users[8].id, matchScore: 66.67 }, // Bob & Frank (Photography, Art)
    { user1Id: users[1].id, user2Id: users[12].id, matchScore: 66.67 }, // Jane & Jack (Music, Networking)
    { user1Id: users[2].id, user2Id: users[10].id, matchScore: 100.0 }, // Admin & Henry (Tech, Entrepreneurship, Networking)
    { user1Id: users[6].id, user2Id: users[16].id, matchScore: 66.67 }, // David & Noah (Tech, Gaming)
    { user1Id: users[7].id, user2Id: users[19].id, matchScore: 66.67 }, // Emma & Quinn (Travel, Networking)
    { user1Id: users[10].id, user2Id: users[17].id, matchScore: 100.0 }, // Henry & Olivia (Entrepreneurship, Tech, Networking)
  ]

  const matches = await Promise.all(
    matchesData.map((data) =>
      prisma.userMatch.create({
        data,
      })
    )
  )
  console.log(`✅ Created ${matches.length} user matches`)

  // Summary
  console.log('\n📊 Seed Summary:')
  console.log('==================')
  console.log(`👥 Users: ${users.length}`)
  console.log(`💡 Interests: ${interests.length}`)
  console.log(`🏘️ Communities: ${communities.length}`)
  console.log(`📍 Places: ${places.length}`)
  console.log(`🎟️ Promos: ${promos.length}`)
  console.log(`🎉 Events: ${events.length}`)
  console.log(`💝 Matches: ${matches.length}`)
  console.log('==================')
  console.log('✨ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { Prisma } from '@prisma/client'

export const quizQuestions: Prisma.QuizQuestionCreateInput[] = [
  // 🏃 1. Lifestyle & Interests
  {
    title: 'What are your favorite ways to spend your free time?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Doing sports', icon: 'football-outline' },
        { label: 'Reading or learning', icon: 'book-outline' },
        { label: 'Watching movies', icon: 'film-outline' },
        { label: 'Hanging out with friends', icon: 'people-outline' },
        { label: 'Exploring new places', icon: 'airplane-outline' },
      ],
    },
  },
  {
    title: 'Which of these communities would you join first?',
    description: 'Pick one that sounds most fun to you',
    type: 'single',
    options: {
      create: [
        { label: 'Fitness group', icon: 'barbell-outline' },
        { label: 'Music lovers', icon: 'musical-notes-outline' },
        { label: 'Tech & Startups', icon: 'laptop-outline' },
        { label: 'Language exchange', icon: 'chatbubbles-outline' },
      ],
    },
  },
  {
    title: 'What type of content inspires you most?',
    description: 'Choose the vibe that motivates you',
    type: 'single',
    options: {
      create: [
        { label: 'Motivational stories', icon: 'flame-outline' },
        { label: 'Creative projects', icon: 'color-palette-outline' },
        { label: 'Community success stories', icon: 'ribbon-outline' },
        { label: 'Funny moments', icon: 'happy-outline' },
      ],
    },
  },
  {
    title: 'Which best describes your weekend mood?',
    description: 'Select what matches your vibe most weekends',
    type: 'single',
    options: {
      create: [
        { label: 'Party and nightlife', icon: 'wine-outline' },
        { label: 'Relax and chill', icon: 'cafe-outline' },
        { label: 'Outdoor adventure', icon: 'bicycle-outline' },
        { label: 'Work or learn something new', icon: 'laptop-outline' },
      ],
    },
  },
  {
    title: 'What kind of hobbies do you want to explore next?',
    description: 'Choose as many as you like',
    type: 'multiple',
    options: {
      create: [
        { label: 'Art & design', icon: 'brush-outline' },
        { label: 'Dance', icon: 'body-outline' },
        { label: 'Learn a new language', icon: 'globe-outline' },
        { label: 'Fitness & wellness', icon: 'fitness-outline' },
        { label: 'Volunteering', icon: 'heart-outline' },
      ],
    },
  },

  // 💬 2. Social Preferences
  {
    title: 'How do you usually meet new people?',
    description: 'Select your usual approach',
    type: 'single',
    options: {
      create: [
        { label: 'At local events', icon: 'calendar-outline' },
        { label: 'Through social apps', icon: 'phone-portrait-outline' },
        { label: 'Through friends', icon: 'people-outline' },
        { label: 'Random encounters', icon: 'compass-outline' },
      ],
    },
  },
  {
    title: 'What kind of people do you enjoy hanging out with?',
    description: 'Select all that fit your vibe',
    type: 'multiple',
    options: {
      create: [
        { label: 'Creative minds', icon: 'color-palette-outline' },
        { label: 'Sporty & energetic', icon: 'football-outline' },
        { label: 'Relaxed & easygoing', icon: 'beer-outline' },
        { label: 'Driven & ambitious', icon: 'rocket-outline' },
        { label: 'Funny & social', icon: 'happy-outline' },
      ],
    },
  },
  {
    title: 'When joining a community, what do you look for first?',
    description: 'Choose your top priority',
    type: 'single',
    options: {
      create: [
        { label: 'The vibe and people', icon: 'sparkles-outline' },
        { label: 'The type of events', icon: 'walk-outline' },
        { label: 'Location & convenience', icon: 'pin-outline' },
        { label: 'Discounts or perks', icon: 'pricetag-outline' },
      ],
    },
  },
  {
    title: 'Do you prefer small or large gatherings?',
    description: 'Pick one that feels most comfortable',
    type: 'single',
    options: {
      create: [
        { label: 'Small, intimate groups', icon: 'chatbubble-outline' },
        { label: 'Medium-sized meetups', icon: 'people-outline' },
        { label: 'Big social events', icon: 'megaphone-outline' },
      ],
    },
  },
  {
    title: 'How do you usually stay in touch with new friends?',
    description: 'Choose all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Chat or messages', icon: 'chatbubbles-outline' },
        { label: 'Phone or video calls', icon: 'call-outline' },
        { label: 'Meet in person', icon: 'cafe-outline' },
        { label: 'Through social media', icon: 'logo-instagram' },
      ],
    },
  },

  // 📅 3. Event Preferences
  {
    title: 'What type of events do you love attending?',
    description: 'Pick all that excite you',
    type: 'multiple',
    options: {
      create: [
        { label: 'Concerts & live shows', icon: 'musical-notes-outline' },
        { label: 'Sports events', icon: 'football-outline' },
        { label: 'Workshops', icon: 'school-outline' },
        { label: 'Food festivals', icon: 'restaurant-outline' },
        { label: 'Networking events', icon: 'briefcase-outline' },
      ],
    },
  },
  {
    title: 'How often do you attend events?',
    description: 'Choose one that matches your routine',
    type: 'single',
    options: {
      create: [
        { label: 'Every week', icon: 'calendar-outline' },
        { label: 'A few times a month', icon: 'time-outline' },
        { label: 'Rarely', icon: 'moon-outline' },
      ],
    },
  },
  {
    title: 'What is your favorite event vibe?',
    description: 'Pick one that fits your personality',
    type: 'single',
    options: {
      create: [
        { label: 'High energy & loud', icon: 'flame-outline' },
        { label: 'Relaxed & cozy', icon: 'cafe-outline' },
        { label: 'Learning & discussions', icon: 'school-outline' },
        { label: 'Networking & socializing', icon: 'people-outline' },
      ],
    },
  },
  {
    title: 'Would you attend solo or with friends?',
    description: 'Select your preference',
    type: 'single',
    options: {
      create: [
        { label: 'I enjoy going solo', icon: 'person-outline' },
        { label: 'With friends or group', icon: 'people-outline' },
        { label: 'Both, depends on event', icon: 'shuffle-outline' },
      ],
    },
  },
  {
    title: 'What motivates you to attend events?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'For fun', icon: 'happy-outline' },
        { label: 'To meet new people', icon: 'chatbubbles-outline' },
        { label: 'To learn something new', icon: 'book-outline' },
        { label: 'Exclusive deals or promos', icon: 'pricetag-outline' },
      ],
    },
  },

  // 🏙️ 4. Places & Hangouts
  {
    title: 'Where do you usually hang out?',
    description: 'Select your favorite places',
    type: 'multiple',
    options: {
      create: [
        { label: 'Cafes or coffee shops', icon: 'cafe-outline' },
        { label: 'Bars or pubs', icon: 'beer-outline' },
        { label: 'Gyms or fitness clubs', icon: 'fitness-outline' },
        { label: 'Parks or outdoor spots', icon: 'leaf-outline' },
        { label: 'Cinemas or theaters', icon: 'film-outline' },
      ],
    },
  },
  {
    title: 'What atmosphere do you prefer in a hangout spot?',
    description: 'Pick one that fits your style',
    type: 'single',
    options: {
      create: [
        { label: 'Calm and cozy', icon: 'moon-outline' },
        { label: 'Lively and social', icon: 'flame-outline' },
        { label: 'Romantic and chill', icon: 'heart-outline' },
        { label: 'Loud and energetic', icon: 'musical-notes-outline' },
      ],
    },
  },
  {
    title: 'Do you enjoy discovering new local places?',
    description: 'Choose one that fits best',
    type: 'single',
    options: {
      create: [
        { label: 'Always exploring', icon: 'compass-outline' },
        { label: 'Sometimes', icon: 'walk-outline' },
        { label: 'Rarely', icon: 'home-outline' },
      ],
    },
  },
  {
    title: 'Which of these places would you visit on a Friday night?',
    description: 'Pick your go-to spot',
    type: 'single',
    options: {
      create: [
        { label: 'Bar or pub', icon: 'beer-outline' },
        { label: 'Gym or activity center', icon: 'barbell-outline' },
        { label: 'Cinema', icon: 'film-outline' },
        { label: 'Local event or concert', icon: 'musical-notes-outline' },
      ],
    },
  },
  {
    title: 'What is your favorite type of venue to relax?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Beach', icon: 'sunny-outline' },
        { label: 'Mountains', icon: 'trail-sign-outline' },
        { label: 'Spa or wellness', icon: 'water-outline' },
        { label: 'Urban hangouts', icon: 'business-outline' },
      ],
    },
  },

  // 🎶 5. Entertainment & Culture
  {
    title: 'What kind of music events would you attend?',
    description: 'Pick all that you enjoy',
    type: 'multiple',
    options: {
      create: [
        { label: 'Live concerts', icon: 'musical-notes-outline' },
        { label: 'DJ nights', icon: 'headset-outline' },
        { label: 'Acoustic sessions', icon: 'guitar-outline' },
        { label: 'Music festivals', icon: 'sparkles-outline' },
        { label: 'Karaoke nights', icon: 'mic-outline' },
      ],
    },
  },
  {
    title: 'What type of movies do you enjoy most?',
    description: 'Choose your favorite genre',
    type: 'single',
    options: {
      create: [
        { label: 'Action', icon: 'flash-outline' },
        { label: 'Comedy', icon: 'happy-outline' },
        { label: 'Romance', icon: 'heart-outline' },
        { label: 'Documentary', icon: 'book-outline' },
      ],
    },
  },
  {
    title: 'Which cultural activities do you enjoy?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Art exhibitions', icon: 'color-palette-outline' },
        { label: 'Theater & drama', icon: 'ribbon-outline' },
        { label: 'Dance shows', icon: 'body-outline' },
        { label: 'Museums & history tours', icon: 'time-outline' },
      ],
    },
  },
  {
    title: 'How often do you go to concerts or cultural events?',
    description: 'Pick one option',
    type: 'single',
    options: {
      create: [
        { label: 'Regularly (monthly)', icon: 'calendar-outline' },
        { label: 'Sometimes', icon: 'time-outline' },
        { label: 'Rarely', icon: 'moon-outline' },
      ],
    },
  },
  {
    title: 'Would you rather watch or participate in creative events?',
    description: 'Select your preference',
    type: 'single',
    options: {
      create: [
        { label: 'I prefer watching', icon: 'eye-outline' },
        { label: 'I love participating', icon: 'hand-left-outline' },
        { label: 'Both equally', icon: 'shuffle-outline' },
      ],
    },
  },

  // 🍔 6. Food & Drink
  {
    title: 'What is your favorite hangout meal?',
    description: 'Select your comfort food',
    type: 'single',
    options: {
      create: [
        { label: 'Coffee & snacks', icon: 'cafe-outline' },
        { label: 'Street food', icon: 'fast-food-outline' },
        { label: 'Fine dining', icon: 'restaurant-outline' },
        { label: 'Healthy food', icon: 'leaf-outline' },
      ],
    },
  },
  {
    title: 'Do you enjoy food events or tastings?',
    description: 'Pick your level of interest',
    type: 'single',
    options: {
      create: [
        { label: 'Yes, I love them!', icon: 'happy-outline' },
        { label: 'Sometimes', icon: 'time-outline' },
        { label: 'Not really', icon: 'close-outline' },
      ],
    },
  },
  {
    title: 'Which of these best fits your drink style?',
    description: 'Select one',
    type: 'single',
    options: {
      create: [
        { label: 'Coffee lover', icon: 'cafe-outline' },
        { label: 'Tea person', icon: 'leaf-outline' },
        { label: 'Cocktail explorer', icon: 'wine-outline' },
        { label: 'Juice & smoothies', icon: 'water-outline' },
      ],
    },
  },
  {
    title: 'When you hang out, what matters most?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'The ambience', icon: 'sparkles-outline' },
        { label: 'Good food & drinks', icon: 'restaurant-outline' },
        { label: 'Music & vibe', icon: 'musical-notes-outline' },
        { label: 'Company & people', icon: 'people-outline' },
      ],
    },
  },
  {
    title: 'Would you try new cuisines if recommended by locals?',
    description: 'Choose your answer',
    type: 'single',
    options: {
      create: [
        { label: 'Absolutely!', icon: 'thumbs-up-outline' },
        { label: 'Maybe, depends on what it is', icon: 'help-outline' },
        { label: 'No, I stick to what I know', icon: 'close-outline' },
      ],
    },
  },

  // ❤️ 7. Motivation & Goals
  {
    title: 'Why did you join Vstrim?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'To meet new people', icon: 'chatbubbles-outline' },
        { label: 'To discover local places', icon: 'compass-outline' },
        { label: 'To join cool events', icon: 'calendar-outline' },
        { label: 'To get promos & deals', icon: 'pricetag-outline' },
      ],
    },
  },
  {
    title: 'What do you hope to gain from new connections?',
    description: 'Choose one main reason',
    type: 'single',
    options: {
      create: [
        { label: 'Friendship', icon: 'heart-outline' },
        { label: 'Professional network', icon: 'briefcase-outline' },
        { label: 'Romantic connection', icon: 'sparkles-outline' },
        { label: 'Sense of community', icon: 'people-outline' },
      ],
    },
  },
  {
    title: 'What motivates you to attend community events?',
    description: 'Pick all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Fun & entertainment', icon: 'happy-outline' },
        { label: 'Learning opportunities', icon: 'school-outline' },
        { label: 'Meeting new people', icon: 'chatbubbles-outline' },
        { label: 'Making an impact', icon: 'heart-outline' },
      ],
    },
  },
  {
    title: 'How do you want Vstrim to support your goals?',
    description: 'Choose your main preference',
    type: 'single',
    options: {
      create: [
        { label: 'Smart recommendations', icon: 'bulb-outline' },
        { label: 'Building my network', icon: 'people-outline' },
        { label: 'Discovering new experiences', icon: 'map-outline' },
        { label: 'Rewards & promotions', icon: 'gift-outline' },
      ],
    },
  },
  {
    title: 'What kind of experiences do you want to try this year?',
    description: 'Select all that interest you',
    type: 'multiple',
    options: {
      create: [
        { label: 'Sports & adventure', icon: 'bicycle-outline' },
        { label: 'Creative workshops', icon: 'color-palette-outline' },
        { label: 'Live music', icon: 'musical-notes-outline' },
        { label: 'Local travel', icon: 'airplane-outline' },
        { label: 'Volunteering', icon: 'heart-outline' },
      ],
    },
  },

  // 🕒 8. Availability & Routine
  {
    title: 'When are you most available for events?',
    description: 'Choose all that fit your schedule',
    type: 'multiple',
    options: {
      create: [
        { label: 'Weekday evenings', icon: 'moon-outline' },
        { label: 'Weekends', icon: 'calendar-outline' },
        { label: 'Mornings', icon: 'sunny-outline' },
        { label: 'Flexible schedule', icon: 'time-outline' },
      ],
    },
  },
  {
    title: 'How far are you willing to travel for an event?',
    description: 'Pick your comfort distance',
    type: 'single',
    options: {
      create: [
        { label: 'Walking distance', icon: 'walk-outline' },
        { label: 'Short drive (under 30 min)', icon: 'car-outline' },
        { label: 'Anywhere in the city', icon: 'navigate-outline' },
      ],
    },
  },
  {
    title: 'How spontaneous are you when it comes to plans?',
    description: 'Choose your usual style',
    type: 'single',
    options: {
      create: [
        { label: 'I like to plan ahead', icon: 'calendar-outline' },
        { label: 'I can go with the flow', icon: 'shuffle-outline' },
        { label: 'Very spontaneous', icon: 'flash-outline' },
      ],
    },
  },
  {
    title: 'Do you prefer daytime or nighttime events?',
    description: 'Select one',
    type: 'single',
    options: {
      create: [
        { label: 'Daytime events', icon: 'sunny-outline' },
        { label: 'Nightlife & parties', icon: 'moon-outline' },
        { label: 'Either works', icon: 'time-outline' },
      ],
    },
  },
  {
    title: 'How often do you like to go out per week?',
    description: 'Select your average',
    type: 'single',
    options: {
      create: [
        { label: 'Once a week or less', icon: 'cloud-outline' },
        { label: '2–3 times a week', icon: 'calendar-outline' },
        { label: 'Almost every day', icon: 'flame-outline' },
      ],
    },
  },

  // 🌐 9. Digital Habits
  {
    title: 'How do you usually discover new events?',
    description: 'Choose all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Social media', icon: 'logo-instagram' },
        { label: 'Friends recommendations', icon: 'people-outline' },
        { label: 'Event apps', icon: 'phone-portrait-outline' },
        { label: 'Online ads or banners', icon: 'megaphone-outline' },
      ],
    },
  },
  {
    title: 'Which app do you use most to stay connected?',
    description: 'Select one',
    type: 'single',
    options: {
      create: [
        { label: 'Telegram', icon: 'paper-plane-outline' },
        { label: 'Instagram', icon: 'logo-instagram' },
        { label: 'TikTok', icon: 'logo-tiktok' },
        { label: 'WhatsApp', icon: 'logo-whatsapp' },
      ],
    },
  },
  {
    title: 'Do you prefer digital or in-person interactions?',
    description: 'Pick your comfort zone',
    type: 'single',
    options: {
      create: [
        { label: 'Mostly digital', icon: 'laptop-outline' },
        { label: 'Mostly in-person', icon: 'walk-outline' },
        { label: 'A balance of both', icon: 'people-outline' },
      ],
    },
  },
  {
    title: 'Would you use Vstrim to find promo deals near you?',
    description: 'Choose your interest level',
    type: 'single',
    options: {
      create: [
        { label: 'Yes, definitely!', icon: 'gift-outline' },
        { label: 'Maybe, depends on relevance', icon: 'help-outline' },
        { label: 'No, not interested', icon: 'close-outline' },
      ],
    },
  },
  {
    title: 'What kind of recommendations do you want from Vstrim?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Local events', icon: 'calendar-outline' },
        { label: 'People with similar interests', icon: 'people-outline' },
        { label: 'New hangout places', icon: 'pin-outline' },
        { label: 'Promos & coupons', icon: 'pricetag-outline' },
      ],
    },
  },

  // 🌟 10. Personality & Vibe
  {
    title: 'How would your friends describe you?',
    description: 'Select all that match your vibe',
    type: 'multiple',
    options: {
      create: [
        { label: 'Funny & outgoing', icon: 'happy-outline' },
        { label: 'Calm & thoughtful', icon: 'moon-outline' },
        { label: 'Adventurous & curious', icon: 'compass-outline' },
        { label: 'Ambitious & driven', icon: 'rocket-outline' },
      ],
    },
  },
  {
    title: 'What kind of vibe do you bring to social settings?',
    description: 'Pick one that fits you best',
    type: 'single',
    options: {
      create: [
        { label: 'I take the lead', icon: 'star-outline' },
        { label: 'I go with the flow', icon: 'water-outline' },
        { label: 'I observe first, then join', icon: 'eye-outline' },
      ],
    },
  },
  {
    title: 'If Vstrim hosted an event, what theme would excite you most?',
    description: 'Choose one option',
    type: 'single',
    options: {
      create: [
        { label: 'Live music night', icon: 'musical-notes-outline' },
        { label: 'Sports challenge', icon: 'football-outline' },
        { label: 'Networking mixer', icon: 'chatbubbles-outline' },
        { label: 'Cultural night', icon: 'globe-outline' },
      ],
    },
  },
  {
    title: 'What kind of connections are you open to?',
    description: 'Select all that apply',
    type: 'multiple',
    options: {
      create: [
        { label: 'Friendship', icon: 'heart-outline' },
        { label: 'Romantic', icon: 'sparkles-outline' },
        { label: 'Professional', icon: 'briefcase-outline' },
        { label: 'Activity partners', icon: 'walk-outline' },
      ],
    },
  },
  {
    title: 'What is your personal motto when exploring life?',
    description: 'Pick the one closest to your heart',
    type: 'single',
    options: {
      create: [
        { label: 'Live fully, meet freely', icon: 'flame-outline' },
        { label: 'Keep learning, keep growing', icon: 'school-outline' },
        { label: 'Connections create stories', icon: 'people-outline' },
        { label: 'Go with the flow', icon: 'water-outline' },
      ],
    },
  },
]
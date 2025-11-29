-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('single', 'multiple');

-- CreateEnum
CREATE TYPE "QuizCategory" AS ENUM ('personality', 'interest', 'lifestyle', 'values', 'activity', 'mood', 'social_preference', 'general');

-- CreateEnum
CREATE TYPE "MoodSource" AS ENUM ('manual', 'quiz', 'ai_detected');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('pending', 'accepted', 'declined', 'expired', 'mutual');

-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('bar', 'cafe', 'restaurant', 'gym', 'club', 'park', 'coworking', 'museum', 'cinema', 'beach', 'mall', 'library', 'bookstore', 'art_gallery', 'studio');

-- CreateEnum
CREATE TYPE "HangoutPlaceType" AS ENUM ('cafe', 'restaurant', 'bar', 'club', 'gym', 'park', 'mall', 'coworking', 'library', 'bookstore', 'beach', 'museum', 'art_gallery', 'cinema', 'sports_venue', 'community_center', 'other');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('party', 'workshop', 'meetup', 'concert', 'sport', 'exhibition', 'conference', 'networking', 'casual_hangout', 'fitness_class', 'food_tasting', 'game_night');

-- CreateEnum
CREATE TYPE "VibeType" AS ENUM ('energetic', 'chill', 'relaxed', 'intense', 'social', 'intimate', 'crowded', 'quiet', 'active', 'passive', 'creative', 'competitive', 'casual', 'formal', 'romantic', 'adventurous', 'intellectual', 'fun', 'trendy', 'cozy', 'outdoor', 'indoor', 'calm', 'introspective');

-- CreateEnum
CREATE TYPE "InterestCategory" AS ENUM ('sports', 'arts', 'music', 'food', 'tech', 'gaming', 'fitness', 'reading', 'travel', 'wellness', 'social', 'learning', 'entertainment', 'general');

-- CreateEnum
CREATE TYPE "EventAttendanceStatus" AS ENUM ('interested', 'going', 'maybe', 'went');

-- CreateEnum
CREATE TYPE "VisitFrequency" AS ENUM ('daily', 'weekly', 'monthly', 'occasionally', 'rarely');

-- CreateEnum
CREATE TYPE "JoinReason" AS ENUM ('make_friends', 'find_activity_partners', 'explore_city', 'try_new_experiences', 'professional_networking', 'dating_relationships', 'new_to_area', 'expand_social_circle', 'find_hobby_community', 'attend_events');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT,
    "bio" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "photoProfile" TEXT,
    "photoVerification" TEXT,
    "tokens" DOUBLE PRECISION DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "vibes" "VibeType"[] DEFAULT ARRAY[]::"VibeType"[],
    "join_reasons" "JoinReason"[] DEFAULT ARRAY[]::"JoinReason"[],
    "user_interest" "InterestCategory"[] DEFAULT ARRAY[]::"InterestCategory"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_coordinates" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT,
    "district" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_hangout_places" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "place_name" TEXT NOT NULL,
    "place_type" "HangoutPlaceType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT,
    "district" TEXT,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_hangout_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "icon" TEXT,
    "type" "PlaceType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT,
    "district" TEXT,
    "description" TEXT,
    "image" TEXT,
    "google_place_id" TEXT,
    "vibes" TEXT[],
    "rating" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "icon" TEXT,
    "image" TEXT,
    "endDate" TIMESTAMP(3),
    "placeId" TEXT NOT NULL,
    "communityId" TEXT,
    "banner" TEXT,
    "vibes" TEXT[],
    "capacity" INTEGER,
    "price" DOUBLE PRECISION DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityType" TEXT,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promo" (
    "id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discount_code" TEXT NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "InterestCategory" NOT NULL DEFAULT 'general',
    "icon" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_communities" (
    "user_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_communities_pkey" PRIMARY KEY ("user_id","community_id")
);

-- CreateTable
CREATE TABLE "user_events" (
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "status" "EventAttendanceStatus" NOT NULL DEFAULT 'interested',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_events_pkey" PRIMARY KEY ("user_id","event_id")
);

-- CreateTable
CREATE TABLE "user_matches" (
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,
    "match_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_matches_pkey" PRIMARY KEY ("user1_id","user2_id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "matched_user_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "quiz_session_id" TEXT NOT NULL,
    "distance" DOUBLE PRECISION,
    "breakdown" JSONB NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_recommendations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "quiz_session_id" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "breakdown" JSONB NOT NULL,
    "reason" TEXT,
    "is_viewed" BOOLEAN NOT NULL DEFAULT false,
    "is_visited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "place_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_recommendations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "quiz_session_id" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "breakdown" JSONB NOT NULL,
    "reason" TEXT,
    "is_viewed" BOOLEAN NOT NULL DEFAULT false,
    "is_interested" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_quizzes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "daily_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "QuestionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "daily_quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_ids" TEXT[],
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_coordinates_user_id_key" ON "user_coordinates"("user_id");

-- CreateIndex
CREATE INDEX "user_coordinates_latitude_longitude_idx" ON "user_coordinates"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "user_hangout_places_user_id_idx" ON "user_hangout_places"("user_id");

-- CreateIndex
CREATE INDEX "user_hangout_places_latitude_longitude_idx" ON "user_hangout_places"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "places_google_place_id_key" ON "places"("google_place_id");

-- CreateIndex
CREATE INDEX "places_latitude_longitude_idx" ON "places"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "places_type_city_idx" ON "places"("type", "city");

-- CreateIndex
CREATE UNIQUE INDEX "interests_name_key" ON "interests"("name");

-- CreateIndex
CREATE UNIQUE INDEX "interests_slug_key" ON "interests"("slug");

-- CreateIndex
CREATE INDEX "interests_category_order_idx" ON "interests"("category", "order");

-- CreateIndex
CREATE INDEX "matches_user_id_status_created_at_idx" ON "matches"("user_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "matches_score_idx" ON "matches"("score");

-- CreateIndex
CREATE INDEX "matches_expires_at_idx" ON "matches"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "matches_user_id_matched_user_id_quiz_session_id_key" ON "matches"("user_id", "matched_user_id", "quiz_session_id");

-- CreateIndex
CREATE INDEX "place_recommendations_user_id_created_at_idx" ON "place_recommendations"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "place_recommendations_score_idx" ON "place_recommendations"("score");

-- CreateIndex
CREATE UNIQUE INDEX "place_recommendations_user_id_place_id_quiz_session_id_key" ON "place_recommendations"("user_id", "place_id", "quiz_session_id");

-- CreateIndex
CREATE INDEX "event_recommendations_user_id_created_at_idx" ON "event_recommendations"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "event_recommendations_score_idx" ON "event_recommendations"("score");

-- CreateIndex
CREATE UNIQUE INDEX "event_recommendations_user_id_event_id_quiz_session_id_key" ON "event_recommendations"("user_id", "event_id", "quiz_session_id");

-- CreateIndex
CREATE INDEX "daily_quizzes_userId_createdAt_idx" ON "daily_quizzes"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "daily_quizzes_userId_isCompleted_idx" ON "daily_quizzes"("userId", "isCompleted");

-- CreateIndex
CREATE INDEX "quiz_answers_user_id_idx" ON "quiz_answers"("user_id");

-- CreateIndex
CREATE INDEX "quiz_answers_daily_quiz_id_idx" ON "quiz_answers"("daily_quiz_id");

-- AddForeignKey
ALTER TABLE "user_coordinates" ADD CONSTRAINT "user_coordinates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hangout_places" ADD CONSTRAINT "user_hangout_places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_communities" ADD CONSTRAINT "user_communities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_communities" ADD CONSTRAINT "user_communities_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_matches" ADD CONSTRAINT "user_matches_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_matches" ADD CONSTRAINT "user_matches_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_matched_user_id_fkey" FOREIGN KEY ("matched_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_recommendations" ADD CONSTRAINT "place_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_recommendations" ADD CONSTRAINT "place_recommendations_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_recommendations" ADD CONSTRAINT "event_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_recommendations" ADD CONSTRAINT "event_recommendations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_quizzes" ADD CONSTRAINT "daily_quizzes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_daily_quiz_id_fkey" FOREIGN KEY ("daily_quiz_id") REFERENCES "daily_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

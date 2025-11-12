import { PrismaClient } from '@prisma/client'
import { quizQuestions } from './quizData'

const prisma = new PrismaClient()

async function main() {
  // Delete existing questions (optional - for clean slate)
  await prisma.quizOption.deleteMany();
  await prisma.quizQuestion.deleteMany();
  console.log('🗑️  Cleared existing questions');


  console.log('🌱 Seeding quiz questions...')

  for (const question of quizQuestions) {
    await prisma.quizQuestion.create({ data: question })
  }

  console.log('✅ Quiz seeding complete!')

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
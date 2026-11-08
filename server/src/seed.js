import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Note } from './models/Note.js';

const SEED_NOTES = [
  {
    title: 'দৈনিক ভাবনা ও পরিকল্পনা',
    content: 'সকালবেলা এক কাপ আদা চা দিয়ে দিন শুরু করা। বই পড়া অন্তত ৩০ মিনিট, আর কাজের ফাঁকে শান্তভাবে শ্বাস নেওয়া। জীবন ছোট, তাই ছোট ছোট মুহূর্তগুলো উপভোগ করা জরুরি।',
    color: 'butter',
    pinned: true,
  },
  {
    title: 'Weekly Groceries & Essentials',
    content: '• Olive oil & sea salt\n• Sourdough bread from bakery\n• Roasted almond butter\n• Fresh rosemary & lemons\n• Green tea leaves',
    color: 'sage',
    pinned: true,
  },
  {
    title: 'Book note: The Architecture of Happiness',
    content: 'We value buildings and spaces that speak to us in the language of what we aspire to become. Architecture reminds us of our ideal selves when the world is chaotic.',
    color: 'peach',
    pinned: false,
  },
  {
    title: 'বাজারের ফর্দ (সন্ধ্যায় আনতে হবে)',
    content: '১. কাঁচামরিচ ও ধনেপাতা\n২. মিষ্টি দই\n৩. বাসমতী চাল ৫ কেজি\n৪. খাঁটি সরিষার তেল',
    color: 'paper',
    pinned: false,
  },
  {
    title: 'Meeting Highlights with Maya',
    content: 'Discussed the mobile design audit. Keep transitions below 200ms, prioritize tactile swipe triggers, and ensure zero pill clutters in metadata cards.',
    color: 'sky',
    pinned: false,
  },
  {
    title: 'Quiet Observation',
    content: 'The afternoon light hits the desk at 4:15 PM and turns everything warm amber. A reminder to step away from screens for ten minutes.',
    color: 'rose',
    pinned: false,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing notes...');
    await Note.deleteMany({});
    console.log('[Seed] Inserting sample notes...');
    const inserted = await Note.insertMany(SEED_NOTES);
    console.log(`[Seed] Successfully inserted ${inserted.length} sample notes!`);
  } catch (error) {
    console.error(`[Seed] Error seeding database: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from database.');
    process.exit(0);
  }
}

seed();


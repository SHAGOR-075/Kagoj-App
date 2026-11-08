// Initial sample notes showcasing English and Bangla typography.

import { Note } from '../types/note';

export const INITIAL_MOCK_NOTES: Note[] = [
  {
    _id: 'note-1',
    title: 'দৈনিক ভাবনা ও পরিকল্পনা',
    content: 'সকালবেলা এক কাপ আদা চা দিয়ে দিন শুরু করা। বই পড়া অন্তত ৩০ মিনিট, আর কাজের ফাঁকে শান্তভাবে শ্বাস নেওয়া। জীবন ছোট, তাই ছোট ছোট মুহূর্তগুলো উপভোগ করা জরুরি।',
    color: 'butter',
    pinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: 'note-2',
    title: 'Weekly Groceries & Essentials',
    content: '• Olive oil & sea salt\n• Sourdough bread from bakery\n• Roasted almond butter\n• Fresh rosemary & lemons\n• Green tea leaves',
    color: 'sage',
    pinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    _id: 'note-3',
    title: 'Book note: The Architecture of Happiness',
    content: 'We value buildings and spaces that speak to us in the language of what we aspire to become. Architecture reminds us of our ideal selves when the world is chaotic.',
    color: 'peach',
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: 'note-4',
    title: 'বাজারের ফর্দ (সন্ধ্যায় আনতে হবে)',
    content: '১. কাঁচামরিচ ও ধনেপাতা\n২. মিষ্টি দই\n৩. বাসমতী চাল ৫ কেজি\n৪. খাঁটি সরিষার তেল',
    color: 'paper',
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    _id: 'note-5',
    title: 'Meeting Highlights with Maya',
    content: 'Discussed the mobile design audit. Keep transitions below 200ms, prioritize tactile swipe triggers, and ensure zero pill clutters in metadata cards.',
    color: 'sky',
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    _id: 'note-6',
    title: 'Quiet Observation',
    content: 'The afternoon light hits the desk at 4:15 PM and turns everything warm amber. A reminder to step away from screens for ten minutes.',
    color: 'rose',
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

import { NextResponse } from 'next/server';
import { adminDatabase } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Get FAQs from database
    const faqsRef = adminDatabase.ref('faqs');
    const faqsSnapshot = await faqsRef.once('value');
    
    const faqs = [];
    
    if (faqsSnapshot.exists()) {
      const faqsData = faqsSnapshot.val();
      
      // Convert the object structure to array format
      // Structure: { "question1": "answer1", "question2": "answer2" }
      for (const [question, answer] of Object.entries(faqsData)) {
        faqs.push({
          question: question,
          answer: answer as string
        });
      }
    }

    return NextResponse.json({ 
      success: true,
      faqs: faqs
    });

  } catch (error) {
    console.error('FAQs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
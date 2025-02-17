import { NextRequest, NextResponse } from 'next/server'; // Import Next.js request and response utilities
import { saveReferral, getReferrals, getReferrer } from '@/lib/referralService'; // Import referral service functions

// Handle POST requests to save a referral
export async function POST(req: NextRequest) {
  try {
    const { userId, referrerId } = await req.json(); // Parse JSON request body to extract userId and referrerId
    
    // Validate input: Ensure both userId and referrerId are provided and not the same
    if (!userId || !referrerId || userId === referrerId) {
      return NextResponse.json({ error: 'Missing UserId or ReferrerId' }, { status: 400 });
    }
    
    await saveReferral(userId, referrerId); // Call function to save the referral
    
    return NextResponse.json({ message: 'Referral processed' }, { status: 200 }); // Respond with success message
  } catch (error) {
    console.error('Referral creation error:', error); // Log any errors that occur
    return NextResponse.json({ error: 'Failed to process referral' }, { status: 500 }); // Return error response
  }
}

// Handle GET requests to retrieve referrals
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId'); // Extract userId from query parameters
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing UserId' }, { status: 400 }); // Return error if userId is missing
    }
    
    console.log('Fetching referrals for userId:', userId); // Log the userId being queried
    
    const referrals = await getReferrals(userId); // Fetch the list of referrals for the user
    const referrer = await getReferrer(userId); // Fetch the referrer of the user
    
    console.log('Referrals:', referrals); // Log the retrieved referrals
    console.log('Referrer:', referrer); // Log the retrieved referrer
    
    return NextResponse.json({ referrals, referrer }); // Return retrieved referral data as JSON
  } catch (error) {
    console.error('Full referral fetch error:', error); // Log any errors that occur
    return NextResponse.json({ 
      error: 'Failed to fetch referrals', 
      details: error instanceof Error ? error.message : String(error) // Include error details if available
    }, { status: 500 }); // Return error response
  }
}

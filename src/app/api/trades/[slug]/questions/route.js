// app/api/trades/[slug]/questions/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL
import { verifyToken } from '@/lib/auth/jwt';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getListingById(identifier) {
  const listingId = parseInt(identifier);
  
  if (isNaN(listingId)) {
    return null;
  }
  
  const { data: listing } = await supabase
    .from('trade_listings')
    .select('id, user_id, title')
    .eq('id', listingId)
    .maybeSingle();

  return listing;
}

async function getAuthToken() {
  // ← FIX: Använd headers()
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    const listing = await getListingById(slug);

    if (!listing) {
      return NextResponse.json({ 
        success: false, 
        message: 'Listing not found' 
      }, { status: 404 });
    }

    const { data: questions, error } = await supabase
      .from('listing_questions')
      .select('*, users:user_id (id, username, first_name, last_name, avatar_url)')
      .eq('listing_id', listing.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      const { data: questionsOnly } = await supabase
        .from('listing_questions')
        .select('*')
        .eq('listing_id', listing.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (!questionsOnly || questionsOnly.length === 0) {
        return NextResponse.json({ success: true, data: [] });
      }

      const userIds = [...new Set(questionsOnly.map(q => q.user_id))];
      
      const { data: users } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, avatar_url')
        .in('id', userIds);

      const userMap = {};
      users?.forEach(u => { userMap[u.id] = u; });

      const formatted = questionsOnly.map(q => ({
        ...q,
        user: {
          id: q.user_id,
          username: userMap[q.user_id]?.username,
          first_name: userMap[q.user_id]?.first_name,
          last_name: userMap[q.user_id]?.last_name,
          name: `${userMap[q.user_id]?.first_name || ''} ${userMap[q.user_id]?.last_name || ''}`.trim() || userMap[q.user_id]?.username,
          avatar_url: userMap[q.user_id]?.avatar_url
        },
        is_owner: q.user_id === listing.user_id
      }));

      return NextResponse.json({ success: true, data: formatted });
    }

    const formatted = (questions || []).map(q => ({
      ...q,
      user: {
        id: q.users?.id || q.user_id,
        username: q.users?.username,
        first_name: q.users?.first_name,
        last_name: q.users?.last_name,
        name: `${q.users?.first_name || ''} ${q.users?.last_name || ''}`.trim() || q.users?.username,
        avatar_url: q.users?.avatar_url
      },
      is_owner: q.user_id === listing.user_id
    }));

    return NextResponse.json({ success: true, data: formatted });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch questions'
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { message } = body;
    
    // ← FIX: Nu använder getAuthToken() headers() internt
    const decoded = await getAuthToken();

    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required. Please log in.' 
      }, { status: 401 });
    }

    if (!message?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Message content required'
      }, { status: 400 });
    }

    const listing = await getListingById(slug);

    if (!listing) {
      return NextResponse.json({ 
        success: false, 
        message: 'Listing not found' 
      }, { status: 404 });
    }

    const { data: insertedQuestion, error: insertError } = await supabase
      .from('listing_questions')
      .insert({
        question_uuid: uuidv4(),
        listing_id: listing.id,
        user_id: decoded.id,
        message: message.trim(),
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to post question: ' + insertError.message
      }, { status: 500 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, avatar_url')
      .eq('id', decoded.id)
      .single();

    const formatted = {
      ...insertedQuestion,
      user: {
        id: userData?.id,
        username: userData?.username,
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || userData?.username,
        avatar_url: userData?.avatar_url
      },
      is_owner: decoded.id === listing.user_id
    };

    return NextResponse.json({
      success: true,
      data: formatted
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to post question: ' + error.message
    }, { status: 500 });
  }
}
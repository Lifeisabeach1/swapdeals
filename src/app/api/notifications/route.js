
// ============================================
// app/api/notifications/count/route.js
// ============================================

export async function GET_COUNT(request) {
  try {
    // Verify auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // TODO: Implement NotificationService or direct Supabase query
    // const count = await NotificationService.getUnreadCount(decoded.id);

    // Placeholder response - replace with actual implementation
    const count = 0;

    return NextResponse.json({
      success: true,
      data: { count }
    });

  } catch (error) {
    console.error('Error fetching notification count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification count' },
      { status: 500 }
    );
  }
}

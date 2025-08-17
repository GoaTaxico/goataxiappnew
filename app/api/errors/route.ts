import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

interface ErrorReport {
  message: string;
  stack?: string;
  name: string;
  context: {
    userId?: string;
    userRole?: string;
    page?: string;
    action?: string;
    timestamp?: string;
    userAgent?: string;
    url?: string;
    environment?: string;
    appVersion?: string;
    breadcrumbs?: any[];
    [key: string]: any;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get current user (optional - errors can be reported without authentication)
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await request.json();
    const errorReport: ErrorReport = body;

    // Validate required fields
    if (!errorReport.message || !errorReport.name) {
      return NextResponse.json(
        { error: 'Missing required fields: message, name' },
        { status: 400 }
      );
    }

    // Store error in database
    const { error: insertError } = await supabase
      .from('error_logs')
      .insert({
        user_id: user?.id || null,
        error_name: errorReport.name,
        error_message: errorReport.message,
        error_stack: errorReport.stack || null,
        severity: errorReport.severity,
        context: errorReport.context,
        tags: errorReport.tags || {},
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error storing error log:', insertError);
      return NextResponse.json(
        { error: 'Failed to store error log' },
        { status: 500 }
      );
    }

    // Send notification for critical errors
    if (errorReport.severity === 'critical' && user?.id) {
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Critical Error Detected',
            message: `A critical error occurred: ${errorReport.message}`,
            type: 'system',
            data: {
              errorName: errorReport.name,
              severity: errorReport.severity,
              url: errorReport.context.url,
            },
            is_read: false,
          });
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }

    // Log to external service if configured
    if (process.env.ERROR_REPORTING_WEBHOOK_URL) {
      try {
        await fetch(process.env.ERROR_REPORTING_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ERROR_REPORTING_WEBHOOK_TOKEN || ''}`,
          },
          body: JSON.stringify({
            ...errorReport,
            userId: user?.id,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error('Error sending to webhook:', webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Error logged successfully',
    });

  } catch (error) {
    console.error('Error handling error report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('error_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Add severity filter if provided
    if (severity) {
      query = query.eq('severity', severity);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data: errors, error: errorsError, count } = await query;

    if (errorsError) {
      console.error('Error fetching error logs:', errorsError);
      return NextResponse.json(
        { error: 'Failed to fetch error logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: errors,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching error logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

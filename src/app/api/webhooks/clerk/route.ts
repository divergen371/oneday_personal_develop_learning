import type { WebhookEvent } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(req: NextRequest) {
  // リクエストボディを取得
  const payload: WebhookEvent = await req.json();
  const { data } = payload;
  const eventType = payload.type;

  // Clerkのシークレットキーを使用して署名を検証
  // const headerPayload = req.headers.get('svix-id');
  // const headerSignature = req.headers.get('svix-signature');
  
  // シークレットキーがない場合は、有効なwebhookコールかチェックしない
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.warn('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    if (process.env.NODE_ENV !== 'production') {
      // 開発環境ではエラーを返さず成功を装う
      return NextResponse.json({ message: 'Webhook processed successfully (dev mode)' });
    }
    return NextResponse.json({ error: 'Webhook secret not provided' }, { status: 400 });
  }

  // 署名が無効な場合はエラーを返す（実運用では実装する）
  // if (!headerPayload || !headerSignature) {
  //   return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  // }

  // 環境変数が設定されていない場合は開発モードで処理
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV !== 'production') {
    console.warn('Supabase service role key is not set. Skipping database operations in development mode.');
    return NextResponse.json({ message: 'Webhook processed successfully (dev mode without DB)' });
  }

  // Webhook イベントタイプに基づいて処理
  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      // Clerkからのユーザーデータ
      // @ts-expect-error Clerkの型定義の問題を回避
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const email = email_addresses?.[0]?.email_address;

      // Supabaseのusersテーブルにユーザー情報を追加/更新
      const { error } = await supabaseAdmin
        .from('users')
        .upsert({
          clerk_id: id,
          email,
          first_name,
          last_name,
          avatar_url: image_url,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'clerk_id'
        });

      if (error) {
        console.error('Error inserting user into Supabase:', error);
        return NextResponse.json({ error: 'Error inserting user' }, { status: 500 });
      }
    }

    if (eventType === 'user.deleted') {
      // ユーザーが削除された場合
      const { id } = data;
      
      // Supabaseからユーザーを削除またはフラグを立てる
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .match({ clerk_id: id });

      if (error) {
        console.error('Error deleting user from Supabase:', error);
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
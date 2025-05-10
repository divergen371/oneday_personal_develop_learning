import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

async function getUserProfile(clerkId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) {
    return redirect('/sign-in');
  }
  
  // ClerkのIDを使用してSupabaseからユーザープロファイルを取得
  const profile = await getUserProfile(user.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">マイプロフィール</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Image 
            src={user.imageUrl || 'https://via.placeholder.com/150'} 
            alt="プロフィール画像" 
            width={80}
            height={80}
            className="rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600">{user.emailAddresses[0].emailAddress}</p>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">会員情報</h3>
          
          {profile ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">会員ステータス</p>
                <p>{profile.membership_status || '一般会員'}</p>
              </div>
              <div>
                <p className="text-gray-500">登録日</p>
                <p>{new Date(profile.created_at).toLocaleDateString('ja-JP')}</p>
              </div>
              {/* 追加の会員情報をここに表示 */}
            </div>
          ) : (
            <p>プロフィール情報がまだ同期されていません。</p>
          )}
        </div>
      </div>
    </div>
  );
} 
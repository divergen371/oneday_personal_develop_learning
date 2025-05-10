import React, { type ReactNode } from "react";
import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import "@/app/css/style.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "テストサイト",
  description: "テストサイトです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  ログイン
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  新規登録
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <a href="/profile" className="text-sm hover:underline">
                  プロフィール
                </a>
                <UserButton />
              </div>
            </SignedIn>
          </header>
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

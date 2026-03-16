'use client';
import React from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import NavigationBar from './NavigationBar';

export default function Header() {
  return (
    <header className="fixed-top shadow-sm">
      <TopBar />
      <MainHeader />
      <NavigationBar />
    </header>
  );
}

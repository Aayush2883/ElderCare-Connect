import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div class="flex flex-col min-h-screen">
      <Navbar />
      <main class="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

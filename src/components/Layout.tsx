import type { PropsWithChildren } from "react";
import Header from "./Header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <Header/>
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <div>
        <footer className="border-t backdrop:blur-lg py-12 supports-[backdrop-filter]:bg-background/60">
          <p className="container mx-auto px-4 text-center text-gray-400 ">
            this is footer💕😍
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;

// Layout.tsx
import { ReactNode } from 'react';
import ChatButton from '../chat/ChatButton';
import PageWithMessage from '../ui/PageWithMessage'; // Import the new component
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <PageWithMessage>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <ChatButton />
            </div>
        </PageWithMessage>
    );
};

export default Layout;

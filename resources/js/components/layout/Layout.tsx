import { ReactNode } from 'react';
import { AppProviders } from '../../AppProviders';
import ChatButton from '../chat/ChatButton';
import PageWithMessage from '../ui/PageWithMessage';
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <AppProviders>
            <PageWithMessage>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <ChatButton />
                </div>
            </PageWithMessage>
        </AppProviders>
    );
};

export default Layout;

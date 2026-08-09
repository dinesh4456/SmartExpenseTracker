import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import "./MainLayout.css";

function MainLayout({ children }) {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="main-body">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
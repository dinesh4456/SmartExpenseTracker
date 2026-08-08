import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function MainLayout({ children }) {

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#F4F7FC"
            }}
        >

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    marginLeft: "280px",
                    minHeight: "100vh"
                }}
            >

                <Navbar />

                <main
                    style={{
                        padding: "24px 28px 32px"
                    }}
                >

                    {children}

                </main>

            </div>

        </div>

    );

}

export default MainLayout;
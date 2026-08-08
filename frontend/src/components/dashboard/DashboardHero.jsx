import "./DashboardHero.css";

function DashboardHero({ dashboard }) {

    const userName = localStorage.getItem("userName") || "User";

    const income = dashboard.totalIncome;
    const expense = dashboard.totalExpense;

    const savingsRate =
        income > 0
            ? (((income - expense) / income) * 100).toFixed(1)
            : 0;

    return (

        <section className="dashboard-hero">

            <div className="hero-left">

                <span className="hero-greeting">

                    👋 Welcome Back

                </span>

                <h1>

                    {userName}

                </h1>

                <p>

                    Excellent financial discipline.

                </p>

            </div>

            <div className="hero-right">

                <div className="hero-card">

                    <small>

                        Savings Rate

                    </small>

                    <h2>

                        {savingsRate}%

                    </h2>

                </div>

                <div className="hero-card">

                    <small>

                        Available Balance

                    </small>

                    <h2>

                        ₹{dashboard.balance.toLocaleString()}

                    </h2>

                </div>

            </div>

        </section>

    );

}

export default DashboardHero;
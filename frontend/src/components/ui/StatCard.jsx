import "./StatCard.css";

function StatCard({

    title,

    value,

    subtitle,

    icon,

    color,

    onClick

}) {

    return (

        <div
            className={`stat-card ${onClick ? "clickable-card" : ""}`}
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "default" }}
        >

            <div className="stat-header">

                <div
                    className="stat-icon"
                    style={{ background: color }}
                >
                    {icon}
                </div>

                <div>

                    <h6>{title}</h6>

                    <small>{subtitle}</small>

                </div>

            </div>

            <h2 className="stat-value">

                {value}

            </h2>

        </div>

    );

}

export default StatCard;
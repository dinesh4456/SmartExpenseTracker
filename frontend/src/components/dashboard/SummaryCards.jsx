import { Row, Col } from "react-bootstrap";

import {
    FaWallet,
    FaMoneyBillWave,
    FaPiggyBank,
    FaBullseye
} from "react-icons/fa";

import DashboardCard from "./DashboardCard";

function SummaryCards({

    income,

    expense,

    savings,

    budget

}) {

    return (

        <Row className="g-4 mb-4">

            <Col lg={3} md={6}>

                <DashboardCard

                    title="Total Income"

                    value={`₹${income}`}

                    icon={<FaWallet />}

                    bg="success"

                />

            </Col>

            <Col lg={3} md={6}>

                <DashboardCard

                    title="Total Expense"

                    value={`₹${expense}`}

                    icon={<FaMoneyBillWave />}

                    bg="danger"

                />

            </Col>

            <Col lg={3} md={6}>

                <DashboardCard

                    title="Savings"

                    value={`₹${savings}`}

                    icon={<FaPiggyBank />}

                    bg="primary"

                />

            </Col>

            <Col lg={3} md={6}>

                <DashboardCard

                    title="Budget"

                    value={`₹${budget}`}

                    icon={<FaBullseye />}

                    bg="warning"

                    text="dark"

                />

            </Col>

        </Row>

    );

}

export default SummaryCards;
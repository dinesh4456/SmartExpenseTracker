import { Row, Col } from "react-bootstrap";

function PageHeader({ title, subtitle, action }) {

    return (

        <Row className="align-items-center mb-4">

            <Col>

                <h2 className="fw-bold mb-1">
                    {title}
                </h2>

                <p
                    className="text-muted mb-0"
                    style={{ fontSize: "15px" }}
                >
                    {subtitle}
                </p>

            </Col>

            {

                action && (

                    <Col
                        xs="auto"
                    >
                        {action}
                    </Col>

                )

            }

        </Row>

    );

}

export default PageHeader;
import { Card } from "react-bootstrap";

function SectionCard({

    title,

    children

}) {

    return (

        <Card
            className="border-0 shadow-sm h-100"
            style={{
                borderRadius: "18px"
            }}
        >

            <Card.Body>

                <h5
                    className="fw-bold mb-4"
                >
                    {title}
                </h5>

                {children}

            </Card.Body>

        </Card>

    );

}

export default SectionCard;
import { Spinner } from "react-bootstrap";

function Loader() {

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "300px"
            }}
        >

            <Spinner
                animation="border"
                variant="primary"
            />

        </div>

    );

}

export default Loader;
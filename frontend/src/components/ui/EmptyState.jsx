function EmptyState({

    message = "No Data Available"

}) {

    return (

        <div
            className="text-center py-5 text-muted"
        >

            <h5>

                📭

            </h5>

            <p>

                {message}

            </p>

        </div>

    );

}

export default EmptyState;
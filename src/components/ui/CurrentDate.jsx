import React from 'react';

function CurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options);

    return <h5>{formattedDate}</h5>;
}

export default CurrentDate;

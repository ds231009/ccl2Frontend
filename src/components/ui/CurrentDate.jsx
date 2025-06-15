import React from 'react';

function CurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options);

    return <h3>{formattedDate}</h3>;
}

export default CurrentDate;

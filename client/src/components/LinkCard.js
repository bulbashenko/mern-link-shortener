import React from "react";

export const LinkCard = ({ link }) => {
    return (
        <>
            <h2>Your link</h2>
            <p>Shorten: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
            <p>Original: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
            <p>Clicks: <strong>{link.clicks}</strong></p>
            <p>Data: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
        </>
    )
}
import React from 'react';

function ClientCard({ client, handleCardClick }) {
    return (
        <div className="card client-card" onClick={(e) => handleCardClick(e, client)}>
            <div className="container">
            <img
                    className="priority-pic"
                    src={`${process.env.PUBLIC_URL}/priority${client.priority}.png`}
                    alt={`Priority ${client.priority}`}
                    style={{ height: '10px', marginBottom: '15px' }} // Fixed height, auto width
                />
                <h4 style={{ fontSize: '44px', margin: '20px 0' }}><b>{client.name}</b></h4>
                <h5 style={{ fontSize: '24px', margin: '10px 0', marginbottom: '10px' }}><b>{client.tail_number}</b></h5>
                <h6 style={{ fontSize: '20px', margin: '10px 0', marginbottom: '10px' }}><b>{client.additional_comments}</b></h6>
            </div>
        </div>
    );
}

export default ClientCard;

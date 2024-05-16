import React from 'react';

function ClientDetailModal({
    client,
    closeClientDetailModal,
    openEditClientModal,
    handleDeleteClient,
    handleSendTextMessage
}) {
    // prevent closing modal when clicking inside the modal container
    const handleBackgroundClick = (e) => {
        // close modal only if clicking directly on the background, not on modal content
        if (e.target.classList.contains('modal-background')) {
            closeClientDetailModal();
        }
    };

    return (
        <div className="modal-background" onMouseDown={handleBackgroundClick}>
            <div className="modal-container" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <h3>Client Details</h3>
                    <p>Name: {client.name}</p>
                    <p>Phone Number: {client.phone_number}</p>
                    <p>Tail Number: {client.tail_number}</p>
                    <p>Additional Comments: {client.additional_comments}</p>
                    <p>Priority: {client.priority}</p>
                    <button
                        className="edit-btn"
                        onClick={(e) => { e.stopPropagation(); openEditClientModal(client); }}
                        style={{ marginTop: "10px", marginRight: "10px", cursor: "pointer", border: "none", borderRadius: "4px", padding: "5px 10px" }}
                    >
                        Edit
                    </button>
                    <button
                        className="delete-client"
                        onClick={() => handleDeleteClient(client.id)}
                        style={{ marginTop: "10px", marginRight: "10px", cursor: "pointer", backgroundColor: "#FF0000", border: "none", borderRadius: "4px", padding: "5px 10px" }}
                    >
                        Delete Client
                    </button>
                    <button
                        className="send-text-btn"
                        onClick={() => handleSendTextMessage(client.phone_number)}
                        style={{ marginTop: "10px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px" }}
                    >
                        Notify Plane is Ready!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClientDetailModal;

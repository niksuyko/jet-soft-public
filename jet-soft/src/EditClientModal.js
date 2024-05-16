import React from 'react';

function EditClientModal({ client, closeEditClientModal, handleUpdateClient, setEditingClient }) {
    // Prevent closing modal when clicking inside the modal container
    const handleBackgroundClick = (e) => {
        // Close modal only if clicking directly on the background, not on modal content
        if (e.target.classList.contains('modal-background')) {
            closeEditClientModal();
        }
    };

    return (
        <div className="modal-background" onMouseDown={handleBackgroundClick}>
            <div className="modal-container" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="add-client-form-section">
                        <h3>Edit Client</h3>
                        <form onSubmit={handleUpdateClient}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    value={client.name}
                                    onChange={(e) => setEditingClient({ ...client, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone-number">Phone Number:</label>
                                <input
                                    type="text"
                                    id="phone-number"
                                    name="phone_number"
                                    placeholder="Phone Number"
                                    value={client.phone_number}
                                    onChange={(e) => setEditingClient({ ...client, phone_number: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tail-number">Tail Number:</label>
                                <input
                                    type="text"
                                    id="tail-number"
                                    name="tail_number"
                                    placeholder="Tail Number"
                                    value={client.tail_number}
                                    onChange={(e) => setEditingClient({ ...client, tail_number: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="additional-comments">Additional Comments:</label>
                                <input
                                    type="text"
                                    name="additional_comments"
                                    placeholder="Additional Comments"
                                    value={client.additional_comments}
                                    onChange={(e) => setEditingClient({ ...client, additional_comments: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="priority">Priority:</label>
                                <input
                                    type="text"
                                    id="priority"
                                    name="priority"
                                    placeholder="Priority"
                                    value={client.priority}
                                    onChange={(e) => setEditingClient({ ...client, priority: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="submit-client-btn">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditClientModal;

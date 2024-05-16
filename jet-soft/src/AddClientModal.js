import React from 'react';

function AddClientModal({ toggleModal, handleAddClient, newClient, handleInputChange }) {
    // Prevent closing modal when clicking inside the modal container
    const handleBackgroundClick = (e) => {
        // Close modal only if clicking directly on the background, not on modal content
        if (e.target.classList.contains('modal-background')) {
            toggleModal();
        }
    };

    return (
        <div className="modal-background" onMouseDown={handleBackgroundClick}>
            <div className="modal-container" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="add-client-form-section">
                        <h3>Add New Client</h3>
                        <form onSubmit={handleAddClient}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    value={newClient.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone-number">Phone Number:</label>
                                <input
                                    type="text"
                                    id="phone-number"
                                    name="phone_number"
                                    placeholder="Phone Number"
                                    value={newClient.phone_number}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tail-number">Tail Number:</label>
                                <input
                                    type="text"
                                    id="tail-number"
                                    name="tail_number"
                                    placeholder="Tail Number"
                                    value={newClient.tail_number}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="additional-comments">Additional Comments:</label>
                                <input
                                    type="text"
                                    id="additional-comments"
                                    name="additional_comments"
                                    placeholder="Additional Comments"
                                    value={newClient.additional_comments}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="priority">Priority:</label>
                                <input
                                    type="text"
                                    id="priority"
                                    name="priority"
                                    placeholder="Priority"
                                    value={newClient.priority}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className="submit-client-btn">Add Client</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddClientModal;

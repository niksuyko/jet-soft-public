import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientCard from './ClientCard';
import ClientDetailModal from './ClientDetailModal';
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';

function ClientsPage({ auth, token }) {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [newClient, setNewClient] = useState({
        name: '',
        phone_number: '',
        tail_number: '',
        additional_comments: '',
        priority: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [showClientDetailModal, setShowClientDetailModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditClientModal, setShowEditClientModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (!auth) {
            navigate('/');
            return;
        }

        const fetchClients = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clients`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
                alert('Failed to fetch clients. Please try again later.');
            }
        };

        fetchClients();

        const scrollContainer = document.querySelector('.scrollable-container');
        if (scrollContainer) {
            let isDown = false;
            let startX;
            let scrollLeft;

            const mouseDownHandler = (e) => {
                if (e.button === 1 || e.button === 2) return;
                setDragging(false);
                isDown = true;
                scrollContainer.style.cursor = 'grabbing';
                startX = e.pageX - scrollContainer.offsetLeft;
                scrollLeft = scrollContainer.scrollLeft;
            };

            const mouseLeaveHandler = () => {
                isDown = false;
                scrollContainer.style.cursor = 'default';
            };

            const mouseUpHandler = (e) => {
                if (e.button === 1) return;
                isDown = false;
                scrollContainer.style.cursor = 'default';
                setTimeout(() => setDragging(false), 50);
            };

            const mouseMoveHandler = (e) => {
                if (!isDown) return;
                setDragging(true);
                e.preventDefault();
                const x = e.pageX - scrollContainer.offsetLeft;
                const walk = x - startX;
                scrollContainer.scrollLeft = scrollLeft - walk;
            };

            scrollContainer.addEventListener('mousedown', mouseDownHandler);
            scrollContainer.addEventListener('mouseleave', mouseLeaveHandler);
            scrollContainer.addEventListener('mouseup', mouseUpHandler);
            scrollContainer.addEventListener('mousemove', mouseMoveHandler);

            return () => {
                scrollContainer.removeEventListener('mousedown', mouseDownHandler);
                scrollContainer.removeEventListener('mouseleave', mouseLeaveHandler);
                scrollContainer.removeEventListener('mouseup', mouseUpHandler);
                scrollContainer.removeEventListener('mousemove', mouseMoveHandler);
            };
        }
    }, [auth, navigate, token]);

    const handleCardClick = (e, client) => {
        if (dragging) {
            e.preventDefault();
        } else {
            openClientDetailModal(client);
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        document.body.classList.toggle('modal-open');
    };

    const openEditClientModal = (client) => {
        setEditingClient({ ...client });
        setShowEditClientModal(true);
    };

    const closeEditClientModal = () => {
        setShowEditClientModal(false);
        setEditingClient(null);
    };

    const openClientDetailModal = (client) => {
        setSelectedClient(client);
        setShowClientDetailModal(true);
        document.body.classList.add('modal-open');
    };

    const closeClientDetailModal = () => {
        setShowClientDetailModal(false);
        setSelectedClient(null);
        document.body.classList.remove('modal-open');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleDeleteClient = async (clientId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this client? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/clients/${clientId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const updatedClients = clients.filter(client => client.id !== clientId);
            setClients(updatedClients);
            setShowClientDetailModal(false);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete client. Please try again later.');
        }
    };

    const handleAddClient = async (e) => {
        e.preventDefault();

        const phoneRegex = /^\d{10}$/;
        const priorityRegex = /^[1-9]$|^10$/;

        if (!phoneRegex.test(newClient.phone_number)) {
            alert('Phone number must be a 10-digit number.');
            return;
        }

        if (!priorityRegex.test(newClient.priority)) {
            alert('Priority must be a number between 1 and 10.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newClient),
            });
            const data = await response.json();
            setClients([...(Array.isArray(clients) ? clients : []), data]);
            setNewClient({ name: '', phone_number: '', tail_number: '', additional_comments: '', priority: '' });
            toggleModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add client. Please try again later.');
        }
    };

    const handleUpdateClient = async (e) => {
        e.preventDefault();

        const phoneRegex = /^\d{10}$/;
        const priorityRegex = /^[1-9]$|^10$/;

        if (!phoneRegex.test(editingClient.phone_number)) {
            alert('Phone number must be a 10-digit number.');
            return;
        }

        if (!priorityRegex.test(editingClient.priority)) {
            alert('Priority must be a number between 1 and 10.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clients/${editingClient.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editingClient),
            });
            const data = await response.json();
            setClients(clients.map(client => client.id === data.id ? data : client));
            closeEditClientModal();
            closeClientDetailModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update client. Please try again later.');
        }
    };

    const handleSendTextMessage = async (phoneNumber) => {
        const message = "JetCorrect: Your plane's detailing is complete and ready at BJC!";
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, message }),
            });
            const data = await response.json();
            console.log('Text message sent:', data);
        } catch (error) {
            console.error('Error sending text message:', error);
            alert('Failed to send text message. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient({
            ...newClient,
            [name]: value
        });
    };

    return (
        <div className="main-content">
            {showModal && (
                <AddClientModal
                    toggleModal={toggleModal}
                    handleAddClient={handleAddClient}
                    newClient={newClient}
                    handleInputChange={handleInputChange}
                />
            )}

            {showClientDetailModal && selectedClient && (
                <ClientDetailModal
                    client={selectedClient}
                    closeClientDetailModal={closeClientDetailModal}
                    openEditClientModal={openEditClientModal}
                    handleDeleteClient={handleDeleteClient}
                    handleSendTextMessage={handleSendTextMessage}
                />
            )}

            {showEditClientModal && editingClient && (
                <EditClientModal
                    client={editingClient}
                    closeEditClientModal={closeEditClientModal}
                    handleUpdateClient={handleUpdateClient}
                    setEditingClient={setEditingClient}
                />
            )}

            <div className="scrollable-container">
                <div className="card plus-card" onClick={toggleModal}>
                    <img src="plus.png" alt="Add" width="100px" />
                </div>

                {Array.isArray(clients) && clients
                    .filter(client => (client.name?.toLowerCase() || "").includes(searchTerm) || (client.tail_number?.toLowerCase() || "").includes(searchTerm))
                    .map(client => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            handleCardClick={handleCardClick}
                        />
                    ))}
            </div>

            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search clients..."
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>
        </div>
    );
}

export default ClientsPage;

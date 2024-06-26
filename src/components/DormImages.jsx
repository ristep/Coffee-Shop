import { useState, useMemo } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import axiosInstance from '../axiosConfig';

const DormImages = ({ dormId, onClose }) => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagesBaseUrl, setImagesBaseUrl] = useState('');
    const [reload, setReload] = useState(false);

// hook for fetching images for the dorm
    useMemo( async () => {
        // Fetch existing images for the dorm
        await axiosInstance.get(`/dorms/${dormId}/images`)
            .then(response => {
                setImagesBaseUrl(response.data.baseUrl);
                setImages( response.data.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                return [];
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dormId,reload]);


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // handles click on upload button
    const handleUpload = async () => {
        if (!selectedFile) return;
        try {
            const formData = new FormData();
            formData.append('drmImg', selectedFile);
            const response = await axiosInstance.post(`/dorm-img/${dormId}`, formData, {headers: { 'Content-Type': 'multipart/form-data' }});
            setReload(!reload);
            setSelectedFile(null);
            alert(response.data.message,'success');
        }
        catch (error) {
            alert(error.response.data.message, 'danger');
            error => console.error('Error uploading image:', error);
        }
    };

    // handles click on remove button
    const handleRemove = async (imageId) => {
        try {
            await axiosInstance.delete(`/dorm-img/${imageId}`);
            setReload(!reload);
        }
        catch (error) {
            error => console.error('Error removing image:', error);
        }
    };

    // renders modal for managing images
    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Manage Dorm Images: {dormId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {images.map(image => (
                        <ListGroup.Item key={image.id}>
                            <img src={ imagesBaseUrl+image.url} alt="Dorm" width="100" />  
                            <Button variant="danger" onClick={() => handleRemove(image.id)}>Remove</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Form.Group className="mt-3">
                    <Form.Label>Upload New Image</Form.Label>
                    <Form.Control name='drmImg' type="file" onChange={handleFileChange} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleUpload}>Upload</Button>
            </Modal.Footer>
        </Modal>
    );
};

// #mkd 
// Воа не мора, работе и без него ама vscode едиторот го бара?
// За тоа нека го :)
import PropTypes from 'prop-types';
DormImages.propTypes = {
    dormId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
};

export default DormImages;

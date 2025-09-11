import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axiosConfig';
import Layout from '../components/Layout';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

const serviceOptions = [
    { label: "Vehicle Services", options: [ { value: 'Pay Your Tax', label: 'Pay Your Tax' }, { value: 'Transfer of Ownership (Seller)', label: 'Transfer of Ownership (Seller)' }, { value: 'Fitness Renewal/Re-Apply', label: 'Fitness Renewal/Re-Apply' }, { value: 'Re-Assignment (Vintage Series)', label: 'Re-Assignment (Vintage Series)' }, { value: 'RC Particulars', label: 'RC Particulars' }, { value: 'Hypothecation Addition', label: 'Hypothecation Addition' }, { value: 'Pay Balance Fees/Fine', label: 'Pay Balance Fees/Fine' }, { value: 'Transfer of Ownership (Buyer)', label: 'Transfer of Ownership (Buyer)' }, { value: 'Application for NOC', label: 'Application for NOC' }, { value: 'Alteration Of Vehicle', label: 'Alteration Of Vehicle' }, { value: 'RC Cancellation', label: 'RC Cancellation' }, { value: 'Hypothecation Termination', label: 'Hypothecation Termination' }, { value: 'Update Mobile Number (RTO)', label: 'Update Mobile Number (RTO)' }, { value: 'Duplicate Fitness Certificate', label: 'Duplicate Fitness Certificate' }, { value: 'Transfer of Ownership (Succession)', label: 'Transfer of Ownership (Succession)' }, { value: 'Renewal of Registration', label: 'Renewal of Registration' }, { value: 'Conversion Of Vehicle', label: 'Conversion Of Vehicle' }, { value: 'Re-Assignment (State Series)', label: 'Re-Assignment (State Series)' }, { value: 'Application for Duplicate RC', label: 'Application for Duplicate RC' }, { value: 'Mobile number Update (Aadhaar)', label: 'Mobile number Update (Aadhaar)' }, { value: 'Withdrawal of Application', label: 'Withdrawal of Application' }, ]
    },
    { label: "Driving License Services", options: [ { value: 'LEARNING LICENSE', label: 'LEARNING LICENSE' }, { value: 'RENEWAL OF DL', label: 'RENEWAL OF DL' }, { value: 'ADDITIONAL ENDORSEMENT TO DL', label: 'ADDITIONAL ENDORSEMENT TO DL' }, { value: 'CHANGE OF ADDRESS IN DL', label: 'CHANGE OF ADDRESS IN DL' }, { value: 'REPLACEMENT OF DL', label: 'REPLACEMENT OF DL' }, { value: 'ENDORSEMENT TO DRIVE HAZARDOUS MATERIAL', label: 'ENDORSEMENT TO DRIVE HAZARDOUS MATERIAL' }, { value: 'DL EXTRACT', label: 'DL EXTRACT' }, { value: 'ISSUE INTERNATIONAL DRIVING PERMIT', label: 'ISSUE INTERNATIONAL DRIVING PERMIT' }, { value: 'CHANGE OF DATE OF BIRTH IN DL', label: 'CHANGE OF DATE OF BIRTH IN DL' }, { value: 'ISSUE OF DUPLICATE DL', label: 'ISSUE OF DUPLICATE DL' }, { value: 'ISSUE OF PSV BADGE TO A DRIVER', label: 'ISSUE OF PSV BADGE TO A DRIVER' }, { value: 'CHANGE OF NAME IN DL', label: 'CHANGE OF NAME IN DL' }, { value: 'CHANGE OF PHOTO AND SIGNATURE IN DL', label: 'CHANGE OF PHOTO AND SIGNATURE IN DL' }, { value: 'ENDORSEMENT TO DRIVE IN HILL REGION', label: 'ENDORSEMENT TO DRIVE IN HILL REGION' }, { value: 'AEDL FOR DEFENCE DL HOLDER', label: 'AEDL FOR DEFENCE DL HOLDER' }, { value: 'SURRENDER OF COV(S)/PSV BADGE(S)', label: 'SURRENDER OF COV(S)/PSV BADGE(S)' }, { value: 'COV CONVERSION', label: 'COV CONVERSION' }, ]
    }
];

const initialFormState = { citizen_id: '', vehicle_id: '', citizen_name: '', vehicle_no: '', mobile_no: '', services_list: [], selected_services: '', deal_amount: '', deal_taken_date: '', amount_taken: '', amount_pending: '', balance: '' };

const formatDateForDisplay = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const WorkTakenPage = () => {
    const [works, setWorks] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [citizenVehicles, setCitizenVehicles] = useState([]);
    const [selectedCitizen, setSelectedCitizen] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const balance = useMemo(() => {
        const deal = parseFloat(formData.deal_amount) || 0;
        const taken = parseFloat(formData.amount_taken) || 0;
        const pending = deal - taken;
        if (formData.amount_pending !== pending || formData.balance !== pending) {
            setFormData(prev => ({...prev, amount_pending: pending, balance: pending }));
        }
        return pending;
    }, [formData.deal_amount, formData.amount_taken]);

    useEffect(() => { fetchWorks(); }, []);

    const fetchWorks = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/work-taken');
            setWorks(data);
        } catch (error) { setMessage('Failed to fetch records.'); }
        finally { setLoading(false); }
    };

   const loadOptions = (inputValue, type, callback) => {
        if (inputValue.length < 2) return callback([]);
        apiClient.get(`/global-search`, { params: { query: inputValue, type: type } })
            .then(res => {
                // The backend now sends the correct { value, label, type } format directly.
                callback(res.data);
            })
            .catch(() => callback([])); // On error, return empty array
    };

    const loadCitizenOptions = (inputValue, callback) => loadOptions(inputValue, 'citizen', callback);
    const loadVehicleOptions = (inputValue, callback) => loadOptions(inputValue, 'vehicle', callback);

    const populateFormWithData = (citizenData, vehicleData) => {
         setFormData(prev => ({
            ...prev,
            citizen_id: citizenData?.id || '',
            citizen_name: citizenData?.name || '',
            mobile_no: citizenData?.mobile_no || '',
            vehicle_id: vehicleData?.id || '',
            vehicle_no: vehicleData?.registration_no || '',
        }));
        setCitizenVehicles(citizenData?.vehicles || []);

        // Update the select components' displayed values
        setSelectedCitizen(citizenData ? { value: citizenData.id, label: citizenData.name } : null);
        setSelectedVehicle(vehicleData ? { value: vehicleData.id, label: vehicleData.registration_no } : null);
    };

    const handleCitizenSelect = async (selectedOption) => {
        if (!selectedOption) {
            cancelAction(); // Clear everything
            return;
        }
        const { data: citizen } = await apiClient.get(`/citizens/${selectedOption.value}`);
        populateFormWithData(citizen, citizen.vehicles[0]);
    };

    const handleVehicleSelect = async (selectedOption) => {
        if (!selectedOption) {
             setFormData(prev => ({ ...prev, vehicle_id: '', vehicle_no: '' }));
             setSelectedVehicle(null);
            return;
        }
        const { data: vehicle } = await apiClient.get(`/vehicles/${selectedOption.value}`);
        populateFormWithData(vehicle.citizen, vehicle);
    };

    const handleManualVehicleSelect = (e) => {
        const vehicleId = e.target.value;
        const selectedVehicle = citizenVehicles.find(v => v.id == vehicleId);
        setFormData(prev => ({
            ...prev,
            vehicle_id: selectedVehicle ? selectedVehicle.id : '',
            vehicle_no: selectedVehicle ? selectedVehicle.registration_no : ''
        }));
    };

    const handleServiceChange = (selectedOptions) => {
        const services = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setFormData(prev => ({ ...prev, services_list: selectedOptions || [], selected_services: services.join(', ') }));
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'text' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, services_list: formData.services_list.map(opt => opt.value) };
        const url = editId ? `/work-taken/${editId}` : '/work-taken';
        const method = editId ? 'put' : 'post';
        try {
            await apiClient[method](url, payload);
            setMessage(editId ? 'Record updated successfully!' : 'Record saved successfully!');
            cancelAction();
            fetchWorks();
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Error saving record.`;
            const validationErrors = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
            setMessage(`${errorMsg} ${validationErrors}`);
         }
    };

    const startEdit = (work) => {
        setEditId(work.id);
        if (work.citizen && work.citizen.id) {
             apiClient.get(`/citizens/${work.citizen.id}`).then(res => {
                 setCitizenVehicles(res.data.vehicles || []);
             });
        }
        setFormData({ ...initialFormState, ...work, services_list: work.services_list ? work.services_list.map(serviceValue => ({ value: serviceValue, label: serviceValue })) : [], citizen_name: work.citizen?.name || '', vehicle_no: work.vehicle?.registration_no || '', mobile_no: work.citizen?.mobile_no || '' });
        setSelectedCitizen(work.citizen ? { value: work.citizen.id, label: work.citizen.name } : null);
        setSelectedVehicle(work.vehicle ? { value: work.vehicle.id, label: work.vehicle.registration_no } : null);
        window.scrollTo(0, 0);
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await apiClient.delete(`/work-taken/${id}`);
            setMessage('Record deleted successfully');
            fetchWorks();
        } catch (error) { setMessage('Failed to delete record.'); }
     }

    const cancelAction = () => {
        setFormData(initialFormState);
        setEditId(null);
        setCitizenVehicles([]);
        setSelectedCitizen(null);
        setSelectedVehicle(null);
    };

    return (
        <Layout>
            <h2 className="mb-3">Work Taken</h2>
            {message && <div className="alert alert-info">{message}</div>}

            <div className="card p-3 mb-4">
                <h4>{editId ? 'Edit Record' : 'Create New Record'}</h4>
                <form onSubmit={handleSubmit}>
                     <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Search by Citizen</label>
                            <AsyncSelect key={`citizen-select-${editId}`} value={selectedCitizen} cacheOptions defaultOptions loadOptions={loadCitizenOptions} onChange={handleCitizenSelect} isClearable placeholder="Name or Mobile..." />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Search by Vehicle No</label>
                            <AsyncSelect key={`vehicle-select-${editId}`} value={selectedVehicle} cacheOptions defaultOptions loadOptions={loadVehicleOptions} onChange={handleVehicleSelect} isClearable placeholder="Vehicle Reg. No..." />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Or Select Vehicle from Citizen's List</label>
                            <select className="form-select" value={formData.vehicle_id || ''} onChange={handleManualVehicleSelect} disabled={!formData.citizen_id}>
                                <option value="">-- None --</option>
                                {citizenVehicles.map(v => (<option key={v.id} value={v.id}>{v.registration_no}</option>))}
                            </select>
                        </div>
                     </div>

                     <div className="row g-3 mb-3">
                        <div className="col-md-4"><label className="form-label">Citizen Name</label><input type="text" value={formData.citizen_name || ''} className="form-control" readOnly/></div>
                        <div className="col-md-4"><label className="form-label">Vehicle No</label><input type="text" value={formData.vehicle_no || ''} className="form-control" readOnly/></div>
                        <div className="col-md-4"><label className="form-label">Mobile No</label><input type="text" value={formData.mobile_no || ''} className="form-control" readOnly/></div>
                     </div>

                     <div className="row g-3 mb-3">
                        <div className="col-md-12"><label className="form-label">Select Services</label><Select isMulti options={serviceOptions} value={formData.services_list} onChange={handleServiceChange} /></div>
                        <div className="col-md-12"><label className="form-label">Selected Services</label><textarea value={formData.selected_services || ''} className="form-control" rows="3" readOnly /></div>
                     </div>

                     <div className="row g-3">
                        <div className="col-md-3"><label className="form-label">Deal Amount</label><input type="number" step="0.01" name="deal_amount" value={formData.deal_amount || ''} onChange={handleChange} className="form-control"/></div>
                        <div className="col-md-3"><label className="form-label">Deal Taken Date</label><input type="date" name="deal_taken_date" value={formData.deal_taken_date || ''} onChange={handleChange} className="form-control"/></div>
                        <div className="col-md-3"><label className="form-label">Amount Taken</label><input type="number" step="0.01" name="amount_taken" value={formData.amount_taken || ''} onChange={handleChange} className="form-control"/></div>
                        <div className="col-md-3"><label className="form-label">Amount Pending</label><input type="number" step="0.01" value={formData.amount_pending || ''} className="form-control" readOnly/></div>
                        <div className="col-md-12"><label className="form-label">Balance</label><input type="number" step="0.01" value={balance} className="form-control" readOnly /></div>
                     </div>
                     <div className="d-flex gap-2 mt-3">
                         <button type="submit" className="btn btn-primary">{editId ? 'Update Record' : 'Save Record'}</button>
                         <button type="button" className="btn btn-secondary" onClick={cancelAction}>Cancel</button>
                     </div>
                </form>
            </div>

            <div className="card p-3">
                 <h4>History</h4>
                 <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Citizen</th><th>Vehicle</th><th>Services</th>
                                <th>Deal Amount</th><th>Balance</th><th>Deal Date</th>
                                <th style={{minWidth: '120px'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (<tr><td colSpan="7" className="text-center">Loading...</td></tr>)
                            : works.length > 0 ? works.map(work => (
                                <tr key={work.id}>
                                    <td>{work.citizen?.name || 'N/A'}</td>
                                    <td>{work.vehicle?.registration_no || 'N/A'}</td>
                                    <td>{work.selected_services}</td>
                                    <td>{work.deal_amount}</td>
                                    <td>{work.balance}</td>
                                    <td>{formatDateForDisplay(work.deal_taken_date)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(work)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(work.id)}>Delete</button>
                                    </td>
                                </tr>
                            )) : (<tr><td colSpan="7" className="text-center">No records found.</td></tr>)
                            }
                        </tbody>
                    </table>
                 </div>
            </div>
        </Layout>
    );
};
export default WorkTakenPage;

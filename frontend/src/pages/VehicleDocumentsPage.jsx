import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

// This is a generic, reusable component for managing any document type.
const DocumentSection = ({ vehicleId, docType, title, fields, fetchCount }) => {
  const [records, setRecords] = useState([]);
  // ✅ FIX: Corrected the typo from "useState" to useState()
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editRecordId, setEditRecordId] = useState(null);

  const endpoint = `/vehicles/${vehicleId}/${docType}`;

  const fetchRecords = async () => {
    try {
      const res = await apiClient.get(endpoint);
      setRecords(res.data);
      if (fetchCount) fetchCount();
    } catch (error) { console.error(`Failed to fetch ${docType}`); }
  };

  useEffect(() => {
    fetchRecords();
  }, [vehicleId, docType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = e.target.type === 'text' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleFileChange = (e) => { setSelectedFile(e.target.files[0]); };

  const cancelAction = () => { setShowForm(false); setEditRecordId(null); setFormData({}); setSelectedFile(null); }

  const startEdit = (record) => {
      setEditRecordId(record.id);
      const formattedRecord = { ...record };
      fields.forEach(field => {
          if (field.type === 'date' && formattedRecord[field.name]) {
              const date = new Date(formattedRecord[field.name]);
              const userTimezoneOffset = date.getTimezoneOffset() * 60000;
              formattedRecord[field.name] = new Date(date.getTime() + userTimezoneOffset).toISOString().split('T')[0];
          }
      });
      setFormData(formattedRecord);
      setShowForm(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) { if (formData[key] !== null && formData[key] !== undefined) { data.append(key, formData[key]); } }
    if (selectedFile) { data.append('file', selectedFile); }

    let url = endpoint;
    if (editRecordId) {
      url = `/vehicles/${vehicleId}/${docType}/${editRecordId}`;
      data.append('_method', 'PUT');
    }

    try {
      await apiClient.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      cancelAction();
      fetchRecords();
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Error saving ${title}.`;
      const validationErrors = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
      alert(`${errorMsg} ${validationErrors}`);
    }
  };

  const handleDelete = async (recordId) => {
      if (!window.confirm(`Delete this ${title} record?`)) return;
      try {
          await apiClient.delete(`/vehicles/${vehicleId}/${docType}/${recordId}`);
          fetchRecords();
      } catch (error) { alert(`Error deleting ${title}`);}
  }

  return (
    <div>
      {!showForm && <button className="btn btn-primary btn-sm mb-3" onClick={() => setShowForm(true)}>Add New {title}</button>}
      {showForm && (
        <div className="card p-3 mb-3 bg-light">
          <h5>{editRecordId ? `Edit ${title}` : `Add New ${title}`}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              {fields.map(field => (
                <div className="col-md-3" key={field.name}>
                  <label className="form-label">{field.label}</label>
                  <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="form-control form-control-sm" />
                </div>
              ))}
              <div className="col-md-3">
                  <label className="form-label">Upload File</label>
                  <input type="file" onChange={handleFileChange} className="form-control form-control-sm" />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-success btn-sm">Save</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={cancelAction}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-sm table-bordered table-striped">
            <thead>
            <tr>
                {fields.map(f => <th key={f.name}>{f.label}</th>)}
                <th>File</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {records.length > 0 ? records.map(rec => (
                <tr key={rec.id}>
                {fields.map(f => {
                    if(fields.find(field => field.name === f.name)?.type === 'date') {
                        const date = new Date(rec[f.name]);
                        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
                        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
                        return <td key={f.name}>{rec[f.name] ? adjustedDate.toLocaleDateString('en-GB') : '-'}</td>;
                    }
                    return <td key={f.name}>{rec[f.name] || '-'}</td>;
                })}
                <td>
                    {rec.file_path ? (
                        <a href={`http://127.0.0.1:8000/storage/${rec.file_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">View</a>
                    ) : '-'}
                </td>
                <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(rec)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rec.id)}>Delete</button>
                </td>
                </tr>
            )) : <tr><td colSpan={fields.length + 2} className="text-center">No records found.</td></tr>}
            </tbody>
        </table>
      </div>
    </div>
  );
};

const documentConfigs = {
    insurances: { title: "Insurance", fields: [{name: 'company_name', label: 'Company', type: 'text'}, {name: 'policy_number', label: 'Policy No', type: 'text'}, {name: 'start_date', label: 'Start Date', type: 'date'}, {name: 'end_date', label: 'End Date', type: 'date'}] },
    vehicle_taxes: { title: "Tax", fields: [{name: 'tax_mode', label: 'Mode', type: 'text'}, {name: 'tax_from', label: 'From', type: 'date'}, {name: 'tax_upto', label: 'Upto', type: 'date'}, {name: 'amount', label: 'Amount', type: 'number'}] },
    fitness_certificates: { title: "Fitness", fields: [{name: 'certificate_number', label: 'Cert. No', type: 'text'}, {name: 'issue_date', label: 'Issue Date', type: 'date'}, {name: 'expiry_date', label: 'Expiry Date', type: 'date'}] },
    permits: { title: "Permit", fields: [{name: 'permit_number', label: 'Permit No', type: 'text'}, {name: 'issue_date', label: 'Issue Date', type: 'date'}, {name: 'expiry_date', label: 'Expiry Date', type: 'date'}] },
    puccs: { title: "PUCC", fields: [{name: 'pucc_number', label: 'PUCC No', type: 'text'}, {name: 'valid_from', label: 'From', type: 'date'}, {name: 'valid_until', label: 'Until', type: 'date'}] },
    slds: { title: "SLD", fields: [{name: 'certificate_number', label: 'Cert. No', type: 'text'}, {name: 'issue_date', label: 'Issue Date', type: 'date'}, {name: 'expiry_date', label: 'Expiry Date', type: 'date'}] },
    vltds: { title: "VLTD", fields: [{name: 'certificate_number', label: 'Cert. No', type: 'text'}, {name: 'issue_date', label: 'Issue Date', type: 'date'}, {name: 'expiry_date', label: 'Expiry Date', type: 'date'}] },
};

const VehicleDocumentsPage = () => {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('insurances');
  const [docCounts, setDocCounts] = useState({});

  const fetchPageData = async () => {
    try {
      const res = await apiClient.get(`/vehicles/${vehicleId}/details`);
      const vehicleDetails = res.data;
      setVehicle(vehicleDetails);

      let counts = {};
      counts.insurances = vehicleDetails.insurances_count || 0;
      counts.vehicle_taxes = vehicleDetails.vehicle_taxes_count || 0;
      counts.fitness_certificates = vehicleDetails.fitness_certificates_count || 0;
      counts.permits = vehicleDetails.permits_count || 0;
      counts.puccs = vehicleDetails.puccs_count || 0;
      counts.slds = vehicleDetails.slds_count || 0;
      counts.vltds = vehicleDetails.vltds_count || 0;
      setDocCounts(counts);

    } catch (error) {
      console.error("Failed to fetch vehicle details");
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [vehicleId]);

  if (!vehicle) return <Layout><p>Loading vehicle details...</p></Layout>;

  return (
    <Layout>
      <Link to={`/citizens/${vehicle.citizen_id}/vehicles`} className="btn btn-sm btn-secondary mb-3">&larr; Back to Vehicles List</Link>
      <h2 className="mb-3">Manage Documents for Vehicle: {vehicle.registration_no}</h2>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {Object.entries(documentConfigs).map(([key, config]) => (
              <li className="nav-item" key={key}>
                <button className={`nav-link ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
                  {config.title} <span className="badge bg-secondary">{docCounts[key] ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body">
            {Object.entries(documentConfigs).map(([key, config]) => (
                activeTab === key && <DocumentSection key={key} vehicleId={vehicleId} docType={key} title={config.title} fields={config.fields} fetchCount={fetchPageData}/>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDocumentsPage;

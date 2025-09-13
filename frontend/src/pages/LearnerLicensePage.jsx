import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";
import debounce from 'lodash.debounce';

const initialFormState = {
  application_no: "", name: "", father_name: "", dob: "", mobile_no: "",
  address: "", category: [], other_category: "", application_stage: "Submitted",
  ll_number: "", validity_from: "", validity_upto: "", remarks: "",
};

const categoryOptions = [
    { value: 'MCWG', label: 'MCWG' }, { value: 'LMV', label: 'LMV' }, { value: 'MCWOG', label: 'MCWOG' },
    { value: 'TRANS', label: 'TRANS' }, { value: 'ERIK', label: 'ERIK' }, { value: 'TRACTOR', label: 'TRACTOR' },
    { value: 'OTHERS', label: 'OTHERS' }
];

const initialSearchState = { application_no: "", name: "", dob: "", mobile_no: "", ll_number: "" };

const formatDateForDisplay = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() + userTimezoneOffset).toISOString().split('T')[0];
    } catch (error) { return ""; }
};

const LearnerLicensePage = () => {
  const [licenses, setLicenses] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editLicense, setEditLicense] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerms, setSearchTerms] = useState(initialSearchState);

  const fetchLicenses = async (params = {}) => {
    setLoading(true);
    try {
      const activeParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''));
      const { data } = await apiClient.get("/licenses", { params: activeParams });
      setLicenses(data.licenses || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load licenses.");
    } finally { setLoading(false); }
  };

  const debouncedFetch = useCallback(debounce((params) => fetchLicenses(params), 300), []);

  useEffect(() => {
    debouncedFetch(searchTerms);
    return () => { debouncedFetch.cancel(); };
  }, [searchTerms, debouncedFetch]);

  const handleSearchChange = (e) => {
      const { name, value } = e.target;
      setSearchTerms(prev => ({...prev, [name]: value.toUpperCase() }));
  }

  const resetSearch = () => {
      setSearchTerms(initialSearchState);
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'text' ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentCategories = prev.category || [];
      if (checked) {
        return { ...prev, category: [...currentCategories, value] };
      } else {
        return { ...prev, category: currentCategories.filter((cat) => cat !== value) };
      }
    });
   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editLicense ? `/licenses/${editLicense.id}` : "/licenses";
    const method = editLicense ? "put" : "post";
    try {
      const { data } = await apiClient[method](url, formData);
      setMessage(data.message);
      setFormData(initialFormState);
      setEditLicense(null);
      setShowForm(false);
      fetchLicenses(searchTerms);
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Error saving license.`;
      const validationErrors = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
      setMessage(`${errorMsg} ${validationErrors}`);
    }
  };

  const startEdit = (license) => {
    setEditLicense(license);
    setFormData({
        ...initialFormState, // Ensure all keys are present
        ...license,
        dob: formatDateForInput(license.dob),
        validity_from: formatDateForInput(license.validity_from),
        validity_upto: formatDateForInput(license.validity_upto),
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this license?")) return;
    try {
      const { data } = await apiClient.delete(`/licenses/${id}`);
      setMessage(data.message);
      fetchLicenses(searchTerms);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting license.");
    }
  };

  const cancelAction = () => {
    setEditLicense(null);
    setFormData(initialFormState);
    setShowForm(false);
  };

  const handleAddNewClick = () => {
      setEditLicense(null);
      setFormData(initialFormState);
      setShowForm(true);
  }

  return (
    <Layout>
      <h2 className="mb-3">Manage Learner Licenses</h2>
      {message && <div className="alert alert-info" role="alert">{message}</div>}

      {showForm && (
          <div className="card p-3 mb-4">
              {/* Form JSX */}
          </div>
      )}

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Existing Licenses</h4>
          {!showForm && <button className="btn btn-primary" onClick={handleAddNewClick}>Add New License</button>}
        </div>

        <div className="card bg-light p-3 mb-3 page-search-filters">
            <div className="row g-2">
                <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by App No..." name="application_no" value={searchTerms.application_no} onChange={handleSearchChange} /></div>
                <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by Name..." name="name" value={searchTerms.name} onChange={handleSearchChange} /></div>
                <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by DOB (DD-MM-YYYY)..." name="dob" value={searchTerms.dob} onChange={handleSearchChange} /></div>
                <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by Mobile No..." name="mobile_no" value={searchTerms.mobile_no} onChange={handleSearchChange} /></div>
                <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by LL No..." name="ll_number" value={searchTerms.ll_number} onChange={handleSearchChange} /></div>
                <div className="col-md-auto"><button className="btn btn-secondary btn-sm w-100" onClick={resetSearch}>Reset</button></div>
            </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>App No</th><th>Name</th><th>Father's Name</th><th>DOB</th>
                <th>Mobile</th><th>Category</th><th>Stage</th><th>LL Number</th>
                <th>Validity</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="text-center">Loading...</td></tr>
              ) : licenses.length > 0 ? (
                licenses.map(license => (
                  <tr key={license.id}>
                    <td>{license.application_no || '-'}</td>
                    <td>{license.name || '-'}</td>
                    <td>{license.father_name || '-'}</td>
                    <td>{formatDateForDisplay(license.dob)}</td>
                    <td>{license.mobile_no || '-'}</td>
                    <td>
                        {(Array.isArray(license.category) ? license.category.join(', ') : '')}
                        {(license.category?.includes('OTHERS') && license.other_category) ? ` (${license.other_category})` : ''}
                    </td>
                    <td>
                        <span className={`badge bg-${license.application_stage === 'Approved' ? 'success' : license.application_stage === 'Rejected' ? 'danger' : 'secondary'}`}>
                            {license.application_stage}
                        </span>
                    </td>
                    <td>{license.ll_number || '-'}</td>
                    <td>{formatDateForDisplay(license.validity_from)} to {formatDateForDisplay(license.validity_upto)}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(license)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(license.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="10" className="text-center">No licenses found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
export default LearnerLicensePage;

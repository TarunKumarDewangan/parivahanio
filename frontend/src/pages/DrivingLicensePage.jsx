import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

// --- Initial State and Constants ---
const initialFormState = {
  dl_number: "", name: "", father_name: "", dob: "", mobile_no: "",
  address: "", category: [], other_category: "", validity_from: "",
  validity_upto: "", remarks: "",
};
const categoryOptions = ['MCWG', 'LMV', 'MCWOG', 'TRANS', 'ERIK', 'TRACTOR', 'OTHERS'];
const initialSearchState = { dl_number: "", name: "", mobile_no: "" };

// --- Helper Functions ---
const formatDateForDisplay = (dateString) => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        const day = String(adjustedDate.getDate()).padStart(2, '0');
        const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
        const year = adjustedDate.getFullYear();
        return `${day}-${month}-${year}`;
    } catch (error) { return "-"; }
};
const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        return adjustedDate.toISOString().split('T')[0];
    } catch (error) { return ""; }
};

// --- Component ---
const DrivingLicensePage = () => {
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editLicense, setEditLicense] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerms, setSearchTerms] = useState(initialSearchState);

  // --- Data Fetching and Filtering ---
  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/driving-licenses");
      setLicenses(data.licenses || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load licenses.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLicenses(); }, []);

  useEffect(() => {
    let result = licenses.filter(license =>
      (license.dl_number || '').toUpperCase().includes(searchTerms.dl_number.toUpperCase()) &&
      (license.name || '').toUpperCase().includes(searchTerms.name.toUpperCase()) &&
      (license.mobile_no || '').includes(searchTerms.mobile_no)
    );
    setFilteredLicenses(result);
  }, [searchTerms, licenses]);

  // --- Event Handlers ---
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };
  const resetSearch = () => { setSearchTerms(initialSearchState); };
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
    const url = editLicense ? `/driving-licenses/${editLicense.id}` : "/driving-licenses";
    const method = editLicense ? "put" : "post";
    try {
      const { data } = await apiClient[method](url, formData);
      setMessage(data.message);
      setFormData(initialFormState);
      setEditLicense(null);
      setShowForm(false);
      fetchLicenses();
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Error saving license.`;
      const validationErrors = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
      setMessage(`${errorMsg} ${validationErrors}`);
    }
  };

  const startEdit = (license) => {
    setEditLicense(license);

    // ✅ FIX: Create a "clean" object for the form, converting nulls to empty strings.
    const formSafeLicense = {};
    for (const key in initialFormState) {
        formSafeLicense[key] = license[key] === null ? "" : license[key];
    }

    // Set the form state with the clean object, and format dates separately.
    setFormData({
        ...formSafeLicense,
        dob: formatDateForInput(license.dob),
        validity_from: formatDateForInput(license.validity_from),
        validity_upto: formatDateForInput(license.validity_upto),
    });

    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Driving License?")) return;
    try {
      const { data } = await apiClient.delete(`/driving-licenses/${id}`);
      setMessage(data.message);
      fetchLicenses();
    } catch (err) {
        setMessage(err.response?.data?.message || "Error deleting license.");
    }
  };
  const cancelAction = () => { setEditLicense(null); setFormData(initialFormState); setShowForm(false); };
  const handleAddNewClick = () => { setEditLicense(null); setFormData(initialFormState); setShowForm(true); };

  return (
    <Layout>
      <h2 className="mb-3">Manage Driving Licenses</h2>
      {message && <div className="alert alert-info" role="alert">{message}</div>}

      {showForm && (
        <div className="card p-3 mb-4">
          <h4>{editLicense ? "Edit Driving License" : "Add New Driving License"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4"><label className="form-label">DL Number</label><input type="text" name="dl_number" value={formData.dl_number} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-4"><label className="form-label">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-4"><label className="form-label">Father's Name</label><input type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-4"><label className="form-label">Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-4"><label className="form-label">Mobile No</label><input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-4"><label className="form-label">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-12">
                <label className="form-label d-block">Category</label>
                <div className="d-flex flex-wrap gap-3 p-2 border rounded">
                  {categoryOptions.map((cat) => (
                    <div className="form-check" key={cat}><input className="form-check-input" type="checkbox" id={`cat-dl-${cat}`} value={cat} checked={(formData.category || []).includes(cat)} onChange={handleCheckboxChange} /><label className="form-check-label" htmlFor={`cat-dl-${cat}`}>{cat}</label></div>
                  ))}
                </div>
              </div>
              {(formData.category || []).includes('OTHERS') && (
                <div className="col-md-4"><label className="form-label">Please Specify Other Category</label><input type="text" name="other_category" value={formData.other_category} onChange={handleChange} className="form-control" placeholder="e.g., Heavy Vehicle" required /></div>
              )}
              <div className="col-md-6"><label className="form-label">Validity From</label><input type="date" name="validity_from" value={formData.validity_from} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-6"><label className="form-label">Validity Upto</label><input type="date" name="validity_upto" value={formData.validity_upto} onChange={handleChange} className="form-control" /></div>
              <div className="col-12"><label className="form-label">Remarks</label><textarea name="remarks" value={formData.remarks} onChange={handleChange} className="form-control" /></div>
              <div className="col-12 d-flex gap-2 justify-content-end mt-3">
                <button type="submit" className="btn btn-primary">{editLicense ? "Update License" : "Add License"}</button>
                <button type="button" className="btn btn-secondary" onClick={cancelAction}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Existing Driving Licenses</h4>
          {!showForm && <button className="btn btn-primary" onClick={handleAddNewClick}>Add New License</button>}
        </div>
        <div className="card bg-light p-3 mb-3">
          <div className="row g-2">
            <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by DL No..." name="dl_number" value={searchTerms.dl_number} onChange={handleSearchChange} /></div>
            <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by Name..." name="name" value={searchTerms.name} onChange={handleSearchChange} /></div>
            <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by Mobile No..." name="mobile_no" value={searchTerms.mobile_no} onChange={handleSearchChange} /></div>
            <div className="col-md-auto"><button className="btn btn-secondary btn-sm w-100" onClick={resetSearch}>Reset</button></div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>DL Number</th><th>Name</th><th>Father's Name</th><th>Category</th><th>Validity</th><th style={{minWidth: '120px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
              ) : filteredLicenses.length > 0 ? (
                filteredLicenses.map((license) => (
                  <tr key={license.id}>
                    <td>{license.dl_number || "-"}</td>
                    <td>{license.name || "-"}</td>
                    <td>{license.father_name || "-"}</td>
                    <td>
                        {(Array.isArray(license.category) ? license.category.join(', ') : '')}
                        {(license.category?.includes('OTHERS') && license.other_category) ? ` (${license.other_category})` : ''}
                    </td>
                    <td>{formatDateForDisplay(license.validity_from)} to {formatDateForDisplay(license.validity_upto)}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(license)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(license.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center">No licenses found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default DrivingLicensePage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

const initialFormState = {
  name: '', mobile_no: '', email: '', birth_date: '',
  relation_type: 'S/O', relation_name: '', address: '', state: '', city: ''
};

const initialSearchState = { name: '', mobile_no: '', vehicle_no: '' };

// ✅ HELPER FUNCTION: Splits an array into smaller arrays (chunks) of a specified size.
const chunkArray = (array, size) => {
  if (!array || !Array.isArray(array)) return [];
  const chunkedArr = [];
  let index = 0;
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
};

const CitizenPage = () => {
  const [citizens, setCitizens] = useState([]);
  const [filteredCitizens, setFilteredCitizens] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editCitizen, setEditCitizen] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerms, setSearchTerms] = useState(initialSearchState);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/citizens");
      setCitizens(data || []);
      setFilteredCitizens(data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load citizens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  useEffect(() => {
    let result = citizens.filter(citizen => {
        const nameMatch = (citizen.name || '').toUpperCase().includes(searchTerms.name.toUpperCase());
        const mobileMatch = (citizen.mobile_no || '').includes(searchTerms.mobile_no);
        const vehicleMatch = searchTerms.vehicle_no.trim() === '' ? true :
            (citizen.vehicles || []).some(vehicle =>
                (vehicle.registration_no || '').toUpperCase().includes(searchTerms.vehicle_no.toUpperCase())
            );
        return nameMatch && mobileMatch && vehicleMatch;
    });
    setFilteredCitizens(result);
  }, [searchTerms, citizens]);

  const handleSearchChange = (e) => {
      const { name, value } = e.target;
      setSearchTerms(prev => ({...prev, [name]: value.toUpperCase()}));
  }

  const resetSearch = () => {
      setSearchTerms(initialSearchState);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = e.target.type === 'text' ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editCitizen ? `/citizens/${editCitizen.id}` : "/citizens";
    const method = editCitizen ? "put" : "post";
    try {
      await apiClient[method](url, formData);
      setMessage(editCitizen ? "Citizen updated successfully" : "Citizen created successfully");
      setFormData(initialFormState);
      setEditCitizen(null);
      setShowForm(false);
      fetchCitizens();
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Error saving citizen.`;
      const validationErrors = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
      setMessage(`${errorMsg} ${validationErrors}`);
    }
  };

  const startEdit = (citizen) => {
    setEditCitizen(citizen);
    setFormData({
      ...citizen,
      birth_date: citizen.birth_date ? citizen.birth_date.split('T')[0] : ""
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this citizen and all their vehicles?")) return;
    try {
      await apiClient.delete(`/citizens/${id}`);
      setMessage("Citizen deleted successfully");
      fetchCitizens();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting citizen.");
    }
  };

  const cancelAction = () => {
    setEditCitizen(null);
    setFormData(initialFormState);
    setShowForm(false);
  };

  return (
    <Layout>
      <h2 className="mb-3">Manage Citizens</h2>
      {message && <div className="alert alert-info" role="alert">{message}</div>}

      {showForm && (
         <div className="card p-3 mb-4">
          <h4>{editCitizen ? "Edit Citizen Profile" : "Create New Citizen Profile"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required /></div>
              <div className="col-md-6"><label className="form-label">Mobile Number *</label><input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} className="form-control" required /></div>
              <div className="col-md-6"><label className="form-label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-6"><label className="form-label">Birth Date</label><input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-6"><label className="form-label">Son/Wife/Daughter of</label><div className="input-group"><select name="relation_type" value={formData.relation_type} onChange={handleChange} className="form-select" style={{maxWidth: '120px'}}><option value="S/O">S/O</option><option value="W/O">W/O</option><option value="D/O">D/O</option></select><input type="text" name="relation_name" value={formData.relation_name} onChange={handleChange} className="form-control" placeholder="Relation's Name"/></div></div>
              <div className="col-md-6"><label className="form-label">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-6"><label className="form-label">State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" /></div>
              <div className="col-md-6"><label className="form-label">City / District</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" /></div>
              <div className="col-12 d-flex gap-2 justify-content-end mt-3">
                <button type="submit" className="btn btn-primary">{editCitizen ? "Save Profile" : "Create Profile"}</button>
                <button type="button" className="btn btn-secondary" onClick={cancelAction}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Existing Citizens</h4>
          {!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add New Citizen</button>}
        </div>

        <div className="card bg-light p-3 mb-3">
          <div className="row g-2">
            <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by Name..." name="name" value={searchTerms.name} onChange={handleSearchChange} /></div>
            <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by Mobile No..." name="mobile_no" value={searchTerms.mobile_no} onChange={handleSearchChange} /></div>
            <div className="col-md"><input type="text" className="form-control form-control-sm" placeholder="Search by Vehicle No..." name="vehicle_no" value={searchTerms.vehicle_no} onChange={handleSearchChange} /></div>
            <div className="col-md-auto"><button className="btn btn-secondary btn-sm w-100" onClick={resetSearch}>Reset</button></div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>Name</th><th>Mobile No</th><th>City/District</th>
                <th style={{ minWidth: "300px" }}>Registered Vehicles</th>
                <th style={{minWidth: "260px"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
              ) : filteredCitizens.length > 0 ? (
                filteredCitizens.map((citizen) => (
                  <tr key={citizen.id}>
                    <td>{citizen.name || '-'}</td>
                    <td>{citizen.mobile_no || '-'}</td>
                    <td>{citizen.city || '-'}</td>

                    {/* ✅ UPDATED: Implemented nested mapping for the 3-per-line layout */}
                    <td>
                      {(citizen.vehicles && citizen.vehicles.length > 0) ? (
                        chunkArray(citizen.vehicles, 3).map((vehicleChunk, chunkIndex) => (
                          <div key={chunkIndex} className="d-flex gap-1 mb-1">
                            {vehicleChunk.map(vehicle => (
                              <Link
                                key={vehicle.id}
                                to={`/vehicles/${vehicle.id}/documents`}
                                className="badge bg-secondary text-decoration-none"
                              >
                                {vehicle.registration_no}
                              </Link>
                            ))}
                          </div>
                        ))
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <Link to={`/citizens/${citizen.id}/vehicles`} className="btn btn-sm btn-info me-2">Manage Vehicles</Link>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(citizen)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(citizen.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center">No citizens found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CitizenPage;

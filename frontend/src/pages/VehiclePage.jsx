import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

const initialFormState = { registration_no: '', type: '', make_model: '', chassis_no: '', engine_no: '' };

const VehiclePage = () => {
  const { citizenId } = useParams();
  const [citizen, setCitizen] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editVehicle, setEditVehicle] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVehicleData = async () => {
    setLoading(true);
    try {
      // Get the citizen's name for the header
      const citizenRes = await apiClient.get(`/citizens/${citizenId}`);
      setCitizen(citizenRes.data);

      // Get the list of vehicles for this citizen
      const vehiclesRes = await apiClient.get(`/citizens/${citizenId}/vehicles`);
      setVehicles(vehiclesRes.data);
    } catch (err) {
      setMessage("Failed to load data. You may not have permission to view this record.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, [citizenId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For creating, we post to the nested citizen's vehicle endpoint
    const url = editVehicle ? `/vehicles/${editVehicle.id}` : `/citizens/${citizenId}/vehicles`;
    const method = editVehicle ? "put" : "post";

    try {
      await apiClient[method](url, formData);
      setMessage(editVehicle ? "Vehicle updated successfully" : "Vehicle added successfully");
      setFormData(initialFormState);
      setEditVehicle(null);
      fetchVehicleData(); // Refresh the list
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Error saving vehicle.`;
      const validationErrors = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
      setMessage(`${errorMsg} ${validationErrors}`);
    }
  };

  const startEdit = (vehicle) => {
    setEditVehicle(vehicle);
    setFormData(vehicle);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle and all its documents?")) return;
    try {
      await apiClient.delete(`/vehicles/${id}`);
      setMessage("Vehicle deleted successfully");
      fetchVehicleData();
    } catch (err) {
       setMessage(err.response?.data?.message || "Error deleting vehicle.");
    }
  };

  const cancelAction = () => {
    setEditVehicle(null);
    setFormData(initialFormState);
  };

  if (loading && !citizen) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <Link to="/citizens" className="btn btn-sm btn-secondary mb-3">&larr; Back to Citizens List</Link>
      <h2 className="mb-3">Manage Vehicles for {citizen?.name}</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card p-3 mb-4">
        <h4>{editVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h4>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-end">
            <div className="col-md"><label>Registration No *</label><input type="text" name="registration_no" value={formData.registration_no} onChange={handleChange} className="form-control" required/></div>
            <div className="col-md"><label>Type</label><input type="text" name="type" value={formData.type} onChange={handleChange} className="form-control"/></div>
            <div className="col-md"><label>Make/Model</label><input type="text" name="make_model" value={formData.make_model} onChange={handleChange} className="form-control"/></div>
            <div className="col-md"><label>Chassis No</label><input type="text" name="chassis_no" value={formData.chassis_no} onChange={handleChange} className="form-control"/></div>
            <div className="col-md"><label>Engine No</label><input type="text" name="engine_no" value={formData.engine_no} onChange={handleChange} className="form-control"/></div>
            <div className="col-md-auto d-flex gap-2">
              <button type="submit" className="btn btn-primary">{editVehicle ? "Update" : "Add"}</button>
              {editVehicle && <button type="button" className="btn btn-secondary" onClick={cancelAction}>Cancel</button>}
            </div>
          </div>
        </form>
      </div>

      <div className="card p-3">
        <h4>Existing Vehicles</h4>
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead>
              <tr><th>Reg. No</th><th>Make/Model</th><th>Chassis No</th><th style={{width: '280px'}}>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr><td colSpan="4" className="text-center">Loading...</td></tr>
              ) : vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.registration_no}</td>
                    <td>{vehicle.make_model || '-'}</td>
                    <td>{vehicle.chassis_no || '-'}</td>
                    <td>
                      <Link to={`/vehicles/${vehicle.id}/documents`} className="btn btn-sm btn-success me-2">Manage Documents</Link>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(vehicle)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vehicle.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center">No vehicles found for this citizen.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default VehiclePage;

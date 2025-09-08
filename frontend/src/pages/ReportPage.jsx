import React, { useState } from "react";
import apiClient from "../api/axiosConfig";
import Layout from "../components/Layout";

const initialSearchState = {
    name: '', mobile_no: '', vehicle_no: '', ll_no: '', from_date: '', to_date: ''
};

const ReportPage = () => {
    const [searchParams, setSearchParams] = useState(initialSearchState);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Please enter search criteria and click 'Search'.");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({...prev, [name]: value.toUpperCase() }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setResults([]);

        try {
            // Filter out empty params to keep the URL clean
            const activeParams = Object.fromEntries(
                Object.entries(searchParams).filter(([_, value]) => value !== '')
            );

            const { data } = await apiClient.get('/reports/expiring-documents', {
                params: activeParams
            });

            setResults(data);
            if (data.length === 0) {
                setMessage("No records found matching your criteria.");
            }
        } catch (error) {
            setMessage("An error occurred while fetching the report.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchParams(initialSearchState);
        setResults([]);
        setMessage("Please enter search criteria and click 'Search'.");
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <Layout>
            <h2 className="mb-3">Expiry Report</h2>

            <div className="card p-3 mb-4">
                <h4>Search Filters</h4>
                <form onSubmit={handleSearch}>
                    <div className="row g-3">
                        <div className="col-md-4"><label>Holder Name</label><input type="text" name="name" value={searchParams.name} onChange={handleChange} className="form-control" /></div>
                        <div className="col-md-4"><label>Mobile No</label><input type="text" name="mobile_no" value={searchParams.mobile_no} onChange={handleChange} className="form-control" /></div>
                        <div className="col-md-4"><label>Vehicle No</label><input type="text" name="vehicle_no" value={searchParams.vehicle_no} onChange={handleChange} className="form-control" /></div>
                        <div className="col-md-4"><label>Learner License No</label><input type="text" name="ll_no" value={searchParams.ll_no} onChange={handleChange} className="form-control" /></div>
                        <div className="col-md-4"><label>Expiry From</label><input type="date" name="from_date" value={searchParams.from_date} onChange={handleChange} className="form-control" /></div>
                        <div className="col-md-4"><label>Expiry Upto</label><input type="date" name="to_date" value={searchParams.to_date} onChange={handleChange} className="form-control" /></div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
                    </div>
                </form>
            </div>

            <div className="card p-3">
                <h4>Search Results</h4>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Holder Name</th>
                                <th>Mobile No</th>
                                <th>Vehicle No</th>
                                <th>Document Type</th>
                                <th>Document Details</th>
                                <th>Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                            ) : results.length > 0 ? (
                                results.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.holder_name || '-'}</td>
                                        <td>{item.mobile_no || '-'}</td>
                                        <td>{item.vehicle_no || '-'}</td>
                                        <td>{item.document_type || '-'}</td>
                                        <td>{item.document_details || '-'}</td>
                                        <td>{formatDate(item.expiry_date)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center">{message}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default ReportPage;

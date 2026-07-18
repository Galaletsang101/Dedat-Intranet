import { useState } from "react";
import "../styles/it.css";

function IT() {
	const [form, setForm] = useState({ issue: "", details: "", urgency: "low" });

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((s) => ({ ...s, [name]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();
		
		console.log("IT support request:", form);
		alert("Request submitted — check console for payload.");
		setForm({ issue: "", details: "", urgency: "low" });
	}

	return (
		<div className="it-page">
			<div className="it-card">
				<h2 className="it-title">IT Support Ticket</h2>
				<p className="it-sub">Submit a request to the Dedat technical team. We typically respond within 2 hours.</p>

				<form onSubmit={handleSubmit} className="it-form">
					<label className="field">
						<span className="label-text">What's the issue?</span>
						<input
							name="issue"
							value={form.issue}
							onChange={handleChange}
							placeholder="e.g., Cannot connect to VPN"
							className="input"
						/>
					</label>

					<label className="field">
						<span className="label-text">Tell us more</span>
						<textarea
							name="details"
							value={form.details}
							onChange={handleChange}
							placeholder="Describe the problem in detail..."
							className="textarea"
							rows={5}
						/>
					</label>

					<div className="field urgency">
						<span className="label-text">How urgent is it?</span>
						<div className="urgency-options">
							<label className={`urgency-btn ${form.urgency === "low" ? "active" : ""}`}>
								<input type="radio" name="urgency" value="low" checked={form.urgency === "low"} onChange={handleChange} />
								Low
							</label>
							<label className={`urgency-btn ${form.urgency === "medium" ? "active" : ""}`}>
								<input type="radio" name="urgency" value="medium" checked={form.urgency === "medium"} onChange={handleChange} />
								Medium
							</label>
							<label className={`urgency-btn ${form.urgency === "high" ? "active" : ""}`}>
								<input type="radio" name="urgency" value="high" checked={form.urgency === "high"} onChange={handleChange} />
								High
							</label>
						</div>
					</div>

					<div className="actions">
						<button type="submit" className="submit">Submit Request</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default IT;

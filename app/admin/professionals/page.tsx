"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProfessionalProfile, ProfessionalProfileInsert } from "@/lib/types";
import { formatPriceWithSession } from "@/lib/utils";
import { FormInput, FormTextarea, FormSelect } from "@/components/FormComponents";

export default function AdminProfessionalsPage() {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfessionalProfile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOtherCompany, setShowOtherCompany] = useState(false);
  const [customCompany, setCustomCompany] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState<ProfessionalProfileInsert>({
    name: "",
    company: "",
    role_title: "",
    industry: "",
    bio: "",
    price_cents: 20000,
    calendly_link: "",
    is_approved: true,
  });

  useEffect(() => {
    checkAdminAndFetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAdminAndFetchProfiles() {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // Check if user is admin
    const response = await fetch("/api/admin/check");
    const { isAdmin: adminStatus } = await response.json();
    
    if (!adminStatus) {
      setError("Unauthorized: Admin access required");
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    await fetchProfiles();
  }

  async function fetchProfiles() {
    const response = await fetch("/api/admin/professionals");
    const data = await response.json();
    
    if (data.error) {
      setError(data.error);
    } else {
      setProfiles(data);
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Use custom company if "Other" is selected
    const finalFormData = {
      ...formData,
      company: showOtherCompany ? customCompany : formData.company,
    };

    const url = editingProfile
      ? `/api/admin/professionals/${editingProfile.id}`
      : "/api/admin/professionals";
    
    const method = editingProfile ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalFormData),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setMessage(editingProfile ? "Profile updated successfully!" : "Profile created successfully!");
      setShowForm(false);
      setEditingProfile(null);
      resetForm();
      await fetchProfiles();
    }
  };

  const handleEdit = (profile: ProfessionalProfile) => {
    setEditingProfile(profile);
    
    // Check if company is in the predefined list
    const predefinedCompanies = [
      "McKinsey & Company", "Bain & Company", "Boston Consulting Group (BCG)", "Deloitte", 
      "Accenture", "PwC", "EY", "KPMG", "Goldman Sachs", "Morgan Stanley", "J.P. Morgan",
      "Bank of America", "Citi", "Barclays", "BlackRock", "Bridgewater", "Jane Street",
      "Citadel", "Two Sigma", "Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix",
      "Stripe", "Airbnb", "Uber", "Databricks", "OpenAI"
    ];
    
    const isOther = !predefinedCompanies.includes(profile.company);
    
    setFormData({
      name: profile.name,
      company: isOther ? "Other" : profile.company,
      role_title: profile.role_title,
      industry: profile.industry,
      bio: profile.bio,
      price_cents: profile.price_cents,
      calendly_link: profile.calendly_link || "",
      is_approved: profile.is_approved,
    });
    
    if (isOther) {
      setShowOtherCompany(true);
      setCustomCompany(profile.company);
    } else {
      setShowOtherCompany(false);
      setCustomCompany("");
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;

    const response = await fetch(`/api/admin/professionals/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setMessage("Profile deleted successfully!");
      await fetchProfiles();
    }
  };

  const handleToggleApproval = async (profile: ProfessionalProfile) => {
    const response = await fetch(`/api/admin/professionals/${profile.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: !profile.is_approved }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setMessage(`Profile ${!profile.is_approved ? "approved" : "unapproved"} successfully!`);
      await fetchProfiles();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      role_title: "",
      industry: "",
      bio: "",
      price_cents: 20000,
      calendly_link: "",
      is_approved: true,
    });
    setShowOtherCompany(false);
    setCustomCompany("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProfile(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Unauthorized access"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Manage Professionals</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            + Add Professional
          </button>
        )}
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingProfile ? "Edit Professional" : "Add New Professional"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Name *"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <FormSelect
                  label="Company *"
                  value={formData.company}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, company: value });
                    setShowOtherCompany(value === "Other");
                    if (value !== "Other") {
                      setCustomCompany("");
                    }
                  }}
                  required
                >
                  <option value="">Select a company</option>
                  <optgroup label="Consulting">
                    <option value="McKinsey & Company">McKinsey & Company</option>
                    <option value="Bain & Company">Bain & Company</option>
                    <option value="Boston Consulting Group (BCG)">Boston Consulting Group (BCG)</option>
                    <option value="Deloitte">Deloitte</option>
                    <option value="Accenture">Accenture</option>
                    <option value="PwC">PwC</option>
                    <option value="EY">EY</option>
                    <option value="KPMG">KPMG</option>
                  </optgroup>
                  <optgroup label="Finance">
                    <option value="Goldman Sachs">Goldman Sachs</option>
                    <option value="Morgan Stanley">Morgan Stanley</option>
                    <option value="J.P. Morgan">J.P. Morgan</option>
                    <option value="Bank of America">Bank of America</option>
                    <option value="Citi">Citi</option>
                    <option value="Barclays">Barclays</option>
                    <option value="BlackRock">BlackRock</option>
                    <option value="Bridgewater">Bridgewater</option>
                    <option value="Jane Street">Jane Street</option>
                    <option value="Citadel">Citadel</option>
                    <option value="Two Sigma">Two Sigma</option>
                  </optgroup>
                  <optgroup label="Tech">
                    <option value="Google">Google</option>
                    <option value="Meta">Meta</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Apple">Apple</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Uber">Uber</option>
                    <option value="Databricks">Databricks</option>
                    <option value="OpenAI">OpenAI</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="Other">Other (type manually)</option>
                  </optgroup>
                </FormSelect>
                
                {showOtherCompany && (
                  <div className="mt-2">
                    <FormInput
                      label="Custom Company Name *"
                      type="text"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      required
                      placeholder="Enter company name"
                    />
                  </div>
                )}
              </div>

              <FormInput
                label="Role Title *"
                type="text"
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                required
              />

              <FormInput
                label="Industry *"
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
              />

              <FormInput
                label="Price (in cents) *"
                type="number"
                value={formData.price_cents}
                onChange={(e) => setFormData({ ...formData, price_cents: parseInt(e.target.value) })}
                required
                min={0}
                step={100}
                helperText={`Preview: ${formatPriceWithSession(formData.price_cents)}`}
              />

              <FormInput
                label="Calendly Link"
                type="url"
                value={formData.calendly_link || ""}
                onChange={(e) => setFormData({ ...formData, calendly_link: e.target.value })}
                placeholder="https://calendly.com/..."
                helperText="Used on booking success page"
              />
            </div>

            <FormTextarea
              label="Bio *"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              rows={4}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_approved"
                checked={formData.is_approved}
                onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <label htmlFor="is_approved" className="ml-2 block text-sm text-gray-700">
                Approved (visible to public)
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors"
              >
                {editingProfile ? "Update Profile" : "Create Profile"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {profile.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {profile.company}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {profile.role_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatPriceWithSession(profile.price_cents)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      profile.is_approved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {profile.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleApproval(profile)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {profile.is_approved ? "Unapprove" : "Approve"}
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {profiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No professionals yet. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

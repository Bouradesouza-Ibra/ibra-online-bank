function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
      window.location.href = "/login";
      return null;
    }
  
    return (
      <div className="page">
        <div className="card">
          <h1>User Profile</h1>
  
          <p>
            <strong>Full Name:</strong>
            <br />
            {user.full_name}
          </p>
  
          <p>
            <strong>Email:</strong>
            <br />
            {user.email}
          </p>
  
          <p>
            <strong>User ID:</strong>
            <br />
            {user.id}
          </p>
  
          <button onClick={() => (window.location.href = "/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  export default Profile;
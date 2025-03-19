import '../navbar/navbar.css'
function Navbar() {
  return (
      <>
          <div className="navbar">
    <div className="logo">
      E-<span>Pharmacy</span>
    </div>
    <nav>
      <a href="home.html">Home</a>
      <a href="about_us.html">About</a>
      <a href="terms_of_service.html">Services</a>
      <a href="contact_us.html">Contact</a>
      <a href="sign.html">Sign Up</a>
    </nav>
  </div>
    </>
  )
}

export default Navbar


function DrugStore() {
  return (
      <>
           <div className="main">
    <header>
      <h1>Drug Store</h1>
      <nav>
        <a href="home.html">
          <button>Sign out</button>
        </a>
      </nav>
    </header>
    <div className="search-bar">
      <input type="text" id="search" placeholder="Search your medication" />
    </div>
    <div className="products" id="productList">
      <div className="product" data-name="Paracetamol">
        {/* <img src="para.jpg" alt="Paracetamol" /> Placeholder for image */}
        <h3>Paracetamol</h3>
        <p>An over-the-counter (OTC) pain reliever and fever reducer.</p>
        <button>Add to cart</button>
      </div>
      <div className="product" data-name="Pain Relievers">
        {/* <img src="pain.jpg" alt="Pain Relievers" />{" "} */}
        {/* Placeholder for image */}
        <h3>Pain Relievers</h3>
        <p>An over-the-counter (OTC) pain reliever and fever reducer.</p>
        <button>Add to cart</button>
      </div>
      <div className="product" data-name="Ibuprofen">
        <img src="ibu.jpg" alt="Ibuprofen" /> {/* Placeholder for image */}
        <h3>Ibuprofen</h3>
        <p>A non-steroidal anti-inflammatory drug (NSAID).</p>
        <button>Add to cart</button>
      </div>
      <div className="product" data-name="Dexa">
        <img src="dexa.jpg" alt="Paracetamol" /> {/* Placeholder for image */}
        <h3>Dexa</h3>
        <p>An over-the-counter (OTC) pain reliever and fever reducer.</p>
        <button>Add to cart</button>
      </div>
      <div className="product" data-name="Flue cap">
        <img src="flue.jpg" alt="Pain Relievers" />{" "}
        {/* Placeholder for image */}
        <h3>Flue cap</h3>
        <p>An over-the-counter (OTC) pain reliever and fever reducer.</p>
        <button>Add to cart</button>
      </div>
      <div className="product" data-name="Amoxiline">
        <img src="am.jpg" alt="Ibuprofen" /> {/* Placeholder for image */}
        <h3>Amoxiline</h3>
        <p>A non-steroidal anti-inflammatory drug (NSAID).</p>
        <button>Add to cart</button>
      </div>
    </div>
  </div>
  <div className="modal" id="modal">
    <div className="modal-content" id="modalContent">
      <img src="" alt="Product Image" id="modalImage" />
      <h3 id="modalTitle">Product Name</h3>
      <p id="modalDescription">Product Description</p>
      <button id="closeModal">Close</button>
    </div>
  </div>
    </>
  )
}

export default DrugStore

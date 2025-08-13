document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    
    document.getElementById("registrationForm").style.display = "none";

    
    document.getElementById("successMessage").style.display = "block";

    
    document
      .getElementById("successMessage")
      .scrollIntoView({ behavior: "smooth" });

  });

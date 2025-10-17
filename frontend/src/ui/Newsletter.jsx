const Newsletter = () => {
  return (
    <>
      <div className="newsletter-container">
        <h2>
          Assine a nossa <span>Newsletter</span>
        </h2>
        <form action="">
          <input type="email" name="email" id="email" placeholder="Digite o seu e-mail" />
          <input type="submit" className="btn btn-half" value="Assinar" />
        </form>
        <div className="social-media">
          <i className="fab fa-meta"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-x-twitter"></i>
          <i className="fab fa-pinterest-p"></i>
        </div>
      </div>
    </>
  );
};

export default Newsletter;

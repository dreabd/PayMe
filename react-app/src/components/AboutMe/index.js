import "./AboutMe.css"

function AboutMe() {
  return (
      <div className="about-me-container">
        <p>Connect with Me:</p>
        <div className="links-container">
          <a className="navlink important-navlinks" href="https://www.linkedin.com/in/andre-chris-abad-b1a55215a/" target="_blank">
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a className="navlink important-navlinks" href="https://wellfound.com/u/andre-abad" target="_blank">
            <i class="fa-brands fa-angellist"></i>
          </a>
          <a className="navlink important-navlinks" href="https://dreabd.github.io/" target="_blank">
            <i class="fa-solid fa-globe"></i>
          </a>
          <a className="navlink important-navlinks" href="https://github.com/dreabd/" target="_blank">
            <i class="fa-brands fa-github"></i>
          </a>
        </div>
      </div>
  )
}

export default AboutMe

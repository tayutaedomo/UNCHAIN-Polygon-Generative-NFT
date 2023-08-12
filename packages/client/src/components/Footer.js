import "./Footer.css";
import twitter_white from "../assets/twitter.png";
import discord_white from "../assets/discord.png";
import instagram_white from "../assets/instagram.png";

function Footer(props) {
  return (
    <footer className="footer">
      <p>
        SMART CONTRACT ADDRESS:
        <br />
        <span>
          <a
            className="contract-link"
            href={`https://mumbai.polygonscan.com/address/${props.address}`}
            target="_black"
            rel="noreferrer"
          >
            {props.address}
          </a>
        </span>
      </p>
      <div className="footer-social-media-links">
        <div>
          <a href="http://example.com" target="_black" rel="noreferrer">
            <img src={discord_white} alt="Discord" />
          </a>
        </div>
        <div>
          <a href="http://example.com" target="_black" rel="noreferrer">
            <img src={instagram_white} alt="Instagram" />
          </a>
        </div>
        <div>
          <a href="http://example.com" target="_black" rel="noreferrer">
            <img src={twitter_white} alt="Twitter" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

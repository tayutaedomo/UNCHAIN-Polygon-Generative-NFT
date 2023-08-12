import "./Header.css";

function Header(props) {
  return (
    <header>
      <h1 className="heading gradient-text">
        <a href={props.opensea} target="_black" rel="noreferrer">
          Polygon Squirrels
        </a>
      </h1>
      <div>
        <button className="os-button">
          <a href={props.opensea} target="_black" rel="noreferrer">
            View Collection on OpenSea
          </a>
        </button>
      </div>
    </header>
  );
}

export default Header;

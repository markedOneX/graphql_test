export default function HeroBlock({ id, name, firstAddress, symbol, units }) {
  return (
    <div key={id}>
      <div>Name:{name}</div>
      <div>Symbol: {symbol}</div>
      <div>ID:{id}</div>
      <div>Contract Address:{firstAddress}</div>
      <div>Units: {firstUnit}</div>
      <div>
        Price: {randomMarketPrice} (Price is set randomely on every render)
      </div>
      <div>Market Cap: {firstUnit * randomMarketPrice}</div>
      <br />
    </div>
  );
}
